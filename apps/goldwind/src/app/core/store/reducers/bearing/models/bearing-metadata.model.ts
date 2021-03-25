export interface Sensor {
  base: string;
  bearingId: string;
  certificate: string;
  certificateValid: boolean;
  certificationDate: string;
  certifier: string;
  comInterface: string;
  context: string;
  created: string;
  description: string;
  descriptions: string;
  designation: string;
  edgeId: string;
  id: number;
  manufacturer: string;
  metaIsDeleted: boolean;
  metaIsHidden: boolean;
  model: string;
  modified: string;
  operator: string;
  security: string;
  securityDefinitions: string;
  sensorId: string;
  sensorTypeDes: string;
  sensorTypeId: string;
  sensorTypes: SensorTypes[];
  status: string;
  statusEcu: string;
  support: string;
  title: string;
  titles: string;
  type: string;
  validFrom: string;
  validUntil: string;
  version: string;
}

export interface SensorTypes {
  errorCodes: string;
  errorDescriptions: string;
  id: number;
  sensorTypeId: string;
}

export interface BearingMetadata {
  description: string;
  edgeDevice: {
    description: string;
    id: string;
    manufacturer: string;
    name: string;
    serialNumber: string;
    type: string;
  };
  id: string;
  locationLatitude: number;
  locationLongitude: number;
  manufacturer: string;
  name: string;
  type: string;
  windFarm: {
    country: string;
    description: string;
    id: string;
    locationLatitude: number;
    locationLongitude: number;
    name: string;
    owner: string;
  };
}
