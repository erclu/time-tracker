function testDelete() {
  const name = "manuale";
  const row = 2;
  deleteTracker(name, row);
}

function deleteTracker(trackerName: string, logsRow: number) {
  if (!trackerName || !logsRow) {
    return;
  }

  const spreadsheet = SpreadsheetApp.getActiveSpreadsheet();

  const logsSheet = spreadsheet.getSheetByName("CurrentTrackers");
  if (!logsSheet) {
    throw "Logs Sheet not found";
  }

  const trackersForm = spreadsheet.getSheetByName("GetTrackersForm");
  if (!trackersForm) {
    throw "Trackers Form Sheet not found";
  }

  let deletedEvents = 0;

  for (
    let currentRow = trackersForm.getLastRow();
    currentRow > 0;
    currentRow--
  ) {
    const values = trackersForm.getRange(currentRow, 2, 1, 6).getValues()[0];
    const currentTracker = values[0];
    if (trackerName == currentTracker) {
      const eventMade = values[4];
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
}

function deleteMatchingEvent(eventId: string): number {
  const calId = PropertiesService.getScriptProperties().getProperty(
    "calendarId",
  );
  if (!calId) {
    throw "Calendar Id property not found";
  }

  const calendar = CalendarApp.getCalendarById(calId);
  const event = calendar.getEventById(eventId);

  Logger.log('deleted 1 event for tracker "' + event.getTitle() + '"');
  event.deleteEvent();
  return 1;
}
