interface ScriptProperties {
  calendarId: string;
  formId: string;
  minimumEventDuration: number;
  sheetNames: {
    currentTrackers: string;
    trackersForm: string;
  };
}

interface SafeGetters {
  sheets: {
    getCurrentTrackers(): GoogleAppsScript.Spreadsheet.Sheet;
    getTrackersForm(): GoogleAppsScript.Spreadsheet.Sheet;
  };
  getCalendar(): GoogleAppsScript.Calendar.Calendar;
  getForm(): GoogleAppsScript.Forms.Form;
}

function safeGetProperties(propertyName: string): string {
  const propertyValue = PropertiesService.getScriptProperties().getProperty(
    propertyName,
  );

  if (!propertyValue) {
    throw new Error(`property "${propertyName}" not found`);
  }

  return propertyValue;
}

// Properties are extracted via IIFEs
const SCRIPT_PROPERTIES: ScriptProperties = {
  calendarId: (() => safeGetProperties("CALENDAR_ID"))(),
  formId: (() => safeGetProperties("FORM_ID"))(),
  // This is the minimum event duration in milliseconds
  minimumEventDuration: (() => {
    const propertyValue = safeGetProperties("MINIMUM_EVENT_DURATION_MINUTES");

    return 1000 * 60 * parseInt(propertyValue, 10);
  })(),
  sheetNames: (() => {
    const currentTrackers = "CurrentTrackers";
    const trackersForm = "GetTrackersForm";

    const spreadsheet = SpreadsheetApp.getActiveSpreadsheet();
    if (!spreadsheet.getSheetByName(currentTrackers)) {
      throw new Error(`sheet ${currentTrackers} not found`);
    }
    if (!spreadsheet.getSheetByName(trackersForm)) {
      throw new Error(`sheet ${trackersForm} not found`);
    }

    return {
      currentTrackers,
      trackersForm,
    };
  })(),
};

const CONFIG: SafeGetters = {
  getCalendar: () => CalendarApp.getCalendarById(SCRIPT_PROPERTIES.calendarId),
  getForm: () => FormApp.openById(SCRIPT_PROPERTIES.formId),
  sheets: (() => {
    return {
      getCurrentTrackers: () =>
        SpreadsheetApp.getActiveSpreadsheet().getSheetByName(
          SCRIPT_PROPERTIES.sheetNames.currentTrackers,
        )!,
      getTrackersForm: () =>
        SpreadsheetApp.getActiveSpreadsheet().getSheetByName(
          SCRIPT_PROPERTIES.sheetNames.trackersForm,
        )!,
    };
  })(),
};
