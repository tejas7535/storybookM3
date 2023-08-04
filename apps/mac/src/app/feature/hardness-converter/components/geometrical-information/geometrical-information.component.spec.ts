import { ClipboardModule } from '@angular/cdk/clipboard';
import { CommonModule } from '@angular/common';
import { HttpErrorResponse } from '@angular/common/http';
import { ElementRef } from '@angular/core';
import { fakeAsync, tick } from '@angular/core/testing';
import { FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatIconModule } from '@angular/material/icon';
import { MatLegacyButtonModule as MatButtonModule } from '@angular/material/legacy-button';
import { MatLegacyFormFieldModule as MatFormFieldModule } from '@angular/material/legacy-form-field';
import { MatLegacyInputModule as MatInputModule } from '@angular/material/legacy-input';
import { MatLegacySelectModule as MatSelectModule } from '@angular/material/legacy-select';
import { MatLegacySlideToggleModule as MatSlideToggleModule } from '@angular/material/legacy-slide-toggle';
import { MatLegacySnackBarModule } from '@angular/material/legacy-snack-bar';

import { BehaviorSubject, filter, of, take } from 'rxjs';

import { createComponentFactory, Spectator } from '@ngneat/spectator/jest';
import { LetModule, PushModule } from '@ngrx/component';

import { provideTranslocoTestingModule } from '@schaeffler/transloco/testing';

import { SharedModule } from '@mac/shared/shared.module';

import * as en from '../../../../../assets/i18n/en.json';
import { HB, HRA, HV, MPA } from '../../constants';
import { IndentationResponse } from '../../models';
import { HardnessConverterApiService } from '../../services/hardness-converter-api.service';
import { GeometricalInformationComponent } from './geometrical-information.component';

