function addToTracker() {
  const loggerSheet = SpreadsheetApp.getActiveSheet();
  const range = loggerSheet.getActiveRange();

  if (!range) {
    throw new Error("no range selected");
  }

  if (
    range.getSheet().getSheetName() != "CurrentTrackers" &&
    range.getRow() != 1 &&
    range.getNumRows() != 1
  ) {
    return;
  }

  const tracker = {
    name: loggerSheet.getRange(range.getRow(), 1).getValue(),
    row: range.getRow(),
  };
  const ui = SpreadsheetApp.getUi();
  const response = ui.prompt(
    "Enter how much you want to add to the tracker " + tracker.name + ". (h.m)",
    ui.ButtonSet.OK_CANCEL,
  );

  if (response.getSelectedButton() == ui.Button.CANCEL) {
    Logger.log("aborted");
    return;
  }

  const timeArray = response.getResponseText().split(".");

  let hours;
  let minutes;

  switch (timeArray.length) {
    case 1:
      hours = 0;
      minutes = parseInt(timeArray[0]);
      break;
    case 2:
      hours = parseInt(timeArray[0]);
      minutes = parseInt(timeArray[1]);
      break;
    default:
      Logger.log("wrong something");
      return;
  }
  if (minutes > 59 || minutes < 0) {
    Logger.log("wrong minutes");
    return;
  }

  const oldValues = loggerSheet.getRange(tracker.row, 2, 1, 5).getValues()[0];
  const newRawTotal = oldValues[0] + hours * 3600 + minutes * 60;
  let newRawTodayTotal = hours * 3600 + minutes * 60;
  const lastDay = oldValues[4].toLocaleDateString();
  const day = new Date().toLocaleDateString();
  if (lastDay == day) {
    newRawTodayTotal += Number(oldValues[1]);
  }

  const total = newRawTotal / 86400;
  const todayTotal = newRawTodayTotal / 86400;
  const lastSession = (hours + minutes / 60) / 24;
  const values = [
    [newRawTotal, newRawTodayTotal, total, todayTotal, day, lastSession],
  ];
  const formats = [["#", "@", "[hh]:mm", "[hh]:mm", "dd/mm", "[hh]:mm"]];

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
