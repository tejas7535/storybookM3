import {
  ConnectionState,
  Device,
} from '../../app/core/store/reducers/devices/models';

export const DEVICES_MOCK: Device[] = [
  {
    deviceId: 'trilixgoldwinddev',
    moduleId: 'testValue',
    version: 4,
    reportedProperties: [''],
    desiredProperties: [''],
    configurations: 'testValue',
    capabilities: {
      iotEdge: true,
    },
    connectionState: 'CONNECTED' as ConnectionState,

    tags: [
      {
        key: 'environment',
        value: 'dev',
      },
    ],
    tagsVersion: 'testValue',
    desiredPropertiesVersion: 'testValue',
    reportedPropertiesVersion: 'testValue',
    etag: 'AAAAAAAAAAM=',
  },
];
