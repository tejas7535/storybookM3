import { initialState } from '../../reducers/bearing/bearing.reducer';
import { BearingMetadata } from '../../reducers/bearing/models';
import {
  getBearingLoading,
  getBearingResult,
  getDeviceId,
} from './bearing.selector';

jest.mock('@ngneat/transloco', () => ({
  ...jest.requireActual('@ngneat/transloco'),
  translate: jest.fn(() => 'translate it'),
}));
describe('Bearing Selector', () => {
  const bearingMetaData: BearingMetadata = {
    id: 'bbc9a782-f0fc-4a5a-976e-b28cfe187b19',
    name: 'Windturbine of qa-009',
    type: 'WT_QA_009',
    description:
      'Windturbing with qa-009 connected. Used for generating mock data',
    manufacturer: 'Schaeffler',
    locationLatitude: 49.563_106_5,
    locationLongitude: 10.884_736_2,
    edgeDevice: {
      description: 'Edge device test desc',
      id: 'id-edge-device',
      manufacturer: 'Schaeffler',
      name: 'edge-device-test',
      serialNumber: '234',
      type: 'test',
    },
    windFarm: {
      id: 'test-windfarm',
      country: 'Test',
      description: 'Test Windfarm',
      locationLatitude: 0.22,
      locationLongitude: 2.33,
      name: 'Windfarm Test',
      owner: 'Goldwind',
    },
  };

  const fakeState = {
    bearing: {
      ...initialState,
      result: bearingMetaData,
      loading: false,
    },
  };

  describe('getBearingLoading', () => {
    it('should return loading status', () => {
      expect(getBearingLoading(fakeState)).toBeFalsy();
    });
  });

  describe('getBearingResult', () => {
    it('should return a bearing', () => {
      expect(getBearingResult(fakeState)).toEqual(fakeState.bearing.result);
    });
  });

  describe('getDeviceId', () => {
    it('should return a device id', () => {
      expect(getDeviceId(fakeState)).toEqual(
        fakeState.bearing.result.edgeDevice.name
      );
    });
  });
});
