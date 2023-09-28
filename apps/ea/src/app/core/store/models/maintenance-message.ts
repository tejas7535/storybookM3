export interface MaintenanceMessage {
  type: 'info' | 'warning' | 'error' | 'success';
  text: {
    [key: string]: string; // languages based on AVAILABLE_LANGUAGES in grease app
  };
  buttonText: {
    [key: string]: string; // languages based on AVAILABLE_LANGUAGES in grease app
  };
  validFrom: string;
  validTo: string;
}
