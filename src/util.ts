const addToTracker = (): void => {
  const sheet = SpreadsheetApp.getActiveSheet();

  if (
    sheet.getSheetName() !== CONFIG.sheets.getCurrentTrackers().getSheetName()
  ) {
    console.info("not on correct sheet");
    return;
  }

  const range = sheet.getActiveRange();

  if (!range) {
    console.error("no range selected");
    return;
  }

  if (range.getRow() === 1) {
    console.error("header row selected");
    return;
  }

  if (range.getNumRows() !== 1) {
    console.info("wrong number of rows selected");
    return;
  }

  const tracker = {
    name: sheet.getRange(range.getRow(), 1).getValue(),
    row: range.getRow(),
  };

  addToGivenTracker(tracker);
};

const addToGivenTracker = (tracker: {name: string; row: number}): void => {
  const ui = SpreadsheetApp.getUi();
  const sheet = CONFIG.sheets.getCurrentTrackers();

  const response = ui.prompt(
    "Enter how much you want to add to the tracker " + tracker.name + ". (h.m)",
    ui.ButtonSet.OK_CANCEL,
  );

  if (response.getSelectedButton() === ui.Button.CANCEL) {
    console.info("addToTracker aborted");
    return;
  }

  const timeArray = response.getResponseText().split(".");

  let hours;
  let minutes;

  switch (timeArray.length) {
    case 1:
      hours = 0;
      minutes = parseInt(timeArray[0], 10);
      break;
    case 2:
      hours = parseInt(timeArray[0], 10);
      minutes = parseInt(timeArray[1], 10);
      break;
    default:
      console.warn("timeArray has the wrong length");
      return;
  }
  if (minutes > 59 || minutes < 0) {
    console.error("not a valid minutes value: %s", minutes);
    return;
  }

  const oldValues = sheet.getRange(tracker.row, 2, 1, 5).getValues()[0];
  const newRawTotal = oldValues[0] + hours * 3600 + minutes * 60;
  let newRawTodayTotal = hours * 3600 + minutes * 60;
  const lastDay = oldValues[4].toLocaleDateString();
  const day = new Date().toLocaleDateString();
  if (lastDay === day) {
    newRawTodayTotal += Number(oldValues[1]);
  }

  const total = newRawTotal / 86400;
  const todayTotal = newRawTodayTotal / 86400;
  const lastSession = (hours + minutes / 60) / 24;

  const values = [
    [newRawTotal, newRawTodayTotal, total, todayTotal, day, lastSession],
  ];

  // TODO should find another way to manage cell formats
  // FIXME code duplication AAAAAAAAHH
  const formats = [["#", "@", "[hh]:mm", "[hh]:mm", "dd/mm/yy", "[hh]:mm"]];

  if (formats[0].length !== values[0].length) {
    console.error("format specified has the wrong number of columns");
  }

  sheet
    .getRange(tracker.row, 2, 1, values[0].length)
    .setValues(values)
    .setNumberFormats(formats);
};
