import { waitForAsync } from '@angular/core/testing';
import { ReactiveFormsModule } from '@angular/forms';
import { MatCardModule } from '@angular/material/card';
import { MATERIAL_SANITY_CHECKS } from '@angular/material/core';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatSelectModule } from '@angular/material/select';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

import { of } from 'rxjs';

import { createComponentFactory, Spectator } from '@ngneat/spectator/jest';
import { ReactiveComponentModule } from '@ngrx/component';

import { ApplicationInsightsService } from '@schaeffler/application-insights';

import {
  HARDNESS_CONVERSION_ERROR_MOCK,
  HARDNESS_CONVERSION_MOCK,
} from '../../../testing/mocks/hardness-conversion.mock';
import { HARDNESS_CONVERSION_UNITS_MOCK } from '../../../testing/mocks/hardness-conversion-units.mock';
import { BreadcrumbsService } from '../../shared/services/breadcrumbs/breadcrumbs.service';
import { SharedModule } from '../../shared/shared.module';
import { HardnessConverterComponent } from './hardness-converter.component';
import { HardnessConverterApiService } from './services/hardness-converter-api.service';

jest.mock('../../shared/change-favicon', () => ({
  changeFavicon: jest.fn(() => {}),
}));

describe('HardnessConverterComponent', () => {
  let component: HardnessConverterComponent;
  let spectator: Spectator<HardnessConverterComponent>;

  const createComponent = createComponentFactory({
    component: HardnessConverterComponent,
    imports: [
      BrowserAnimationsModule,
      MatFormFieldModule,
      MatInputModule,
      MatProgressSpinnerModule,
      MatSelectModule,
      ReactiveFormsModule,
      MatCardModule,
      SharedModule,
      ReactiveComponentModule,
    ],
    declarations: [HardnessConverterComponent],
    providers: [
      {
        provide: HardnessConverterApiService,
        useValue: {
          getUnits: jest.fn(() => of(HARDNESS_CONVERSION_UNITS_MOCK)),
          getConversionResult: jest.fn((a) =>
            Number.isInteger(Number.parseInt(a, 10))
              ? of(HARDNESS_CONVERSION_MOCK)
              : of(HARDNESS_CONVERSION_ERROR_MOCK)
          ),
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

  it('should create', waitForAsync(() => {
    expect(component).toBeTruthy();
  }));

  describe('trackByFn', () => {
    it('should return index', () => {
      const result = component.trackByFn(3);

      expect(result).toEqual(3);
    });
  });

  describe('triggering conversion', () => {
    it('should mark value change', waitForAsync(() => {
      let valueChanged = false;
      component.convertValue('42');
      component.valueChange$.subscribe(() => {
        valueChanged = true;
        expect(valueChanged).toBeTruthy();
      });
    }));

    it('should do nothing if input holds an empty string', waitForAsync(() => {
      let valueChanged = false;
      component.convertValue('');
      component.valueChange$.subscribe(() => {
        valueChanged = true;
        expect(valueChanged).toBeFalsy();
      });
    }));
  });

  it('should setup the unit list', () => {
    expect(component.unitList).toEqual(HARDNESS_CONVERSION_UNITS_MOCK.units);
    expect(component.version).toEqual('9999.9.0');
  });

  describe('handling keypresses', () => {
    it('should trigger value conversion on pressing a number', () => {
      const spy = jest.spyOn(component, 'convertValue');
      component.handleKeyInput('1', '101');
      expect(spy).toHaveBeenCalledWith('101');
    });

    it('should not trigger value conversion when a non-number key is pressed', () => {
      const spy = jest.spyOn(component, 'convertValue');
      component.handleKeyInput('a', '101a');
      expect(spy).toHaveBeenCalledTimes(0);
    });
  });

  it('should receive conversion results after a new input', waitForAsync(() => {
    component.results$.subscribe((result: any) => {
      expect(result).toEqual(HARDNESS_CONVERSION_MOCK);
    });
    component.hardness.get('value').setValue(42);
    // eslint-disable-next-line unicorn/no-useless-undefined
    component.valueChange$.next(undefined);
  }));

  it('should handle errors returned by the service', waitForAsync(() => {
    component.hardness.get('value').setValue('totally wrong and unacceptable');
    // eslint-disable-next-line unicorn/no-useless-undefined
    component.valueChange$.next(undefined);
    expect(component.error).toEqual(HARDNESS_CONVERSION_ERROR_MOCK.error);
  }));

  describe('getValue', () => {
    it('should round the number for HRc', () => {
      const val1 = component.getValue({ unit: 'HRc', value: 50.353_46 });
      const val2 = component.getValue({ unit: 'HRc', value: 1.000_000_04 });
      const val3 = component.getValue({ unit: 'HRc', value: 0.999_999_99 });
      const val4 = component.getValue({ unit: 'HRc', value: 0.000_000_04 });

      expect(val1).toEqual((50.4).toLocaleString());
      expect(val2).toEqual((1).toLocaleString());
      expect(val3).toEqual((1).toLocaleString());
      expect(val4).toEqual((0).toLocaleString());
    });

    it('should return the value as an integer for other units', () => {
      const val1 = component.getValue({ unit: 'MPa', value: 50.353_46 });
      const val2 = component.getValue({ unit: 'HV', value: 50.353_46 });
      const val3 = component.getValue({ unit: 'HB', value: 50.353_46 });
      const val4 = component.getValue({
        unit: 'Literally anything else',
        value: 50.353_46,
      });

      expect(val1).toEqual((50).toLocaleString());
      expect(val2).toEqual((50).toLocaleString());
      expect(val3).toEqual((50).toLocaleString());
      expect(val4).toEqual((50).toLocaleString());
    });

    it('should return the warning if no value is present', () => {
      const returnedData = component.getValue({
        unit: 'MPa',
        warning: 'warning description',
      });

      expect(returnedData).toEqual('warning description');
    });
  });

  describe('step', () => {
    it('should set a step interval of .1 for HRc', () => {
      component.hardness.get('unit').setValue('HRc');
      expect(component.step).toEqual('.1');
    });

    it('should set a step interval of 1 for any other unit', () => {
      component.hardness.get('unit').setValue('totally anything else');
      expect(component.step).toEqual('1');
    });
  });
});
