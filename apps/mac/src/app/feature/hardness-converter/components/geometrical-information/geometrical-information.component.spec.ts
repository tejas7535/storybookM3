import { ClipboardModule } from '@angular/cdk/clipboard';
import { CommonModule } from '@angular/common';
import { ElementRef } from '@angular/core';
import { fakeAsync, tick } from '@angular/core/testing';
import { FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { MatSnackBarModule } from '@angular/material/snack-bar';

import { BehaviorSubject, filter, of, take } from 'rxjs';

import { createComponentFactory, Spectator } from '@ngneat/spectator/jest';
import { LetDirective, PushPipe } from '@ngrx/component';

import { StringOption } from '@schaeffler/inputs';
import { provideTranslocoTestingModule } from '@schaeffler/transloco/testing';

import { SharedModule } from '@mac/shared/shared.module';

import * as en from '../../../../../assets/i18n/en.json';
import { HB, HRA, HV, MPA } from '../../constants';
import {
  INDENTATION_CONFIG,
  IndentationConfigColumn,
} from '../../constants/indentation-config';
import { IndentationResponse } from '../../models';
import { HardnessConverterApiService } from '../../services/hardness-converter-api.service';
import { InternalUserCheckService } from '../../services/internal-user-check.service';
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

  const hardnessService = {
    getInfo: jest.fn(),
    getUnits: jest.fn(),
    getConversion: jest.fn(),
    getIndentation: jest.fn((_a, _b) => of(HC_INDENTATION_MOCK)),
  };
  const inputElement = { nativeElement: { focus: jest.fn() } } as ElementRef;
  const activeConversion = new BehaviorSubject<{
    value: number;
    unit: string;
  }>({ value: undefined, unit: HV });

  const toSo = (i: number) => ({ id: i, title: i.toString() } as StringOption);

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
      PushPipe,
      LetDirective,
      MatSnackBarModule,
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
      {
        provide: InternalUserCheckService,
        useValue: {
          isInternalUser: jest.fn(() => of(true)),
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
    activeConversion.next({ value: undefined, unit: HV });
    component.enabledControl.setValue(true);
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  describe('should react to changes of active conversation', () => {
    beforeEach(() => {
      component['setValidators'] = jest.fn();
    });
    it('should reset controls on unit change', (done) => {
      component.loadControl.setValue(toSo(5));
      activeConversion.next({ value: 7, unit: HRA });

      expect(component.valueControl.value).toEqual(7);
      expect(component.loadControl.value).toStrictEqual(toSo(10)); // reset to default
      expect(component['conversionUnit']).toEqual(HRA);
      expect(component['setValidators']).toBeCalled();
      done();
    });

    it('should NOT reset controls without unit change', () => {
      component.loadControl.setValue(toSo(5));
      activeConversion.next({ value: 4, unit: HV });

      expect(component.valueControl.value).toEqual(4);
      expect(component.loadControl.value).toStrictEqual(toSo(5));
      expect(component['conversionUnit']).toEqual(HV);
      expect(component['setValidators']).not.toBeCalled();
    });
  });

  describe('should react to changes of input control', () => {
    beforeEach(() => {
      // resulting in only 'value' (20 - 90) and 'diameter' (3-19) will be active
      component['reset']();
      activeConversion.next({ value: 21, unit: HRA });
      hardnessService.getIndentation.mockClear();
    });
    it('should call hardness service for indentation values', (done) => {
      // diameter is only valid for 3-19
      component.diameterControl.setValue(5);
      expect(hardnessService.getIndentation).toBeCalledWith(
        {
          value: 21,
          diameter: 5,
          thickness: 0,
          material: undefined,
          load: undefined,
        },
        HRA
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
      component.diameterBallControl.setValue({ diameter: 17, load: 2 });
      expect(hardnessService.getIndentation).toBeCalledWith(
        { value: 23, diameter: 17, load: 2, material: undefined, thickness: 0 },
        HB
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

    it('should not call hardness service for indentation values on invalid input', () => {
      // diameter is only valid for 3-19
      component.diameterControl.setValue(2);
      expect(hardnessService.getIndentation).not.toBeCalled();
    });
    it('should not call hardness service for indentation values if geoinformation is disabled', () => {
      component.enabledControl.setValue(false);
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
      const item: IndentationConfigColumn = {
        name: 'width',
        format: '1.3',
        unit: 'kw',
      };
      const response = {
        width: 12.1234,
      } as IndentationResponse;

      expect(component.get(response, item)).toEqual('12.123');
    });

    it('should return "-" for null values', () => {
      const item: IndentationConfigColumn = {
        name: 'width',
        format: '1.3',
        unit: 'kw',
      };
      const response = {
        width: undefined,
      } as IndentationResponse;

      expect(component.get(response, item)).toEqual('-');
    });
  });

  describe('getKeys', () => {
    beforeEach(() => {
      component['conversionUnit'] = HV;
    });
    it('should return geo keys', () => {
      expect(component.getGeoKeys()).toEqual(INDENTATION_CONFIG[HV].geometry);
    });
    it('should return corrected keys', () => {
      expect(component.getCorrectedKeys()).toEqual(
        INDENTATION_CONFIG[HV].correction
      );
    });

    it('should return that corrected keys exist', () => {
      expect(component.hasCorrectedKeys()).toBeTruthy();
    });
    it('should return other keys', () => {
      expect(component.getOther()).toStrictEqual(INDENTATION_CONFIG[HV].other);
    });
    it('should return that other keys exist', () => {
      expect(component.hasOther()).toBeTruthy();
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
});
