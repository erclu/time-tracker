// Compiled using ts2gas 1.6.0 (TypeScript 3.3.3)
var exports = exports || {};
var module = module || { exports: exports };

function testDelete() {
  var name = "manuale";
  var row = 2;
  deleteTracker(name, row);
}

function deleteTracker(trackerName, logsRow) {
  if (!trackerName || !logsRow) {
    return;
  }
  var logsSheet = SpreadsheetApp.getActiveSpreadsheet().getSheetByName(
    "CurrentTrackers");
  var trackersForm = SpreadsheetApp.getActiveSpreadsheet().getSheetByName(
    "GetTrackersForm");
  var deletedEvents = 0;
  for (var currentRow = trackersForm.getLastRow(); currentRow >
    0; currentRow--) {
    var values = trackersForm.getRange(currentRow, 2, 1, 6).getValues()[0];
    var currentTracker = values[0];
    if (trackerName == currentTracker) {
      var eventMade = values[4];
      if (eventMade) {
        Logger.log("found matching event");
        deletedEvents += deleteMatchingEvent(values[5]);
      }
      trackersForm.deleteRow(currentRow);
    }
  }
  logsSheet.setActiveRange(logsSheet.getRange("A1"));
  logsSheet.deleteRow(logsRow);
  return deletedEvents;
};

function deleteMatchingEvent(eventId) {
  var calId = PropertiesService.getScriptProperties().getProperty("calendarId");
  var calendar = CalendarApp.getCalendarById(calId);
  var event = calendar.getEventById(eventId);
  Logger.log("deleted 1 event for tracker \"" + event.getTitle() + "\"");
  event.deleteEvent();
  return 1;
}
