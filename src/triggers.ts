function onFormSubmit(e: GoogleAppsScript.Events.SheetsOnFormSubmit) {
  const rowNumber = e.range.getRow();

  logEntry(rowNumber);
  makeEvent(rowNumber);

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

  // check conditions in order of importance
  if (
    range.getSheet().getSheetName() !==
    CONFIG.sheets.currentTrackers.getSheetName()
  ) {
    console.info(
      "not on correct sheet: %s !== %s",
      range.getSheet().getSheetName(),
      CONFIG.sheets.currentTrackers.getSheetName(),
    );
    return;
  }

  if (oldValue === undefined) {
    console.info("not a valid tracker: %s", oldValue);
    return;
  }

  if (newValue !== undefined) {
    console.info("value has not been deleted: %s", newValue);
    return;
  }

  if (range.getNumRows() !== 1) {
    console.info("more than 1 tracker row selected: %s", range.getNumRows());
    return;
  }

  if (range.getNumColumns() !== 1) {
    console.info(
      "more than 1 tracker column selected: %s",
      range.getNumColumns(),
    );
    return;
  }

  const currentRow = range.getRow();
  const currentColumn = range.getColumn();

  if (currentRow === 1) {
    console.info("header row selected");
    return;
  }

  if (currentColumn !== 1) {
    console.info("wrong column selected");
    return;
  }

  SpreadsheetApp.setActiveRange(
    range.getSheet().setActiveRange(range.getSheet().getRange("A1")),
  );

  const ui = SpreadsheetApp.getUi();
  const result = ui.alert(`delete tracker ${oldValue}?`, ui.ButtonSet.YES_NO);

  if (result === ui.Button.YES) {
    const howManyDeletedEvents = deleteTracker(e.oldValue, range.getRow());

    ui.alert(`deleted ${howManyDeletedEvents} events`);
  } else if (result === ui.Button.NO) {
    console.info("restoring old row name");

    range.setValue(oldValue);
  } else {
    console.warn("answered neither yes nor no");
  }
  // TODO what happens if alert canceled?
}
