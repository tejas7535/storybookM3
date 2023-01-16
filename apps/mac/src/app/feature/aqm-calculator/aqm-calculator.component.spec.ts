import { FormControl, ReactiveFormsModule } from '@angular/forms';
import { MatCardModule } from '@angular/material/card';
import { MatChipsModule } from '@angular/material/chips';
import { MATERIAL_SANITY_CHECKS } from '@angular/material/core';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatSelectModule } from '@angular/material/select';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

import { of } from 'rxjs';

import { createComponentFactory, Spectator } from '@ngneat/spectator/jest';
import { LetModule, PushModule } from '@ngrx/component';

import { ApplicationInsightsService } from '@schaeffler/application-insights';
import { SelectModule } from '@schaeffler/inputs/select';
import { provideTranslocoTestingModule } from '@schaeffler/transloco/testing';

import {
  AQM_CALCULATION_CALCULATION_MOCK,
  AQM_CALCULATION_ERROR_MOCK,
  AQM_CALCULATION_MATERIALS_MOCK,
} from '@mac/testing/mocks';

import * as en from '../../../assets/i18n/en.json';
import { BreadcrumbsService } from '../../shared/services/breadcrumbs/breadcrumbs.service';
import { SharedModule } from '../../shared/shared.module';
import { AqmCalculatorComponent } from './aqm-calculator.component';
import {
  AQMCalculationRequest,
  AQMCalculationResponse,
  AQMMaterial,
} from './models';
import { AqmCalculatorApiService } from './services/aqm-calculator-api.service';

jest.mock('../../shared/change-favicon', () => ({
  changeFavicon: jest.fn(() => {}),
}));

