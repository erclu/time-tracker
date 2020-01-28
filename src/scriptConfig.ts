type ScriptPropertiesType = {
  authToken: string;
  calendarId: string;
  formId: string;
  rawMinimumEventDuration: string;
};

type SafeGetters = {
  minimumEventDuration: number;
  sheets: {
    getCurrentTrackers(): GoogleAppsScript.Spreadsheet.Sheet;
    getTrackersForm(): GoogleAppsScript.Spreadsheet.Sheet;
  };
  getCalendar(): GoogleAppsScript.Calendar.Calendar;
  getForm(): GoogleAppsScript.Forms.Form;
};

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
const SCRIPT_PROPERTIES: ScriptPropertiesType = {
  authToken: (() => safeGetProperties("AUTH_TOKEN"))(),
  calendarId: (() => safeGetProperties("CALENDAR_ID"))(),
  formId: (() => safeGetProperties("FORM_ID"))(),
  rawMinimumEventDuration: (() =>
    safeGetProperties("MINIMUM_EVENT_DURATION_MINUTES"))(),
};

const CONFIG: SafeGetters = {
  getCalendar: () => CalendarApp.getCalendarById(SCRIPT_PROPERTIES.calendarId),
  getForm: () => FormApp.openById(SCRIPT_PROPERTIES.formId),
  minimumEventDuration: (() =>
    1000 * 60 * parseInt(SCRIPT_PROPERTIES.rawMinimumEventDuration, 10))(),
  sheets: (() => {
    const currentTrackersName = "CurrentTrackers";
    const trackersFormName = "GetTrackersForm";

    const spreadsheet = SpreadsheetApp.getActiveSpreadsheet();

    const currentTrackers = spreadsheet.getSheetByName(currentTrackersName);
    if (!currentTrackers) {
      throw new Error(`sheet ${currentTrackersName} not found`);
    }

    const trackersForm = spreadsheet.getSheetByName(trackersFormName);
    if (!trackersForm) {
      throw new Error(`sheet ${trackersFormName} not found`);
    }

    return {
      getCurrentTrackers: () => currentTrackers,
      getTrackersForm: () => trackersForm,
    };
  })(),
};
/* eslint-enable @typescript-eslint/explicit-function-return-type */
