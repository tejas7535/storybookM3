export enum ConnectionState {
  connected = 'CONNECTED',
  disconnected = 'DISCONNECTED',
}

export interface Devices {
  [index: number]: Device;
}

export interface Tag {
  key: string;
  value: string;
}

export interface Device {
  deviceId: string;
  moduleId: string;
  version: number;
  reportedProperties: any[];
  desiredProperties: any[];
  configurations: string;
  capabilities: {
    iotEdge: boolean;
  };
  connectionState: ConnectionState;
  tags: Tag[];
  tagsVersion: string;
  desiredPropertiesVersion: string;
  reportedPropertiesVersion: string;
  etag: string;
}
