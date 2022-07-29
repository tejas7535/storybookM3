import { createComponentFactory, Spectator } from '@ngneat/spectator/jest';

import { provideTranslocoTestingModule } from '@schaeffler/transloco/testing';

import { MeasurementUnitsService } from '@ga/shared/services';
import { MEASUREMENTS_UNITS_OPTION_MOCK } from '@ga/testing/mocks';

import { MeasurementUnitsSelectComponent } from './measurement-units-select.component';

describe('MeasurementUnitsSelectComponent', () => {
  let component: MeasurementUnitsSelectComponent;
  let spectator: Spectator<MeasurementUnitsSelectComponent>;
  let measurementUnitsService: MeasurementUnitsService;

  const { location } = window;
  const windowLocationReloadMock = jest.fn();

  const createComponent = createComponentFactory({
    component: MeasurementUnitsSelectComponent,
    imports: [provideTranslocoTestingModule({ en: {} })],
  });

  beforeEach(() => {
    spectator = createComponent();
    component = spectator.component;

    measurementUnitsService = spectator.inject(MeasurementUnitsService);
    measurementUnitsService.getMeasurementUnits = jest.fn(
      () => MEASUREMENTS_UNITS_OPTION_MOCK.id
    );
    measurementUnitsService.setMeasurementUnits = jest.fn();

    delete window.location;
    window.location = { reload: windowLocationReloadMock } as any;
  });

  afterEach(() => {
    window.location = location;
    windowLocationReloadMock.mockClear();
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
  });

  it('should initially fetch the currently selected option', () => {
    expect(component.selectedOption).toStrictEqual(
      MEASUREMENTS_UNITS_OPTION_MOCK
    );
  });

  describe('onMeasurementUnitsSelectChange', () => {
    it('should set measurement units', () => {
      component.onMeasurementUnitsSelectChange(MEASUREMENTS_UNITS_OPTION_MOCK);

      expect(measurementUnitsService.setMeasurementUnits).toHaveBeenCalledWith(
        MEASUREMENTS_UNITS_OPTION_MOCK.id
      );

      // eslint-disable-next-line unicorn/consistent-destructuring
      expect(window.location.reload).toHaveBeenCalled();
    });
  });

  describe('compareOptions', () => {
    it('should return true', () => {
      const result = component.compareOptions(
        MEASUREMENTS_UNITS_OPTION_MOCK,
        MEASUREMENTS_UNITS_OPTION_MOCK
      );

      expect(result).toBe(true);
    });

    it('should return false', () => {
      const resultUndefinedA = component.compareOptions(
        undefined,
        MEASUREMENTS_UNITS_OPTION_MOCK
      );

      const resultUndefinedB = component.compareOptions(
        MEASUREMENTS_UNITS_OPTION_MOCK,
        undefined
      );

      expect(resultUndefinedA).toBe(false);
      expect(resultUndefinedB).toBe(false);
    });
  });
});