describe('GeometricalInformationComponent', () => {
  let component: GeometricalInformationComponent;
  let spectator: Spectator<GeometricalInformationComponent>;

  const HC_INDENTATION_MOCK: IndentationResponse = {
    depth: 2,
    edge_distance: 3,
    indentation_distance: 4,
    width: 5,
    minimum_thickness: 6,
  };

  let showError = false;

  const hardnessService = {
    getInfo: jest.fn(),
    getUnits: jest.fn(),
    getConversion: jest.fn(),
    getIndentation: jest.fn((_a, _b, handler) =>
      showError ? of(handler()) : of(HC_INDENTATION_MOCK)
    ),
  };
  const inputElement = { nativeElement: { focus: jest.fn() } } as ElementRef;
  const activeConversion = new BehaviorSubject<{
    value: number;
    unit: string;
  }>({ value: undefined, unit: HV });

  const createComponent = createComponentFactory({
    component: GeometricalInformationComponent,
    imports: [
      CommonModule,
      MatIconModule,
      MatFormFieldModule,
      FormsModule,
      MatSelectModule,
      MatSlideToggleModule,
      MatInputModule,
      MatButtonModule,
      PushModule,
      LetModule,
      MatLegacySnackBarModule,
      ClipboardModule,
      ReactiveFormsModule,
      SharedModule,
      provideTranslocoTestingModule({ en }),
    ],
    providers: [
      {
        provide: HardnessConverterApiService,
        useValue: {
          ...hardnessService,
        },
      },
    ],
    detectChanges: false,
  });

  beforeEach(() => {
    spectator = createComponent();
    spectator.setInput('inputElement', inputElement);
    spectator.setInput('activeConversion', activeConversion);
    spectator.detectChanges();
    component = spectator.debugElement.componentInstance;
    component.ngOnInit();
    // initialize inputs
    showError = false;
    activeConversion.next({ value: undefined, unit: HV });
    component.isEnabled = true;
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  describe('should react to changes of active conversation', () => {
    beforeEach(() => {
      component['setValidators'] = jest.fn();
    });
    it('should reset controls on unit change', (done) => {
      component.loadControl.setValue(5);
      activeConversion.next({ value: 7, unit: HRA });

      expect(component.valueControl.value).toEqual(7);
      expect(component.loadControl.value).toBeFalsy();
      expect(component['conversionUnit']).toEqual(HRA);
      expect(component['setValidators']).toBeCalled();
      done();
    });

    it('should NOT reset controls without unit change', () => {
      component.loadControl.setValue(5);
      activeConversion.next({ value: 4, unit: HV });

      expect(component.valueControl.value).toEqual(4);
      expect(component.loadControl.value).toEqual(5);
      expect(component['conversionUnit']).toEqual(HV);
      expect(component['setValidators']).not.toBeCalled();
    });
  });

  describe('should react to changes of input control', () => {
    beforeEach(() => {
      // resulting in only 'value' (20 - 90) and 'diameter' (3-19) will be active
      showError = false;
      component['reset']();
      activeConversion.next({ value: 21, unit: HRA });
      hardnessService.getIndentation.mockClear();
    });
    it('should call hardness service for indentation values', (done) => {
      // diameter is only valid for 3-19
      component.diameterControl.setValue(5);
      expect(hardnessService.getIndentation).toBeCalledWith(
        { value: 21, diameter: 5 },
        HRA,
        expect.anything()
      );

      // verify value of observable resultLoading
      component.indentationResult$
        // only take the first non-null value
        .pipe(filter(Boolean), take(1))
        .subscribe((value) => {
          expect(value).toBe(HC_INDENTATION_MOCK);
          done();
        });
    });
    it('should call hardness service for indentation values with diameterBall value', (done) => {
      activeConversion.next({ value: 23, unit: HB });
      component.loadControl.setValue(2);
      component.diameterBallControl.setValue(17);
      expect(hardnessService.getIndentation).toBeCalledWith(
        { value: 23, diameter: 17, load: 2 },
        HB,
        expect.anything()
      );

      // verify value of observable resultLoading
      component.indentationResult$
        // only take the first non-null value
        .pipe(filter(Boolean), take(1))
        .subscribe((value) => {
          expect(value).toBe(HC_INDENTATION_MOCK);
          done();
        });
    });

    it('should call error handler on service failure', () => {
      component['errorHandler'] = jest.fn();
      showError = true;

      activeConversion.next({ value: 23, unit: HB });
      component.loadControl.setValue(2);
      component.diameterBallControl.setValue(17);

      expect(component['errorHandler']).toBeCalled();
      expect(hardnessService.getIndentation).toBeCalled();
    });

    it('should not call hardness service for indentation values on invalid input', () => {
      // diameter is only valid for 3-19
      component.diameterControl.setValue(2);
      expect(hardnessService.getIndentation).not.toBeCalled();
    });
    it('should not call hardness service for indentation values if geoinformation is disabled', () => {
      component.isEnabled = false;
      component.diameterControl.setValue(5);
      expect(hardnessService.getIndentation).not.toBeCalled();
    });
    it('should not call hardness service for indentation values on unsupported unit', () => {
      // mpa is not supported for calculation
      activeConversion.next({ value: 21, unit: MPA });
      expect(hardnessService.getIndentation).not.toBeCalled();
    });
  });

  describe('set Validators', () => {
    it('should set a validator', () => {
      component['setValidators'](HRA, 'diameter');
      expect(component.diameterControl.enabled).toBeTruthy();
      expect(
        component.diameterControl.hasValidator(Validators.required)
      ).toBeTruthy();
    });
    it('should unset a validator', () => {
      component['setValidators'](HB, 'diameter');
      expect(component.diameterControl.enabled).toBeFalsy();
      expect(
        component.diameterControl.hasValidator(Validators.required)
      ).toBeFalsy();
    });
  });

  describe('getMaterial', () => {
    it('should return a list of materials', () => {
      expect(component.getMaterials()).toContain('FE');
      expect(component.getMaterials()).toContain('OTHER');
      expect(component.getMaterials()).toContain('AL');
      expect(component.getMaterials()).toContain('SN');
    });
  });

  describe('get value', () => {
    it('should return the formated string for numbers', () => {
      const key = 'width';
      const response = {
        [key]: 12.1234,
      } as IndentationResponse;

      expect(component.get(response, key)).toEqual('12.123');
    });
    it('should return the string for other types', () => {
      const key = 'valid';
      const response = {
        [key]: true,
      } as IndentationResponse;

      expect(component.get(response, key)).toEqual(response[key]);
    });
  });

  describe('getKeys', () => {
    beforeEach(() => {
      component['conversionUnit'] = HV;
    });
    it('should return geo keys', () => {
      expect(component.getGeoKeys()).toContain('width');
      expect(component.getGeoKeys()).toContain('depth');
      expect(component.getGeoKeys()).toContain('edge_distance');
      expect(component.getGeoKeys()).toContain('indentation_distance');
      expect(component.getGeoKeys()).toContain('minimum_thickness');
    });
    it('should return geo keys unit', () => {
      expect(component.getGeoKeysUnit()).toBe('mm');
    });
    it('should return corrected keys', () => {
      expect(component.getCorrectedKeys()).toContain('hardness_convex_sphere');
      expect(component.getCorrectedKeys()).toContain(
        'hardness_concave_cylinder_0'
      );
      expect(component.getCorrectedKeys()).toContain(
        'hardness_concave_cylinder_45'
      );
      expect(component.getCorrectedKeys()).toContain('hardness_concave_sphere');
      expect(component.getCorrectedKeys()).toContain(
        'hardness_convex_cylinder_0'
      );
      expect(component.getCorrectedKeys()).toContain(
        'hardness_convex_cylinder_45'
      );
    });

    it('should return that corrected keys exist', () => {
      expect(component.hasCorrectedKeys()).toBeTruthy();
    });
    it('should return corrected keys unit', () => {
      expect(component.getCorrectedKeysUnit()).toBe('hv');
    });
    it('should return other keys', () => {
      expect(component.getOther()).toContain('test_force');
    });
    it('should return that other keys exist', () => {
      expect(component.hasOther()).toBeTruthy();
    });
    it('should return other keys unit', () => {
      expect(component.getOtherUnit()).toBe('kp');
    });
  });

  describe('onCopyClipboard', () => {
    it('should call copyToClipboard', () => {
      component['clipboard'].copy = jest.fn();
      component['snackbar'].open = jest.fn();

      component.onCopyButtonClick('1', '2');
      expect(component['clipboard'].copy).toHaveBeenCalled();
      expect(component['snackbar'].open).toHaveBeenCalledWith(
        'Copied value to clipboard!',
        'X',
        { duration: 2500 }
      );
    });
  });

  describe('setFocus', () => {
    it('should set focus to the first input', fakeAsync(() => {
      component['setFocus']();
      // wait for timeout
      tick(100);
      expect(inputElement.nativeElement.focus).toHaveBeenCalled();
    }));
  });

  describe('errorHandler', () => {
    it('should open snackbar', () => {
      component['snackbar'].open = jest.fn();
      const err = { status: 400 } as HttpErrorResponse;

      component['errorHandler'](err);
      expect(component['snackbar'].open).toHaveBeenCalledWith(
        expect.any(String),
        'X',
        { duration: 5000 }
      );
    });
  });
});
