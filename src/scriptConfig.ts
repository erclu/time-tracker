interface ScriptConfiguration {
  calendar: GoogleAppsScript.Calendar.Calendar;
  form: GoogleAppsScript.Forms.Form;
  minimumEventDuration: number;
  sheets: {
    currentTrackers: GoogleAppsScript.Spreadsheet.Sheet;
    trackersForm: GoogleAppsScript.Spreadsheet.Sheet;
  };
}

// configuration is generated via IIFEs
const CONFIG: ScriptConfiguration = {
  calendar: (() => {
    const calendarIdPropertyName = "calendarId";
    const calendarId = PropertiesService.getScriptProperties().getProperty(
      calendarIdPropertyName,
    );

    if (!calendarId) {
      throw new Error(`property "${calendarIdPropertyName}" not found`);
    }

    return CalendarApp.getCalendarById(calendarId);
  })(),
  form: (() => {
    const formIdPropertyName = "formId";

    const formId = PropertiesService.getScriptProperties().getProperty(
      formIdPropertyName,
    );

    if (!formId) {
      throw new Error(`property "${formIdPropertyName}" not found`);
    }

    return FormApp.openById(formId);
  })(),
  // This is the minimum event duration in milliseconds
  minimumEventDuration: (() => {
    const propertyName = "minimumEventDurationMinutes";

    const minimumEventDurationMinutes = PropertiesService.getScriptProperties().getProperty(
      propertyName,
    );

    if (!minimumEventDurationMinutes) {
      throw new Error(`property ${propertyName} not found`);
    }

    return 1000 * 60 * Number(minimumEventDurationMinutes);
  })(),
  sheets: (() => {
    const spreadsheet = SpreadsheetApp.getActiveSpreadsheet();

    const currentTrackersSheetName = "CurrentTrackers";
    const currentTrackers = spreadsheet.getSheetByName(
      currentTrackersSheetName,
    );

    if (!currentTrackers) {
      throw new Error(`sheet ${currentTrackersSheetName} not found`);
    }

    const trackersFormSheetName = "GetTrackersForm";
    const trackersForm = spreadsheet.getSheetByName(trackersFormSheetName);

    if (!trackersForm) {
      throw new Error(`sheet ${trackersFormSheetName} not found`);
    }

    return {
      currentTrackers,
      trackersForm,
    };
  })(),
};
