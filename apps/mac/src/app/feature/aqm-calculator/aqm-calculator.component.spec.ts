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
import { ReactiveComponentModule } from '@ngrx/component';

import { ApplicationInsightsService } from '@schaeffler/application-insights';

import { BreadcrumbsService } from '../../shared/services/breadcrumbs/breadcrumbs.service';
import { SharedModule } from '../../shared/shared.module';
import {
  AQM_CALCULATION_CALCULATION_MOCK,
  AQM_CALCULATION_ERROR_MOCK,
} from './../../../testing/mocks/aqm-calculation-calculation.mock';
import { AQM_CALCULATION_MATERIALS_MOCK } from './../../../testing/mocks/aqm-calculation-materials.mock';
import { AqmCalculatorComponent } from './aqm-calculator.component';
import { AqmCalculatorApiService } from './services/aqm-calculator-api.service';
import {
  AQMCalculationRequest,
  AQMCalculationResponse,
  AQMMaterial,
} from './services/aqm-calulator-response.model';

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
      ReactiveComponentModule,
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
      expect(component.sumLimits).toBeDefined();
      expect(component['createForm']).toHaveBeenCalled();
      expect(component.materialInput.setValue).toHaveBeenCalled();
    });

    it('should patch composition form on select change', () => {
      component.ngOnInit();
      component.compositionForm.patchValue = jest.fn();
      component.compositionForm.markAsDirty = jest.fn();

      // eslint-disable-next-line @typescript-eslint/consistent-type-assertions
      const testMaterial: AQMMaterial = { name: 'test' } as AQMMaterial;

      component.materialInput.setValue(testMaterial);

      expect(component.compositionForm.patchValue).toHaveBeenCalled();
      expect(component.compositionForm.markAsDirty).toHaveBeenCalled();
    });
  });

  describe('patchSelect', () => {
    it('should do nothing if material is already selected', () => {
      const mockMaterial = { name: 'test' } as unknown as AQMMaterial;
      const mockPatch = jest.fn();

      component.materialInput = {
        patchValue: mockPatch,
        value: mockMaterial,
      } as unknown as FormControl;

      component['patchSelect'](mockMaterial);

      expect(mockPatch).not.toHaveBeenCalled();
    });

    it('should patch input if material is not already selected', () => {
      const mockMaterial = { name: 'test' } as unknown as AQMMaterial;
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

      component['createForm'](compositionLimits);
      component.compositionForm.patchValue(request);

      jest.advanceTimersByTime(1000);

      expect(
        component['aqmCalculationService'].getCalculationResult
      ).toHaveBeenCalledWith(request);

      jest.useRealTimers();
    });

    it('should not request a calculation on invalid form changes', () => {
      component['aqmCalculationService'].getCalculationResult = jest.fn();
      const request: AQMCalculationRequest = {
        c: 0.93,
        cr: 3,
        mn: 0.25,
        mo: 0,
        ni: 0,
        si: 0.15,
      };

      const compositionLimits =
        AQM_CALCULATION_MATERIALS_MOCK.compositionLimits;

      component['createForm'](compositionLimits);
      component.compositionForm.patchValue(request);

      expect(
        component['aqmCalculationService'].getCalculationResult
      ).not.toHaveBeenCalled();
    });
  });

  describe('findMaterialIndex', () => {
    it('should return index of material with equal composition', () => {
      const mockMaterial: AQMMaterial = {
        name: 'test',
        c: 1,
        si: 1,
        mn: 1,
        cr: 1,
        mo: 1,
        ni: 1,
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
      const result = component['findMaterialIndex'](mockComposition);

      expect(result).toEqual(0);
    });

    it('should return -1 if no material with same composition can be found', () => {
      const mockMaterial: AQMMaterial = {
        name: 'test',
        c: 1,
        si: 1,
        mn: 1,
        cr: 1,
        mo: 1,
        ni: 1,
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
      const result = component['findMaterialIndex'](mockComposition);

      expect(result).toEqual(-1);
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
