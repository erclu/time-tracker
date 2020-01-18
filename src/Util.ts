function addToTracker() {
  var loggerSheet = SpreadsheetApp.getActiveSheet();
  var range = loggerSheet.getActiveRange();

  if (
    range.getSheet().getSheetName() != "CurrentTrackers" &&
    range.getRow() != 1 &&
    range.getNumRows() != 1
  ) {
    return;
  }

  var tracker = {
    name: loggerSheet.getRange(range.getRow(), 1).getValue(),
    row: range.getRow(),
  };
  var ui = SpreadsheetApp.getUi();
  var response = ui.prompt(
    "Enter how much you want to add to the tracker " + tracker.name + ". (h.m)",
    ui.ButtonSet.OK_CANCEL,
  );

  if (response.getSelectedButton() == ui.Button.CANCEL) {
    Logger.log("aborted");
    return;
  }

  var timeArray = response.getResponseText().split(".");

  switch (timeArray.length) {
    case 1:
      var hours = 0;
      var minutes = parseInt(timeArray[0]);
      break;
    case 2:
      var hours = parseInt(timeArray[0]);
      var minutes = parseInt(timeArray[1]);
      break;
    default:
      Logger.log("wrong something");
      return;
  }
  if (minutes > 59 || minutes < 0) {
    Logger.log("wrong minutes");
    return;
  }

  var oldValues = loggerSheet.getRange(tracker.row, 2, 1, 5).getValues()[0];
  var newRawTotal = oldValues[0] + hours * 3600 + minutes * 60;
  var newRawTodayTotal = hours * 3600 + minutes * 60;
  var lastDay = oldValues[4].toLocaleDateString();
  var day = new Date().toLocaleDateString();
  if (lastDay == day) {
    newRawTodayTotal += Number(oldValues[1]);
  }

  var total = newRawTotal / 86400;
  var todayTotal = newRawTodayTotal / 86400;
  var lastSession = (hours + minutes / 60) / 24;
  var values = [
    [newRawTotal, newRawTodayTotal, total, todayTotal, day, lastSession],
  ];
  var formats = [["#", "@", "[hh]:mm", "[hh]:mm", "dd/mm", "[hh]:mm"]];

  if (formats[0].length != values[0].length) {
    Logger.log("wotwot");
  }

  loggerSheet
    .getRange(tracker.row, 2, 1, values[0].length)
    .setValues(values)
    .setNumberFormats(formats);

  return;
}

/**
 * converts to UTC Date object
 * @param epochS epoch time in seconds
 */
function EpochToUTC(epochS: number) {
  return new Date(epochS * 1000);
}
