import { UntypedFormControl } from '@angular/forms';

import { createServiceFactory, SpectatorService } from '@ngneat/spectator/jest';

import { provideTranslocoTestingModule } from '@schaeffler/transloco/testing';

import { MeasurementUnits } from '@ga/shared/models';

import { CalculationParametersService } from './calculation-parameters.service';

describe('CalculationParametersService', () => {
  let service: CalculationParametersService;
  let spectator: SpectatorService<CalculationParametersService>;

  const createService = createServiceFactory({
    service: CalculationParametersService,
    imports: [provideTranslocoTestingModule({ en: {} })],
  });

  beforeEach(() => {
    spectator = createService();
    service = spectator.service;
  });

  it('should be created', () => {
    expect(service).toBeDefined();
  });

  it('should provide units', () => {
    expect(service.loadUnit).toBeDefined();
    expect(service.temperatureUnit).toBeDefined();

    service['measurementUnitsService'].getMeasurementUnits = jest.fn(
      () => MeasurementUnits.Imperial
    );
    expect(service.loadUnit()).toBe('lbf');
    expect(service.temperatureUnit()).toBe('°F');
  });

  it('should provide form controls', () => {
    expect(service.getEnvironmentTemperatureControl).toBeDefined();
    expect(service.getOperatingTemperatureControl).toBeDefined();

    service.getEnvironmentTemperatureControl();
    service['measurementUnitsService'].getMeasurementUnits = jest.fn(
      () => MeasurementUnits.Imperial
    );
    expect(service.getOperatingTemperatureControl().value).toBe(158);
  });

  describe('operatingTemperatureValidator', () => {
    it('should return the error if operatingTemperature < environmentTemperature', () => {
      const mockControl = new UntypedFormControl(10);
      service.getEnvironmentTemperatureControl();

      const result = service['operatingTemperatureValidator']()(mockControl);

      expect(result).toEqual({
        lowerThanEnvironmentTemperature: true,
      });
    });

    it('should return undefined if operatingTemperature < environmentTemperature', () => {
      const mockControl = new UntypedFormControl(70);
      service.getEnvironmentTemperatureControl();

      const result = service['operatingTemperatureValidator']()(mockControl);

      expect(result).toEqual(undefined);
    });

    it('should return undefined if environmentTemperature is not defined', () => {
      const mockControl = new UntypedFormControl(70);

      const result = service['operatingTemperatureValidator']()(mockControl);

      expect(result).toEqual(undefined);
    });
  });
});
