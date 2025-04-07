export interface MaintenanceMessage {
  type: 'info' | 'warning' | 'error' | 'success';
  text: {
    [key: string]: string; // languages based on AVAILABLE_LANGUAGES in mm app
  };
  buttonText: {
    [key: string]: string; // languages based on AVAILABLE_LANGUAGES in mm app
  };
  validFrom: string;
  validTo: string;
}
