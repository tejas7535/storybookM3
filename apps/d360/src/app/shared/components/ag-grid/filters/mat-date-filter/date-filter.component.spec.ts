import { FormControl } from '@angular/forms';

import { TranslocoLocaleService } from '@jsverse/transloco-locale';
import {
  createComponentFactory,
  createServiceFactory,
  Spectator,
  SpectatorService,
} from '@ngneat/spectator/jest';
import type { IDateParams } from 'ag-grid-enterprise';

import { ValidationHelper } from '../../../../utils/validation/validation-helper';
import { DateFilterComponent } from './date-filter.component';

describe('DateFilterComponent', () => {
  let spectator: Spectator<DateFilterComponent>;
  let spectator2: SpectatorService<TranslocoLocaleService>;

  const createService = createServiceFactory(TranslocoLocaleService);
  const createComponent = createComponentFactory({
    component: DateFilterComponent,
  });

  beforeEach(() => {
    spectator2 = createService();
    ValidationHelper.localeService = spectator2.service;
    spectator = createComponent();
  });

  describe('agInit', () => {
    it('should initialize the params', () => {
      const mockParams: IDateParams = { onDateChanged: jest.fn() } as any;

      spectator.component.agInit(mockParams);

      expect(spectator.component['params']).toEqual(mockParams);
    });
  });

  describe('onDateChanged', () => {
    it('should call the onDateChanged method from params', () => {
      const mockOnDateChanged = jest.fn();
      spectator.component['params'] = {
        onDateChanged: mockOnDateChanged,
      } as any;

      spectator.component.onDateChanged();

      expect(mockOnDateChanged).toHaveBeenCalledTimes(1);
    });
  });

  describe('getDate', () => {
    it('should return the control value', () => {
      spectator.component['control'] = new FormControl(null);
      const mockDate = new Date();
      spectator.component['control'].setValue(mockDate);

      const result = spectator.component.getDate();

      expect(result).toEqual(mockDate);
    });
  });

  describe('setDate', () => {
    it('should set the control value', () => {
      spectator.component['control'] = new FormControl(null);
      const mockDate = new Date();

      spectator.component.setDate(mockDate);

      expect(spectator.component['control'].getRawValue()).toEqual(mockDate);
    });
  });

  describe('setInputPlaceholder', () => {
    it('should set the input placeholder attribute', () => {
      const mockFormat = 'mm/dd/yyyy';
      jest.spyOn(ValidationHelper, 'getDateFormat').mockReturnValue(mockFormat);

      spectator.component.setInputPlaceholder();

      expect(spectator.query('input')).toHaveAttribute(
        'placeholder',
        mockFormat
      );
    });
  });

  describe('setInputAriaLabel', () => {
    it('should set the input aria-label attribute', () => {
      const mockLabel = 'Date Label';

      spectator.component.setInputAriaLabel(mockLabel);

      expect(spectator.query('input')).toHaveAttribute('aria-label', mockLabel);
    });
  });
});
