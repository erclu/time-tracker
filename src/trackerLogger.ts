function logEntry(row: number): void {
  // XXX is this needed?
  if (!row) {
    return;
  }

  const getTrackers = CONFIG.sheets
    .getTrackersForm()
    .getRange(row, 2, 1, 4)
    .getValues()[0];

  // if value of "logged" column is true
  if (getTrackers[3]) {
    return;
  }

  const tracker = {
    name: getTrackers[0] as string,
    start: Number(getTrackers[1]),
    end: Number(getTrackers[2]), // tslint:disable-line: object-literal-sort-keys
  };

  const lastDiff = tracker.end - tracker.start;

  const sheet = CONFIG.sheets.getCurrentTrackers();
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
    // no matching tracker found; initialize a new one;
    rawTotal = 0;
    rawTodayTotal = 0;
    lastDay = -1;
  }
  rawTotal += lastDiff;
  const day = new Date(+tracker.start * 1000).toLocaleDateString();

  if (day === lastDay) {
    rawTodayTotal += lastDiff;
  } else {
    rawTodayTotal = lastDiff;
  }

  const total = rawTotal / 86400;
  const todayTotal = rawTodayTotal / 86400;
  const lastSession = (+tracker.end - +tracker.start) / 86400;
  // TODO should use an interface/class
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

  // TODO improve this, it kinda sucks
  const formats = [
    ["@", "#", "#", "[hh]:mm", "[hh]:mm", "dd/mm/yy", "[hh]:mm"],
  ];
  if (formats[0].length !== values[0].length) {
    console.error("format specified has the wrong number of columns");
  }
  sheet
    .insertRowAfter(1)
    .getRange(2, 1, 1, values[0].length)
    .setValues(values)
    .setNumberFormats(formats); // this one should add the date

  CONFIG.sheets
    .getTrackersForm()
    .getRange(row, 5, 1, 1)
    .setValue(true);
}

function logAll() {
  const rows = CONFIG.sheets.getTrackersForm().getLastRow();

  for (let i = 2; i <= rows; i++) {
    logEntry(i);
  }
}

function findMatchingTrackerRow(name: string) {
  const sheet = CONFIG.sheets.getCurrentTrackers();
  const maxRows = sheet.getMaxRows();

  const values = sheet.getRange(2, 1, maxRows).getValues();

  for (let index = 0; index < values.length; index++) {
    if (values[index][0] === name) {
      return index + 2;
    }
  }

  return false;
}
