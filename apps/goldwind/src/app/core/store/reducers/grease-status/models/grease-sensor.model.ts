export enum GreaseSensorName {
  GCM01 = 'gcm01',
  GCM02 = 'gcm02',
}

export interface GreaseSensor {
  sensorName: GreaseSensorName;
}

export enum GreaseType {
  deterioration = 'deterioration',
  temperatureOptics = 'temperatureOptics',
  waterContent = 'waterContent',
}
