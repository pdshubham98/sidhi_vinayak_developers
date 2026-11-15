/**
 * Google Apps Script — Sidhivinayak Developers lead capture
 *
 * Sheet headers (Row 1) — 11 columns:
 * Timestamp | Status | Name | Phone | Role | Interest | Best Time | Email | Query | Connected? | Comments
 *
 * Columns 1–9 are filled automatically by this script.
 * Columns 10 (Connected?) and 11 (Comments) are filled manually by your team.
 *
 * Sheet access:
 * - Keep the sheet PRIVATE — share only with team members you choose.
 * - This script runs as you (the owner), so it can write even when the sheet is private.
 * - Customers only POST data through this script URL — they never see the sheet.
 *
 * To add a team member: Sheets → Share → enter their email → set Viewer or Editor.
 */

const NOTIFY_EMAIL = 'sales.siddhivinayakdevelopers@gmail.com';

function doPost(e) {
  var sheet = SpreadsheetApp.getActiveSpreadsheet().getActiveSheet();
  var data = JSON.parse(e.postData.contents);

  // Insert at Row 2 — newest lead always appears at the top
  sheet.insertRowBefore(2);

  var timestamp = Utilities.formatDate(new Date(), 'Asia/Kolkata', 'dd-MMM-yyyy hh:mm a');
  var formLabel = data.formType === 'sell' ? 'Sell' : data.formType === 'contact' ? 'Contact' : 'Requirement';

  var rowValues = [[
    timestamp,
    '🔴 NEW',
    data.name        || '-',
    "'" + (data.phone || '-'),
    data.userRole    || '-',
    data.lookingFor  || data.propertyType || formLabel,
    data.callbackTime || 'Anytime',
    data.email       || '-',
    data.message     || data.location    || '-',
  ]];

  var range = sheet.getRange(2, 1, 1, 9);
  range.setValues(rowValues);
  range.setBackground('#e6f4ea'); // soft green for new leads

  // Add dropdown for "Connected?" in column 10
  var connectedCell = sheet.getRange(2, 10);
  var rule = SpreadsheetApp.newDataValidation()
    .requireValueInList(['Yes', 'No', 'Follow up'], true)
    .build();
  connectedCell.setDataValidation(rule);

  MailApp.sendEmail({
    to: NOTIFY_EMAIL,
    subject: '🏡 [' + formLabel + '] New inquiry: ' + (data.name || 'Unknown') + ' — ' + (data.phone || ''),
    body:
      'New website inquiry (IST: ' + timestamp + ')\n\n' +
      'Form:          ' + formLabel + '\n' +
      'Name:          ' + (data.name || '-') + '\n' +
      'Phone:         ' + (data.phone || '-') + '\n' +
      'Role:          ' + (data.userRole || '-') + '\n' +
      'Looking for:   ' + (data.lookingFor || data.propertyType || '-') + '\n' +
      'Best time:     ' + (data.callbackTime || 'Anytime') + '\n' +
      'Email:         ' + (data.email || 'Not provided') + '\n' +
      'Message:       ' + (data.message || data.location || 'None') + '\n\n' +
      'View all leads: ' + SpreadsheetApp.getActiveSpreadsheet().getUrl(),
  });

  return ContentService
    .createTextOutput(JSON.stringify({ result: 'success' }))
    .setMimeType(ContentService.MimeType.JSON);
}
