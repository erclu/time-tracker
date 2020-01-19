function onFormSubmit(e: GoogleAppsScript.Events.SheetsOnFormSubmit) {
  const rowNumber = e.range.getRow();
  Logger.log("row number passed: %s", rowNumber);

  logEntry(rowNumber);
  Logger.log("logEntry ended");

  makeEvent(rowNumber);
  Logger.log("makeEvent ended");

  CONFIG.form.deleteAllResponses();
}

function onOpen() {
  SpreadsheetApp.setActiveSheet(CONFIG.sheets.currentTrackers);

  const range = CONFIG.sheets.trackersForm.getRange("E2:E");

  for (let row = 2; row < range.getHeight(); row++) {
    if (range.getCell(row, 1).isBlank()) {
      SpreadsheetApp.getUi().alert("Some rows are not logged");
      break;
    }
  }

  SpreadsheetApp.getUi()
    .createMenu("TimeTracker Menu")
    .addItem("Log where not logged", logAll.name)
    .addItem("make events", makeAll.name)
    .addSeparator()
    .addItem("Add hh:mm to currently selected tracker", addToTracker.name)
    .addToUi();
}

function installableOnEdit(e: GoogleAppsScript.Events.SheetsOnEdit) {
  const oldValue = e.oldValue;
  const newValue = e.value;
  const range = e.range;

  Logger.log("old: %s - new: %s", oldValue, newValue);
  const currentSheetName = range.getSheet().getSheetName();

  const currentRow = range.getRow();
  const currentColumn = range.getColumn();

  const numRows = range.getNumRows();
  const numColumns = range.getNumColumns();
  const test =
    currentSheetName === "CurrentTrackers" &&
    currentColumn === 1 &&
    numRows === 1 &&
    currentRow > 1 &&
    numColumns === 1 &&
    oldValue !== undefined &&
    newValue === undefined;
  Logger.log(
    "\nsheet: %s\nrow: %s (%s selected)\ncolumn: %s (%s selected)\n bool: %s",
    currentSheetName,
    currentRow,
    numRows,
    currentColumn,
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
      // range.setValue(e.value.oldValue);
      range.setValue(e.oldValue);
    }
  } else {
    Logger.log("nothing changed");
  }
}