describe('AqmCalculatorComponent', () => {
  let component: AqmCalculatorComponent;
  let spectator: Spectator<AqmCalculatorComponent>;

  const createComponent = createComponentFactory({
    component: AqmCalculatorComponent,
    imports: [
      BrowserAnimationsModule,
      MatProgressSpinnerModule,
      ReactiveFormsModule,
      MatFormFieldModule,
      MatInputModule,
      MatSelectModule,
      MatCardModule,
      MatChipsModule,
      MatIconModule,
      SharedModule,
      PushModule,
      LetModule,
      SelectModule,
      provideTranslocoTestingModule({ en }),
    ],
    declarations: [AqmCalculatorComponent],
    providers: [
      {
        provide: AqmCalculatorApiService,
        useValue: {
          getMaterialsData: jest.fn(() => of(AQM_CALCULATION_MATERIALS_MOCK)),
          getCalculationResult: jest.fn((request) =>
            request === 'invalid request'
              ? of(AQM_CALCULATION_CALCULATION_MOCK)
              : of(AQM_CALCULATION_ERROR_MOCK)
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

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  describe('ngOnInit', () => {
    it('should create form and set initial value', () => {
      component['createForm'] = jest.fn();
      component.materialInput.setValue = jest.fn();

      component.ngOnInit();

      expect(component.materials).toBeDefined();
      expect(component['createForm']).toHaveBeenCalled();
      expect(component.materialInput.setValue).toHaveBeenCalled();
    });

    it('should patch composition form on select change', () => {
      component.ngOnInit();
      component.compositionForm.patchValue = jest.fn();
      component.compositionForm.markAsDirty = jest.fn();

      // eslint-disable-next-line @typescript-eslint/consistent-type-assertions
      const testMaterial: AQMMaterial = { title: 'test' } as AQMMaterial;

      component.materialInput.setValue(testMaterial);

      expect(component.compositionForm.patchValue).toHaveBeenCalled();
      expect(component.compositionForm.markAsDirty).toHaveBeenCalled();
    });
  });

  describe('patchSelect', () => {
    it('should do nothing if material is already selected', () => {
      const mockMaterial = { title: 'test' } as unknown as AQMMaterial;
      const mockPatch = jest.fn();

      component.materialInput = {
        patchValue: mockPatch,
        value: mockMaterial,
      } as unknown as FormControl;

      component['patchSelect'](mockMaterial);

      expect(mockPatch).not.toHaveBeenCalled();
    });

    it('should patch input if material is not already selected', () => {
      const mockMaterial = { title: 'test' } as unknown as AQMMaterial;
      const otherMockMaterial = {
        name: 'test',
        c: 1,
      } as unknown as AQMMaterial;
      const mockPatch = jest.fn();

      component.materialInput = {
        patchValue: mockPatch,
        value: mockMaterial,
      } as unknown as FormControl;

      component['patchSelect'](otherMockMaterial);

      expect(mockPatch).toHaveBeenCalledWith(otherMockMaterial, {
        emitEvent: false,
      });
    });
  });

  describe('createForm', () => {
    it('should create form', () => {
      const compositionLimits =
        AQM_CALCULATION_MATERIALS_MOCK.compositionLimits;

      component['createForm'](compositionLimits);

      expect(component.compositionForm).toBeDefined();
    });

    it('should request a calculation on form changes', () => {
      jest.useFakeTimers();
      component['aqmCalculationService'].getCalculationResult = jest.fn(() =>
        of({} as AQMCalculationResponse)
      );
      const request: AQMCalculationRequest = {
        c: 0.93,
        cr: 1.35,
        mn: 0.25,
        mo: 0,
        ni: 0,
        si: 0.15,
      };

      const compositionLimits =
        AQM_CALCULATION_MATERIALS_MOCK.compositionLimits;

      component.materials = [];

      component['createForm'](compositionLimits);
      component.compositionForm.patchValue(request);

      jest.advanceTimersByTime(1000);

      expect(
        component['aqmCalculationService'].getCalculationResult
      ).toHaveBeenCalledWith(request);

      jest.useRealTimers();
    });
  });

  describe('findMaterial', () => {
    it('should return material with equal composition', () => {
      const mockMaterial: AQMMaterial = {
        id: 'test',
        title: 'test',
        data: { c: 1, si: 1, mn: 1, cr: 1, mo: 1, ni: 1 },
      };
      const mockComposition: AQMCalculationRequest = {
        c: 1,
        si: 1,
        mn: 1,
        cr: 1,
        mo: 1,
        ni: 1,
      };
      component.materials = [mockMaterial];
      const result = component['findMaterial'](mockComposition);

      expect(result).toEqual(mockMaterial);
    });

    it('should return undefined if no material with same composition can be found', () => {
      const mockMaterial: AQMMaterial = {
        id: 'test',
        title: 'test',
        data: { c: 1, si: 1, mn: 1, cr: 1, mo: 1, ni: 1 },
      };
      const mockComposition: AQMCalculationRequest = {
        c: 2,
        si: 1,
        mn: 1,
        cr: 1,
        mo: 1,
        ni: 1,
      };
      component.materials = [mockMaterial];
      const result = component['findMaterial'](mockComposition);

      expect(result).toEqual(undefined);
    });
  });

  describe('filterFn', () => {
    const option: AQMMaterial = {
      id: '78',
      title: 'aBcDeFgH ',
      data: {} as AQMCalculationRequest,
    };
    it('should return true with matching string', () => {
      expect(component.filterFn(option, option.title)).toBe(true);
    });
    it('should return true with undefined option', () => {
      expect(component.filterFn(undefined, option.title)).toBe(undefined);
    });
    it('should return true with undefined option title', () => {
      expect(
        component.filterFn(
          { id: '1', title: undefined, data: {} as AQMCalculationRequest },
          option.title
        )
      ).toBe(undefined);
    });
    it('should Skip filter with undefined', () => {
      // eslint-disable-next-line unicorn/no-useless-undefined
      expect(component.filterFn(option, undefined)).toBe(true);
    });
    it('should accept with lowercase match', () => {
      expect(component.filterFn(option, option.title.toLowerCase())).toBe(true);
    });
    it('should accept with uppercase match', () => {
      expect(component.filterFn(option, option.title.toUpperCase())).toBe(true);
    });
    it('should accept with partial match', () => {
      expect(component.filterFn(option, option.title.slice(2, 7))).toBe(true);
    });
    it('should accept with empty string', () => {
      expect(component.filterFn(option, '')).toBe(true);
    });
    it('should accept with trailing whitespace', () => {
      expect(component.filterFn(option, `${option.title}    `)).toBe(true);
    });
    it('should accept with starting whitespace', () => {
      expect(component.filterFn(option, `    ${option.title}`)).toBe(true);
    });
  });

  describe('trackByFn', () => {
    it('should return index', () => {
      const result = component.trackByFn(1);

      expect(result).toEqual(1);
    });
  });

  describe('ngOnDestroy', () => {
    it('should unsubscribe', () => {
      component.subscription.unsubscribe = jest.fn();

      component.ngOnDestroy();

      expect(component.subscription.unsubscribe).toHaveBeenCalled();
    });
  });
});
