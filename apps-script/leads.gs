/**
 * Google Apps Script — Sidhivinayak Developers lead capture.
 *
 * This file is the source of truth. It does not deploy with the site; to update the
 * live copy open the leads spreadsheet → Extensions → Apps Script, replace everything
 * with this file, Save, then Deploy → Manage deployments → pencil icon → Version: New
 * version → Deploy. Keep the same deployment so the URL in PUBLIC_APPS_SCRIPT_URL
 * stays valid.
 *
 * Submissions are routed to one of three tabs, created on demand:
 *   Buyers             requirement form, and any buyer/investor role
 *   Sellers            sell form, and the seller role
 *   Dealers & Brokers  broker and builder roles
 *
 * Keep the sheet private (Share → Restricted) and add the team as Editors so they can
 * fill the Connected? and Comments columns.
 */

const NOTIFY_EMAIL = 'sales.siddhivinayakdevelopers@gmail.com';

/** Column A…P. buildRow() returns values in exactly this order. */
const HEADERS = [
  'Timestamp', 'Status', 'Name', 'Phone', 'Role', 'Interest',
  'Budget', 'Timeline', 'Area / Location', 'Size', 'Best time',
  'Email', 'Property', 'Message', 'Connected?', 'Comments',
];

const CONNECTED_COL = HEADERS.indexOf('Connected?') + 1;

function getOrCreateTab(ss, name) {
  const sheet = ss.getSheetByName(name) || ss.insertSheet(name);

  // Row 1 is rewritten whenever it is missing or stale. Writing headers only when the
  // tab was created left tabs made by earlier versions with no header row, which is why
  // Sheets fell back to labelling the columns "Column 1", "Column 2"…
  const stale = sheet.getRange(1, 1).getValue() !== HEADERS[0] ||
                sheet.getRange(1, HEADERS.length).getValue() !== HEADERS[HEADERS.length - 1];
  if (stale) {
    const missing = HEADERS.length - sheet.getMaxColumns();
    if (missing > 0) sheet.insertColumnsAfter(sheet.getMaxColumns(), missing);

    const header = sheet.getRange(1, 1, 1, HEADERS.length);
    header.setValues([HEADERS]);
    header.setFontWeight('bold').setBackground('#d9ead3');
    sheet.setFrozenRows(1);
    sheet.setColumnWidth(1, 160);   // Timestamp
    sheet.setColumnWidth(3, 150);   // Name
    sheet.setColumnWidth(14, 260);  // Message
    sheet.setColumnWidth(16, 200);  // Comments
  }
  return sheet;
}

function buildRow(data, timestamp) {
  return [
    timestamp,
    '🔴 NEW',
    data.name || '-',
    // Leading apostrophe keeps Sheets from eating the leading zero / +91.
    "'" + (data.phone || '-'),
    data.userRole || '-',
    data.lookingFor || data.propertyType || data.formType || '-',
    data.budget || data.expectedPrice || '-',
    data.timeline || '-',
    data.preferredArea || data.location || '-',
    data.size || '-',
    data.callbackTime || 'Anytime',
    data.email || '-',
    data.property || '-',
    data.message || '-',
    '',  // Connected? — filled by the team
    '',  // Comments   — filled by the team
  ];
}

function routeTab(data) {
  if (data.formType === 'sell' || data.userRole === 'seller') return 'Sellers';
  if (data.userRole === 'broker' || data.userRole === 'builder') return 'Dealers & Brokers';
  return 'Buyers';
}

function doPost(e) {
  const ss = SpreadsheetApp.getActiveSpreadsheet();
  const data = JSON.parse(e.postData.contents);

  const tabName = routeTab(data);
  const sheet = getOrCreateTab(ss, tabName);
  const timestamp = Utilities.formatDate(new Date(), 'Asia/Kolkata', 'dd-MMM-yyyy hh:mm a');

  sheet.insertRowBefore(2);
  const range = sheet.getRange(2, 1, 1, HEADERS.length);
  range.setValues([buildRow(data, timestamp)]);
  range.setBackground('#e6f4ea');

  sheet.getRange(2, CONNECTED_COL).setDataValidation(
    SpreadsheetApp.newDataValidation()
      .requireValueInList(['Yes', 'No', 'Follow up'], true)
      .build()
  );

  // The lead is already saved, so a mail quota or transient failure must not throw.
  try {
    MailApp.sendEmail({
      to: NOTIFY_EMAIL,
      subject: '🏡 [' + tabName + '] New inquiry: ' + (data.name || 'Unknown') + ' — ' + (data.phone || ''),
      body:
        'New website inquiry (IST: ' + timestamp + ')\n' +
        'Tab: ' + tabName + '\n\n' +
        'Name:          ' + (data.name || '-') + '\n' +
        'Phone:         ' + (data.phone || '-') + '\n' +
        'Role:          ' + (data.userRole || '-') + '\n' +
        'Looking for:   ' + (data.lookingFor || data.propertyType || '-') + '\n' +
        'Budget:        ' + (data.budget || data.expectedPrice || '-') + '\n' +
        'Timeline:      ' + (data.timeline || '-') + '\n' +
        'Area:          ' + (data.preferredArea || data.location || '-') + '\n' +
        'Size:          ' + (data.size || '-') + '\n' +
        'Best time:     ' + (data.callbackTime || 'Anytime') + '\n' +
        'Email:         ' + (data.email || 'Not provided') + '\n' +
        'Property:      ' + (data.property || '-') + '\n' +
        'Message:       ' + (data.message || 'None') + '\n\n' +
        'Open sheet: ' + ss.getUrl(),
    });
  } catch (err) {
    console.error('Lead row saved but notification email failed: ' + err);
  }

  return ContentService
    .createTextOutput(JSON.stringify({ result: 'success' }))
    .setMimeType(ContentService.MimeType.JSON);
}

/**
 * Run once from the Apps Script editor (Run → repairHeaders) to fix the existing tabs
 * without waiting for the next lead.
 */
function repairHeaders() {
  const ss = SpreadsheetApp.getActiveSpreadsheet();
  ['Buyers', 'Sellers', 'Dealers & Brokers'].forEach(function (name) {
    getOrCreateTab(ss, name);
  });
}
