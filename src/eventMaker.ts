function makeEvent(row: number) {
  if (!row) {
    Logger.log("makeEvent: no parameter passed");
    return;
  }

  const calendar = CONFIG.calendar;
  const minEventLength = CONFIG.minimumEventDuration;
  const trackersForm = CONFIG.sheets.trackersForm;

  const rowValues = trackersForm.getRange(row, 2, 1, 5).getValues()[0]; // get cols B to F
  Logger.log(typeof rowValues[4]);

  if (rowValues[4]) {
    // if value of "Event made" column is true
    Logger.log("event was made");
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
