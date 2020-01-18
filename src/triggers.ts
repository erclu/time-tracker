function onFormSubmit(e) {
  Logger.log("row number passed: %s", e.range.getRow());
  e.range.setFontFamily("Roboto Mono");
  logEntry(e.range.getRow());
  Logger.log("logEntry ended");
  makeEvent(e.range.getRow());
  Logger.log("makeEvent ended");
  FormApp.openById(
    "15DrDtgMquviAVpbfg9LDG6pY3OKVi01D9sL48KCdHdM",
  ).deleteAllResponses();
}

function onOpen() {
  SpreadsheetApp.setActiveSheet(
    SpreadsheetApp.getActiveSpreadsheet().getSheetByName("CurrentTrackers"),
  );
  const range = SpreadsheetApp.getActiveSpreadsheet()
    .getSheetByName("GetTrackersForm")
    .getRange("E2:E");
  for (let row = 2; row < range.getHeight(); row++) {
    if (range.getCell(row, 1).isBlank()) {
      SpreadsheetApp.getUi().alert("Some rows are not logged");
      break;
    }
  }
  SpreadsheetApp.getUi()
    .createMenu("**Varie**")
    .addItem("Log where not logged", "logAll")
    .addItem("make events", "makeAll")
    .addSeparator()
    .addItem("Add hh:mm to currently selected tracker", "addToTracker")
    .addToUi();
}

function installableOnEdit(e) {
  const oldValue = e.oldValue;
  const newValue = e.value;
  const range = e.range;
  Logger.log("old: %s - new: %s", oldValue, newValue);
  const curSheet = range.getSheet().getSheetName();
  const curRow = range.getRow();
  const numRows = range.getNumRows();
  const curColumn = range.getColumn();
  const numColumns = range.getNumColumns();
  const test =
    curSheet === "CurrentTrackers" &&
    curColumn === 1 &&
    numRows === 1 &&
    curRow > 1 &&
    numColumns === 1 &&
    oldValue !== undefined &&
    newValue === undefined;
  Logger.log(
    "\nsheet: %s\nrow: %s (%s selected)\ncolumn: %s (%s selected)\n bool: %s",
    curSheet,
    curRow,
    numRows,
    curColumn,
    numColumns,
    test,
  );
  if (test) {
    const ui = SpreadsheetApp.getUi();
    const result = ui.alert(
      'delete tracker "' + oldValue + '" ?',
      ui.ButtonSet.YES_NO,
    );
    if (result === ui.Button.YES) {
      const howManyDeletedEvents = deleteTracker(e.oldValue, range.getRow());
      if (howManyDeletedEvents > 0) {
        ui.alert("deleted " + howManyDeletedEvents + " event/s");
      }
    } else if (result === ui.Button.NO) {
      Logger.log("restoring old row name");
      range.setValue(e.value.oldValue);
    }
  } else {
    Logger.log("nothing changed");
  }
}
