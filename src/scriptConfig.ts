interface ScriptConfiguration {
  // calendar: GoogleAppsScript.Calendar.Calendar;
  form: GoogleAppsScript.Forms.Form;
  minimumEventDuration: number;
  sheets: {
    currentTrackers: GoogleAppsScript.Spreadsheet.Sheet;
    trackersForm: GoogleAppsScript.Spreadsheet.Sheet;
  };
}

// configuration is generated via IIFEs
const CONFIG: ScriptConfiguration = {
  form: (() => {
    const formIdPropertyName = "FORM_ID";

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
    const propertyName = "MINIMUM_EVENT_DURATION_MINUTES";

    const minimumEventDurationMinutes = PropertiesService.getScriptProperties().getProperty(
      propertyName,
    );

    if (!minimumEventDurationMinutes) {
      throw new Error(`property ${propertyName} not found`);
    }

    return 1000 * 60 * parseInt(minimumEventDurationMinutes, 10);
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
