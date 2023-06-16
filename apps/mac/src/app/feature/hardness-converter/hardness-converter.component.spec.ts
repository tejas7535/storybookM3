import { HttpClientTestingModule } from '@angular/common/http/testing';
import { waitForAsync } from '@angular/core/testing';
import { FormGroup, ReactiveFormsModule } from '@angular/forms';
import { MatCardModule } from '@angular/material/card';
import { MATERIAL_SANITY_CHECKS } from '@angular/material/core';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatLegacySnackBarModule as MatSnackBarModule } from '@angular/material/legacy-snack-bar';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatSelectModule } from '@angular/material/select';
import { MatTooltipModule } from '@angular/material/tooltip';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { RouterTestingModule } from '@angular/router/testing';

import { of } from 'rxjs';

import { createComponentFactory, Spectator } from '@ngneat/spectator/jest';
import { PushModule } from '@ngrx/component';

import { ApplicationInsightsService } from '@schaeffler/application-insights';
import { SubheaderModule } from '@schaeffler/subheader';
import { provideTranslocoTestingModule } from '@schaeffler/transloco/testing';

import { changeFavicon } from '@mac/shared/change-favicon';
import {
  HARDNESS_CONVERSION_INFO_MOCK,
  HARDNESS_CONVERSION_MOCK,
  HARDNESS_CONVERSION_UNITS_MOCK,
} from '@mac/testing/mocks';

import * as en from '../../../assets/i18n/en.json';
import { BreadcrumbsService } from '../../shared/services/breadcrumbs/breadcrumbs.service';
import { SharedModule } from '../../shared/shared.module';
import { CopyInputModule } from './components/copy-input/copy-input.module';
import { HardnessConverterComponent } from './hardness-converter.component';
import { HardnessConverterApiService } from './services/hardness-converter-api.service';

jest.mock('@mac/shared/change-favicon', () => ({
  changeFavicon: jest.fn(() => {}),
}));

