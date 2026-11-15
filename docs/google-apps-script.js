/**
 * Google Apps Script — Sidhivinayak Developers lead capture
 *
 * Routes each submission to one of 3 tabs:
 *   - Buyers        → Buyer / Investor + all requirement form leads
 *   - Sellers       → Property Seller + all sell form leads
 *   - Dealers       → Broker / Channel Partner + Builder / Developer
 *
 * Tabs are created automatically on first run if they don't exist.
 *
 * Sheet access: keep the sheet PRIVATE (Share → Restricted).
 * Add team members by email with Editor access so they can fill
 * the Connected? and Comments columns. Customers never see the sheet.
 */

const NOTIFY_EMAIL = 'sales.siddhivinayakdevelopers@gmail.com';

const HEADERS = [
  'Timestamp', 'Status', 'Name', 'Phone', 'Role',
  'Interest', 'Best Time', 'Email', 'Query', 'Connected?', 'Comments'
];

function getOrCreateTab(spreadsheet, name) {
  var sheet = spreadsheet.getSheetByName(name);
  if (!sheet) {
    sheet = spreadsheet.insertSheet(name);
    var headerRange = sheet.getRange(1, 1, 1, HEADERS.length);
    headerRange.setValues([HEADERS]);
    headerRange.setFontWeight('bold').setBackground('#d9ead3');
    sheet.setFrozenRows(1);
    sheet.setColumnWidth(1, 160);  // Timestamp
    sheet.setColumnWidth(3, 150);  // Name
    sheet.setColumnWidth(9, 250);  // Query
    sheet.setColumnWidth(11, 200); // Comments
  }
  return sheet;
}

function doPost(e) {
  var ss = SpreadsheetApp.getActiveSpreadsheet();
  var data = JSON.parse(e.postData.contents);

  // Route to correct tab
  var tabName;
  if (data.formType === 'sell' || data.userRole === 'seller') {
    tabName = 'Sellers';
  } else if (data.userRole === 'broker' || data.userRole === 'builder') {
    tabName = 'Dealers & Brokers';
  } else if (data.lookingFor === 'construction') {
    tabName = 'Construction';
  } else {
    tabName = 'Buyers';
  }

  var sheet = getOrCreateTab(ss, tabName);

  sheet.insertRowBefore(2);

  var timestamp = Utilities.formatDate(new Date(), 'Asia/Kolkata', 'dd-MMM-yyyy hh:mm a');

  var rowValues = [[
    timestamp,
    '🔴 NEW',
    data.name        || '-',
    "'" + (data.phone || '-'),
    data.userRole    || '-',
    data.lookingFor  || data.propertyType || data.formType || '-',
    data.callbackTime || 'Anytime',
    data.email       || '-',
    data.message     || data.location    || '-',
    '',  // Connected? — filled by team
    '',  // Comments   — filled by team
  ]];

  var range = sheet.getRange(2, 1, 1, 11);
  range.setValues(rowValues);
  range.setBackground('#e6f4ea');

  // Dropdown for Connected? column
  var connectedCell = sheet.getRange(2, 10);
  var rule = SpreadsheetApp.newDataValidation()
    .requireValueInList(['Yes', 'No', 'Follow up'], true)
    .build();
  connectedCell.setDataValidation(rule);

  MailApp.sendEmail({
    to: NOTIFY_EMAIL,
    subject: '🏡 [' + tabName + '] New inquiry: ' + (data.name || 'Unknown') + ' — ' + (data.phone || ''),
    body:
      'New website inquiry (IST: ' + timestamp + ')\n' +
      'Tab: ' + tabName + '\n\n' +
      'Name:         ' + (data.name || '-') + '\n' +
      'Phone:        ' + (data.phone || '-') + '\n' +
      'Role:         ' + (data.userRole || '-') + '\n' +
      'Looking for:  ' + (data.lookingFor || data.propertyType || '-') + '\n' +
      'Best time:    ' + (data.callbackTime || 'Anytime') + '\n' +
      'Email:        ' + (data.email || 'Not provided') + '\n' +
      'Message:      ' + (data.message || data.location || 'None') + '\n\n' +
      'Open sheet: ' + ss.getUrl(),
  });

  return ContentService
    .createTextOutput(JSON.stringify({ result: 'success' }))
    .setMimeType(ContentService.MimeType.JSON);
}
