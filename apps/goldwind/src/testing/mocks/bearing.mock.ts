import { BearingMetadata } from '../../app/core/store/reducers/bearing/models';

export const BEARING_MOCK: BearingMetadata = {
  description: 'bearing mock for test',
  edgeDevice: {
    description: 'test edge device description',
    id: 'test-edge-device',
    manufacturer: 'Schaeffler',
    name: 'test edge device',
    serialNumber: '123-test-456',
    type: 'test',
  },
  id: 'test-001',
  locationLatitude: 0,
  locationLongitude: 0,
  manufacturer: 'Schaeffler KG',
  name: 'mock bearing',
  type: 'test type',
  windFarm: {
    country: 'de',
    description: 'description test windfarm',
    id: 'id-test-windfarm',
    locationLatitude: 0,
    locationLongitude: 0,
    name: 'test windfarm',
    owner: 'Juri',
  },
};
