import { LOCAL_STORAGE } from '@ng-web-apis/common';
import { createServiceFactory, SpectatorService } from '@ngneat/spectator/jest';

import { LocalStorageMock } from '@ga/testing/mocks';

import { MeasurementUnitsService } from './measurement-units.service';

describe('MeasurementUnitsService', () => {
  let spectator: SpectatorService<MeasurementUnitsService>;
  let service: MeasurementUnitsService;
  let localStorage: LocalStorageMock;

  const createService = createServiceFactory({
    service: MeasurementUnitsService,
    providers: [{ provide: LOCAL_STORAGE, useClass: LocalStorageMock }],
  });

  beforeEach(() => {
    spectator = createService();
    service = spectator.inject(MeasurementUnitsService);
    localStorage = spectator.inject(
      LOCAL_STORAGE
    ) as unknown as LocalStorageMock;

    localStorage.clear();
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  describe('getMeasurementUnits', () => {
    it('should return default if theres no entry in localstorage', () => {
      expect(service.getMeasurementUnits()).toBe('ID_UNIT_SET_SI');
    });

    it('should return value from storage', () => {
      const mockStore = { measurement_units: 'ID_UNIT_SET_FPS' };
      localStorage.setStore(mockStore);

      expect(service.getMeasurementUnits()).toBe('ID_UNIT_SET_FPS');
    });
  });

  describe('setMeasurementUnits', () => {
    it('should set value in storage', () => {
      service.setMeasurementUnits('ID_UNIT_SET_FPS');

      expect(localStorage.store['measurement_units']).toBe('ID_UNIT_SET_FPS');
    });
  });
});
