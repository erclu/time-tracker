function logEntry(row) {
  Logger.log("logEntry started");
  if (!row) {
    Logger.log("logEntry: no parameter passed");
    return;
  }
  var ss = SpreadsheetApp.getActiveSpreadsheet();
  var getTrackers = ss
    .getSheetByName("GetTrackersForm")
    .getRange(row, 2, 1, 4)
    .getValues()[0];
  if (getTrackers[3]) {
    // if value of "logged" column is true
    Logger.log("row was already logged");
    return;
  }
  Logger.log("updating CurrentTrackers");

  var tracker = {
    name: getTrackers[0],
    start: getTrackers[1],
    end: getTrackers[2],
  };
  var lastDiff = tracker.end.getTime() - tracker.start.getTime();
  //Logger.log("TRACKER\nname: %s\nstart: %s\nend: %s",tracker.name, tracker.start, tracker.end);
  var sheet = ss.getSheetByName("CurrentTrackers");
  var numTrackers = sheet.getLastRow() - 1;
  if (!numTrackers) {
    sheet.getRange(2, 1).setValue(tracker.name);
    numTrackers++;
  }
  var matchingTrackerRow = findMatchingTrackerRow(tracker.name); // is index + 2 or false
  var lastDay;
  var rawTotal;
  var rawTodayTotal;
  if (matchingTrackerRow) {
    var oldValues = sheet.getRange(matchingTrackerRow, 2, 1, 5).getValues()[0];
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
  var day = new Date(+tracker.start * 1000).toLocaleDateString();
  day == lastDay ? (rawTodayTotal += lastDiff) : (rawTodayTotal = lastDiff);
  var total = rawTotal / 86400;
  var todayTotal = rawTodayTotal / 86400;
  var lastSession = (+tracker.end - +tracker.start) / 86400;
  var values = [
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
  var formats = [["@", "#", "#", "[hh]:mm", "[hh]:mm", "dd/mm", "[hh]:mm"]];
  if (formats[0].length != values[0].length) {
    Logger.log("wotwot");
  }
  sheet
    .insertRowAfter(1)
    .getRange(2, 1, 1, values[0].length)
    .setValues(values)
    .setNumberFormats(formats); // this one should add the date
  ss.getSheetByName("GetTrackersForm")
    .getRange(row, 5, 1, 1)
    .setValue(true)
    .setFontFamily("Roboto Mono");
  return;
}

function logAll() {
  var rows = SpreadsheetApp.getActiveSpreadsheet()
    .getSheetByName("GetTrackersForm")
    .getLastRow();
  Logger.log(rows);
  for (var i = 2; i <= rows; i++) {
    logEntry(i);
  }
  return;
}

function findMatchingTrackerRow(name) {
  var sheet = SpreadsheetApp.getActiveSpreadsheet().getSheetByName(
    "CurrentTrackers",
  );
  var values = sheet.getRange(2, 1, sheet.getMaxRows()).getValues();
  for (var index = 0; index < values.length; index++) {
    if (values[index][0] == name) {
      return index + 2;
    }
  }
  //Logger.log("found matching tracker in row number: %s", index + 2);
  return false;
}
