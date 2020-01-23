function makeEvent(row: number) {
  // XXX is this needed?
  if (!row) {
    return;
  }

  const calendar = CONFIG.calendar;
  const minEventLength = CONFIG.minimumEventDuration;
  const trackersForm = CONFIG.sheets.trackersForm;

  const rowValues = trackersForm.getRange(row, 2, 1, 5).getValues()[0]; // get cols B to F

  if (rowValues[4]) {
    // if value of "Event made" column is true
    return;
  }

  const title = rowValues[0].toString();
  const startTime = new Date(Number(rowValues[1]) * 1000);
  const endTime = new Date(Number(rowValues[2]) * 1000);

  if (+endTime - +startTime < minEventLength) {
    trackersForm.getRange(row, 6).setValue(false);
  } else {
    const eventId = calendar.createEvent(title, startTime, endTime).getId();

    trackersForm.getRange(row, 6, 1, 2).setValues([[true, eventId]]);
  }
}

function makeAll() {
  const rows = CONFIG.sheets.trackersForm.getLastRow();

  for (let i = 2; i <= rows; i++) {
    makeEvent(i);
  }
}

function deleteMatchingEvent(eventId: string): number {
  const calendar = CONFIG.calendar;
  const event = calendar.getEventById(eventId);

  event.deleteEvent();
  return 1;
}
