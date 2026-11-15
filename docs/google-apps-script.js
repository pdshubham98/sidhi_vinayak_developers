/**
 * Google Apps Script — Sidhivinayak Developers lead capture
 *
 * Setup:
 * 1. Create a Google Sheet with headers in Row 1:
 *    Timestamp | Status | Name | Phone | Role | Interest | Best Time | Email | Query
 * 2. Open Extensions → Apps Script, paste this code.
 * 3. Replace YOUR_EMAIL below with your Gmail address.
 * 4. Click Deploy → New deployment → Web App
 *    Execute as: Me | Who has access: Anyone → Deploy → copy the URL
 * 5. Set that URL as APPS_SCRIPT_URL in your .env (for future form wiring).
 *
 * Each new lead appears at Row 2 (newest first), highlighted in soft green.
 */

const NOTIFY_EMAIL = 'YOUR_EMAIL@gmail.com'; // ← change this

function doPost(e) {
  var sheet = SpreadsheetApp.getActiveSpreadsheet().getActiveSheet();
  var data = JSON.parse(e.postData.contents);

  sheet.insertRowBefore(2);

  var timestamp = Utilities.formatDate(new Date(), 'Asia/Kolkata', 'dd-MMM-yyyy hh:mm a');
  var rowValues = [[
    timestamp,
    '🔴 NEW',
    data.name        || '-',
    "'" + (data.phone || '-'),
    data.userRole    || '-',
    data.lookingFor  || '-',
    data.callbackTime || 'Anytime',
    data.email       || '-',
    data.message     || '-',
  ]];

  var range = sheet.getRange(2, 1, 1, 9);
  range.setValues(rowValues);
  range.setBackground('#e6f4ea');

  MailApp.sendEmail({
    to: NOTIFY_EMAIL,
    subject: '🏡 [' + (data.userRole || 'Lead') + '] New inquiry: ' + data.name + ' (' + (data.lookingFor || '') + ')',
    body:
      'New website inquiry (IST: ' + timestamp + ')\n\n' +
      'Name:          ' + (data.name || '-') + '\n' +
      'Phone:         ' + (data.phone || '-') + '\n' +
      'Role:          ' + (data.userRole || '-') + '\n' +
      'Looking for:   ' + (data.lookingFor || '-') + '\n' +
      'Best time:     ' + (data.callbackTime || 'Anytime') + '\n' +
      'Email:         ' + (data.email || 'Not provided') + '\n' +
      'Message:       ' + (data.message || 'None') + '\n\n' +
      'View all leads: ' + SpreadsheetApp.getActiveSpreadsheet().getUrl(),
  });

  return ContentService
    .createTextOutput(JSON.stringify({ result: 'success' }))
    .setMimeType(ContentService.MimeType.JSON);
}
