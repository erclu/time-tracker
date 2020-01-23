function testDelete() {
  const name = "manuale";
  const row = 2;
  deleteTracker(name, row);
}

function deleteTracker(trackerName: string, logsRow: number) {
  // XXX why is this needed?
  if (!trackerName || !logsRow) {
    console.warn("no tracker name or log row given to function");
    return 0;
  }

  const logsSheet = CONFIG.sheets.currentTrackers;
  const trackersForm = CONFIG.sheets.trackersForm;

  let deletedEvents = 0;

  for (
    let currentRow = trackersForm.getLastRow();
    currentRow > 0;
    currentRow--
  ) {
    const values = trackersForm.getRange(currentRow, 2, 1, 6).getValues()[0];
    const currentTracker = values[0];

    if (trackerName === currentTracker) {
      const eventMade = values[4];

      if (eventMade) {
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
  const calendar = CONFIG.calendar;
  const event = calendar.getEventById(eventId);

  event.deleteEvent();
  return 1;
}
