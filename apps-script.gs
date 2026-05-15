// Google Apps Script — Gaby & Cris · RSVP → Google Sheets
// Desplegar como Web App: Ejecutar como "Yo", Acceso "Cualquier persona"

const HEADERS = ['Fecha', 'Nombre', 'Apellidos', 'Edad', 'Asistencia', 'Alergias'];

function doPost(e) {
  try {
    var sheet = SpreadsheetApp.getActiveSpreadsheet().getActiveSheet();

    // Agrega encabezados automáticamente si la hoja está vacía
    if (sheet.getLastRow() === 0) {
      sheet.appendRow(HEADERS);
      sheet.getRange(1, 1, 1, HEADERS.length).setFontWeight('bold');
    }

    var data = JSON.parse(e.postData.contents);

    sheet.appendRow([
      new Date(),
      data.from_name  || '',
      data.last_name  || '',
      data.age        || '',
      data.attendance || '',
      data.allergies  || '',
    ]);

    return ContentService
      .createTextOutput(JSON.stringify({ status: 'ok' }))
      .setMimeType(ContentService.MimeType.JSON);

  } catch (err) {
    return ContentService
      .createTextOutput(JSON.stringify({ status: 'error', message: err.toString() }))
      .setMimeType(ContentService.MimeType.JSON);
  }
}
