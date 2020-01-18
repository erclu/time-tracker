function makeEvent(row) {
  if (!row) {
    Logger.log("makeEvent: no parameter passed");
    return;
  }
  var minEventLength = 1000 * 60 * 5; // in ms
  var calId = PropertiesService.getScriptProperties().getProperty("calendarId");
  var calendar = CalendarApp.getCalendarById(calId);
  var ss = SpreadsheetApp.getActiveSpreadsheet();
  var trackersForm = ss.getSheetByName("GetTrackersForm");
  var rowValues = trackersForm.getRange(row, 2, 1, 5).getValues()[0]; // get cols B to F
  Logger.log(typeof rowValues[4]);
  if (rowValues[4]) {
    // if value of "Event made" column is true
    Logger.log("event was made");
    return;
  }
  var title = rowValues[0].toString();
  var startTime = new Date(Number(rowValues[1]) * 1000);
  var endTime = new Date(Number(rowValues[2]) * 1000);
  if (+endTime - +startTime < minEventLength) {
    trackersForm.getRange(row, 6).setValue(false);
  } else {
    var event = calendar.createEvent(title, startTime, endTime);
    var eventId = event.getId();
    trackersForm
      .getRange(row, 6, 1, 2)
      .setValues([[true, eventId]])
      .setFontFamily("Roboto Mono");
  }
}

function makeAll() {
  var rows = SpreadsheetApp.getActiveSpreadsheet()
    .getSheetByName("GetTrackersForm")
    .getLastRow();
  for (var i = 2; i <= rows; i++) {
    makeEvent(i);
  }
}
