function logEntry(row: number): void {
  Logger.log("logEntry started");

  if (!row) {
    Logger.log("logEntry: no parameter passed");
    return;
  }

  const getTrackers = CONFIG.sheets.trackersForm
    .getRange(row, 2, 1, 4)
    .getValues()[0];

  if (getTrackers[3]) {
    // if value of "logged" column is true
    Logger.log("row was already logged");
    return;
  }
  Logger.log("updating CurrentTrackers");

  const tracker = {
    name: getTrackers[0],
    start: getTrackers[1],
    end: getTrackers[2],
  };

  const lastDiff = tracker.end.getTime() - tracker.start.getTime();

  //Logger.log("TRACKER\nname: %s\nstart: %s\nend: %s",tracker.name, tracker.start, tracker.end);
  const sheet = CONFIG.sheets.currentTrackers;
  let numTrackers = sheet.getLastRow() - 1;

  if (!numTrackers) {
    sheet.getRange(2, 1).setValue(tracker.name);
    numTrackers++;
  }

  const matchingTrackerRow = findMatchingTrackerRow(tracker.name); // is index + 2 or false

  let lastDay;
  let rawTotal;
  let rawTodayTotal;
  if (matchingTrackerRow) {
    const oldValues = sheet
      .getRange(matchingTrackerRow, 2, 1, 5)
      .getValues()[0];

    sheet.deleteRow(matchingTrackerRow);

    rawTotal = Number(oldValues[0]);
    rawTodayTotal = Number(oldValues[1]);

    lastDay = oldValues[4].toLocaleDateString();
  } else {
    //no matching tracker found; initialize a new one;
    rawTotal = 0;
    rawTodayTotal = 0;
    lastDay = -1;
  }
  rawTotal += lastDiff;
  const day = new Date(+tracker.start * 1000).toLocaleDateString();
  day == lastDay ? (rawTodayTotal += lastDiff) : (rawTodayTotal = lastDiff);
  const total = rawTotal / 86400;
  const todayTotal = rawTodayTotal / 86400;
  const lastSession = (+tracker.end - +tracker.start) / 86400;
  const values = [
    [
      tracker.name,
      rawTotal,
      rawTodayTotal,
      total,
      todayTotal,
      day,
      lastSession,
    ],
  ]; // 7 columns
  const formats = [["@", "#", "#", "[hh]:mm", "[hh]:mm", "dd/mm", "[hh]:mm"]];
  if (formats[0].length != values[0].length) {
    Logger.log("wotwot");
  }
  sheet
    .insertRowAfter(1)
    .getRange(2, 1, 1, values[0].length)
    .setValues(values)
    .setNumberFormats(formats); // this one should add the date

  CONFIG.sheets.trackersForm.getRange(row, 5, 1, 1).setValue(true);
}

function logAll() {
  const rows = CONFIG.sheets.trackersForm.getLastRow();
  Logger.log(rows);

  for (let i = 2; i <= rows; i++) {
    logEntry(i);
  }
}

function findMatchingTrackerRow(name: string) {
  const sheet = CONFIG.sheets.currentTrackers;
  const maxRows = sheet.getMaxRows();

  const values = sheet.getRange(2, 1, maxRows).getValues();

  for (let index = 0; index < values.length; index++) {
    if (values[index][0] == name) {
      return index + 2;
    }
  }

  //Logger.log("found matching tracker in row number: %s", index + 2);
  return false;
}
