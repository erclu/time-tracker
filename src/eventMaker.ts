const makeEvent = (row: number): void => {
  // XXX is this needed?
  if (!row) {
    return;
  }

  const calendar = CONFIG.getCalendar();
  const minEventLength = CONFIG.minimumEventDuration;
  const trackersForm = CONFIG.sheets.getTrackersForm();

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
};

// eslint-disable-next-line prefer-arrow/prefer-arrow-functions
function makeAll(): void {
  const rows = CONFIG.sheets.getTrackersForm().getLastRow();

  for (let i = 2; i <= rows; i++) {
    makeEvent(i);
  }
}

const deleteMatchingEvent = (eventId: string): number => {
  const calendar = CONFIG.getCalendar();
  const event = calendar.getEventById(eventId);

  event.deleteEvent();
  return 1;
};