describe('HardnessConverterComponent', () => {
  let component: HardnessConverterComponent;
  let spectator: Spectator<HardnessConverterComponent>;

  const createComponent = createComponentFactory({
    component: HardnessConverterComponent,
    imports: [
      NoopAnimationsModule,
      MatFormFieldModule,
      MatInputModule,
      MatProgressSpinnerModule,
      MatSelectModule,
      MatIconModule,
      MatTooltipModule,
      MatSnackBarModule,
      ReactiveFormsModule,
      MatCardModule,
      SharedModule,
      PushModule,
      CopyInputModule,
      SubheaderModule,
      RouterTestingModule,
      provideTranslocoTestingModule({ en }),
      HttpClientTestingModule,
    ],
    declarations: [HardnessConverterComponent],
    providers: [
      {
        provide: HardnessConverterApiService,
        useValue: {
          getInfo: jest.fn(() => of(HARDNESS_CONVERSION_INFO_MOCK)),
          getUnits: jest.fn(() => of(HARDNESS_CONVERSION_UNITS_MOCK)),
          getConversion: jest.fn(() => of(HARDNESS_CONVERSION_MOCK)),
        },
      },
      {
        provide: BreadcrumbsService,
        useValue: {
          updateBreadcrumb: jest.fn(() => {}),
        },
      },
      {
        provide: ApplicationInsightsService,
        useValue: {
          logEvent: jest.fn(),
        },
      },
      {
        provide: MATERIAL_SANITY_CHECKS,
        useValue: false,
      },
    ],
  });

  beforeEach(() => {
    spectator = createComponent();
    component = spectator.debugElement.componentInstance;
  });

  afterEach(() => {
    jest.useRealTimers();
  });

  it('should create', waitForAsync(() => {
    expect(component).toBeTruthy();
  }));

  describe('ngOnInit', () => {
    it('should log start event and change favicon and get the unit list', () => {
      component['fetchInfo'] = jest.fn();

      component.ngOnInit();

      expect(
        component['applicationInsightService'].logEvent
      ).toHaveBeenCalledWith('[MAC - HC] opened');
      expect(changeFavicon).toHaveBeenCalledWith(
        'assets/favicons/hardness-converter.ico',
        'Hardness Converter'
      );
      expect(component['fetchInfo']).toHaveBeenCalled();
    });
    it('should parse the values and calculate the result', () => {
      jest.useFakeTimers();
      component['fetchInfo'] = jest.fn();

      component['calculateValues'] = jest.fn();
      component.multipleValues$.next = jest.fn();
      component['convertValue'] = jest.fn();

      component.ngOnInit();

      jest.advanceTimersByTime(500);

      const mockControl = component['createInputFormControl']();

      component.additionalInputs.push(
        new FormGroup({
          [0]: component['createInputFormControl'](),
          [1]: mockControl,
        })
      );

      component.inputValue.patchValue(500);
      jest.advanceTimersByTime(50);
      mockControl.patchValue(510);

      jest.advanceTimersByTime(1000);

      expect(component['calculateValues']).toHaveBeenCalledWith([500, 510]);
      expect(component.multipleValues$.next).not.toHaveBeenCalled();
      expect(component['convertValue']).not.toHaveBeenCalled();
    });

    it('should parse the values and calculate the result for multiple values', () => {
      jest.useFakeTimers();
      component['fetchInfo'] = jest.fn();

      component['calculateValues'] = jest.fn();
      component.multipleValues$.next = jest.fn();
      component['convertValue'] = jest.fn();
      component.inputTable.setValue('table', { emitEvent: false });
      component.inputUnit.setValue('unit', { emitEvent: false });

      component.ngOnInit();

      jest.advanceTimersByTime(500);

      component.inputValue.patchValue(500);

      jest.advanceTimersByTime(1000);

      expect(component['calculateValues']).not.toHaveBeenCalled();
      expect(component.multipleValues$.next).toHaveBeenCalledWith(false);
      expect(component['convertValue']).toHaveBeenCalledWith(
        'table',
        500,
        'unit'
      );
    });

    it('should parse the values and reset calculation on negative items', () => {
      jest.useFakeTimers();
      component['fetchInfo'] = jest.fn();

      component['calculateValues'] = jest.fn();
      component['convertValue'] = jest.fn();
      component['resetResult'] = jest.fn();

      component.ngOnInit();

      const mockControl = component['createInputFormControl']();

      component.additionalInputs.push(
        new FormGroup({
          [0]: component['createInputFormControl'](),
          [1]: mockControl,
        })
      );
      mockControl.patchValue(7);
      component.inputValue.patchValue(-1);
      jest.advanceTimersByTime(500);

      expect(component['calculateValues']).not.toHaveBeenCalled();
      expect(component['convertValue']).not.toHaveBeenCalled();
      expect(component['resetResult']).toHaveBeenCalled();
    });

    it('should parse the values and reset calculation on negative additional input', () => {
      jest.useFakeTimers();
      component['fetchInfo'] = jest.fn();

      component['calculateValues'] = jest.fn();
      component['convertValue'] = jest.fn();
      component['resetResult'] = jest.fn();

      component.ngOnInit();

      const mockControl = component['createInputFormControl']();

      component.additionalInputs.push(
        new FormGroup({
          [0]: component['createInputFormControl'](),
          [1]: mockControl,
        })
      );
      component.inputValue.patchValue(7);
      mockControl.patchValue(-1);
      jest.advanceTimersByTime(500);

      expect(component['calculateValues']).not.toHaveBeenCalled();
      expect(component['convertValue']).not.toHaveBeenCalled();
      expect(component['resetResult']).toHaveBeenCalled();
    });
  });

  describe('ngOnDestroy', () => {
    it('should complete the destroy subject', () => {
      component['destroy$'].next = jest.fn();
      component['destroy$'].complete = jest.fn();

      component.ngOnDestroy();

      expect(component['destroy$'].next).toHaveBeenCalled();
      expect(component['destroy$'].complete).toHaveBeenCalled();
    });
  });

  describe('fetchInfo', () => {
    it('should set the conversion tables, units and version', () => {
      jest.useFakeTimers();

      component.tables$.next = jest.fn();
      component.units$.next = jest.fn();
      component.version$.next = jest.fn();
      component.inputTable.setValue = jest.fn();

      component['hardnessService'].getInfo = jest.fn(() =>
        of({
          conversionTables: ['Stundenplan'],
          units: ['oh', 'G-UNIT'],
          version: '9.9.9',
        })
      );

      component['fetchInfo']();

      jest.advanceTimersByTime(2000);

      expect(component.tables$.next).toHaveBeenCalledWith(['Stundenplan']);
      expect(component.units$.next).toHaveBeenCalledWith(['oh', 'G-UNIT']);
      expect(component.version$.next).toHaveBeenCalledWith('9.9.9');
      expect(component.inputTable.setValue).toHaveBeenCalledWith('Stundenplan');
    });
  });

  describe('fetchAvailableUnits', () => {
    it('should fetch the available units', () => {
      jest.useFakeTimers();

      component.enabled$.next = jest.fn();
      component.inputUnit.setValue('not existing unit', { emitEvent: false });
      component.inputUnit.setValue = jest.fn();

      component['hardnessService'].getUnits = jest.fn(() =>
        of(HARDNESS_CONVERSION_UNITS_MOCK)
      );

      component['fetchAvailableUnits']('table');

      jest.advanceTimersByTime(2000);

      expect(component.enabled$.next).toHaveBeenCalledWith(
        HARDNESS_CONVERSION_UNITS_MOCK.enabled
      );
      expect(component.inputUnit.setValue).toHaveBeenCalledWith(
        HARDNESS_CONVERSION_UNITS_MOCK.enabled[0]
      );
    });
  });

  describe('calculateValues', () => {
    it('should calculate the values correctly', () => {
      component.multipleValues$.next = jest.fn();
      component.average$.next = jest.fn();
      component.standardDeviation$.next = jest.fn();
      component['convertValue'] = jest.fn();

      component.inputTable.setValue('table', { emitEvent: false });
      component.inputUnit.setValue('unit', { emitEvent: false });

      component['calculateValues']([2, 4, 4, 4, 5, 5, 7, 9]);

      expect(component.multipleValues$.next).toHaveBeenCalledWith(true);
      expect(component.average$.next).toHaveBeenCalledWith(5);
      expect(component.standardDeviation$.next).toHaveBeenCalledWith(2);
      expect(component['convertValue']).toHaveBeenCalledWith(
        'table',
        5,
        'unit',
        7
      );
    });
  });

  describe('convertValue', () => {
    it('should convert the value and publish the result', () => {
      jest.useFakeTimers();

      component.resultLoading$.next = jest.fn();
      component['hardnessService'].getConversion = jest.fn(() =>
        of(HARDNESS_CONVERSION_MOCK)
      );
      component.conversionResult$.next = jest.fn();

      component['convertValue']('table', 500, 'unit', 1);

      jest.advanceTimersByTime(2000);

      expect(component.resultLoading$.next).toHaveBeenCalledWith(true);
      expect(component.resultLoading$.next).toHaveBeenCalledWith(false);
      expect(component['hardnessService'].getConversion).toHaveBeenCalledWith({
        conversionTable: 'table',
        value: 500,
        unit: 'unit',
        deviation: 1,
      });
      expect(component.conversionResult$.next).toHaveBeenCalledWith(
        HARDNESS_CONVERSION_MOCK
      );
    });
  });

  describe('get step', () => {
    it('should return 1', () => {
      expect(component.step).toBe('1');
    });

    it('should return .1 for HRc', () => {
      component.inputUnit.setValue('hrc');

      expect(component.step).toBe('.1');
    });
  });

  describe('getPrecision', () => {
    it('should return 1 if the unit is in ONE_DIGIT_UNITS', () => {
      const result = component.getPrecision('hrc');

      expect(result).toBe(1);
    });

    it('should return 0 if the unit is not in ONE_DIGIT_UNITS', () => {
      const result = component.getPrecision('something not existing');

      expect(result).toBe(0);
    });
  });

  describe('onAddButtonClick', () => {
    it('should add a form group to additionalInputs form array', () => {
      component.additionalInputs.push = jest.fn();
      component.conversionForm.markAsTouched = jest.fn();
      component.conversionForm.markAsDirty = jest.fn();

      component.onAddButtonClick();

      expect(component.additionalInputs.push).toHaveBeenCalledWith(
        expect.any(FormGroup),
        { emitEvent: false }
      );
      expect(component.conversionForm.markAsTouched).toHaveBeenCalled();
      expect(component.conversionForm.markAsDirty).toHaveBeenCalled();
    });
  });

  describe('onResetButtonClick', () => {
    it('should reset everything', () => {
      component.additionalInputs.clear = jest.fn();
      component.conversionForm.reset = jest.fn();
      component.conversionForm.markAsUntouched = jest.fn();
      component.conversionForm.markAsPristine = jest.fn();
      component.multipleValues$.next = jest.fn();

      component.onResetButtonClick();

      expect(component.additionalInputs.clear).toHaveBeenCalled();
      expect(component.conversionForm.reset).toHaveBeenCalled();
      expect(component.conversionForm.markAsUntouched).toHaveBeenCalled();
      expect(component.conversionForm.markAsPristine).toHaveBeenCalled();
      expect(component.multipleValues$.next).toHaveBeenCalledWith(false);
    });
  });

  describe('onShareButtonClick', () => {
    it('should copy url and open snackbar', () => {
      component['clipboard'].copy = jest.fn();
      component['snackbar'].open = jest.fn();

      component.onShareButtonClick();

      expect(component['clipboard'].copy).toHaveBeenCalled();
      expect(component['snackbar'].open).toHaveBeenCalledWith(
        'Url copied to clipboard',
        'Close',
        { duration: 5000 }
      );
    });
  });

  describe('trackByFn', () => {
    it('should return index', () => {
      const result = component.trackByFn(3);

      expect(result).toEqual(3);
    });
  });

  describe('getTooltip', () => {
    it('should return translation for MPA', () => {
      expect(component.getTooltip('mpa')).toBeTruthy();
    });
    it("should return 'undefined' for other units", () => {
      expect(component.getTooltip('hc')).toBeFalsy();
    });
  });

  describe('createInputFormControl', () => {
    it('should allow positive input', () => {
      const comp = component['createInputFormControl']();
      comp.setValue(77);
      expect(comp.valid).toBeTruthy();
    });

    it('should NOT allow negative input', () => {
      const comp = component['createInputFormControl']();
      comp.setValue(-4);
      expect(comp.valid).toBeFalsy();
    });
  });

  it('resetResult should reset result and multiValue fields', () => {
    component.conversionResult$.next = jest.fn();
    component.multipleValues$.next = jest.fn();

    component['resetResult']();
    // eslint-disable-next-line unicorn/no-useless-undefined
    expect(component.conversionResult$.next).toBeCalledWith(undefined);
    expect(component.multipleValues$.next).toBeCalledWith(false);
  });
});
