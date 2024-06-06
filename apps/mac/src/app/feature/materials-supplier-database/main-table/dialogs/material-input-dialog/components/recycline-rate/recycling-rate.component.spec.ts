import {
  FormControl,
  ReactiveFormsModule,
  ValidationErrors,
} from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';

import { createComponentFactory, Spectator } from '@ngneat/spectator/jest';
import { MockModule } from 'ng-mocks';

import { provideTranslocoTestingModule } from '@schaeffler/transloco/testing';

import * as en from '../../../../../../../../assets/i18n/en.json';
import { RecyclingRateComponent } from './recycling-rate.component';

describe('RecyclingRateComponent', () => {
  let component: RecyclingRateComponent;
  let spectator: Spectator<RecyclingRateComponent>;
  const minRecyclingRateControl = new FormControl<number>(undefined);
  const maxRecyclingRateControl = new FormControl<number>(undefined);

  const createComponent = createComponentFactory({
    component: RecyclingRateComponent,
    imports: [
      MockModule(ReactiveFormsModule),
      MockModule(MatFormFieldModule),
      provideTranslocoTestingModule({ en }),
    ],
    detectChanges: false,
  });

  beforeEach(async () => {
    spectator = createComponent();
    component = spectator.debugElement.componentInstance;
    spectator.setInput({
      minRecyclingRateControl,
      maxRecyclingRateControl,
      minRecyclingRateHint: 'minHint',
      maxRecyclingRateHint: 'maxHint',
    });
    // run ngOnInit
    spectator.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  describe('recyclingRate', () => {
    const min = minRecyclingRateControl;
    const max = maxRecyclingRateControl;
    afterEach(() => {
      min.reset();
      max.reset();
    });
    describe('recycleRateValidatorFn', () => {
      it('should be valid on empty fields', () => {
        expect(max.valid).toBeTruthy();
        expect(min.valid).toBeTruthy();
      });
      it('should be valid', () => {
        min.setValue(7);
        max.setValue(10);
        expect(max.valid).toBeTruthy();
        expect(min.valid).toBeTruthy();
      });
      it('should show error when above limit', () => {
        min.setValue(101);
        max.setValue(199);
        expect(max.valid).toBeFalsy();
        expect(min.valid).toBeFalsy();
      });
      it('should show error when below limit', () => {
        min.setValue(-7);
        max.setValue(-851);
        expect(max.valid).toBeFalsy();
        expect(min.valid).toBeFalsy();
      });

      it('should be invalid', () => {
        min.setValue(10);
        max.setValue(7);
        expect(min.valid).toBeTruthy();
        expect(max.valid).toBeFalsy();
        expect(max.errors).toStrictEqual({
          scopeTotalLowerThanSingleScopes: { min: 10, max: 7 },
        } as ValidationErrors);
      });
      it('should reset error', () => {
        min.setValue(90);
        max.setValue(75);
        min.setValue(31);

        expect(max.valid).toBeTruthy();
        expect(min.valid).toBeTruthy();
      });
      it('should stay invalid', () => {
        min.setValue(10);
        max.setValue(7);
        min.setValue(33);

        expect(max.valid).toBeFalsy();
        expect(max.errors).toStrictEqual({
          scopeTotalLowerThanSingleScopes: { min: 33, max: 7 },
        } as ValidationErrors);
      });

      it('should make controls required by setting min', () => {
        min.setValue(0);

        expect(min.valid).toBe(true);
        expect(max.valid).toBe(false);
        expect(max.errors).toStrictEqual({ dependency: true });
      });
      it('should make controls required by setting max', () => {
        max.setValue(0);

        expect(max.valid).toBe(true);
        expect(min.valid).toBe(false);
        expect(min.errors).toStrictEqual({ dependency: true });
      });
      it('should reset when both fields get reset', () => {
        min.setValue(12);
        max.setValue(78);

        min.reset();
        max.reset();

        expect(max.valid).toBe(true);
        expect(min.valid).toBe(true);
      });
    });
    describe('value changes', () => {
      beforeEach(() => {
        min.reset();
        max.reset();
      });
      it('should set default for max, if field is empty', () => {
        min.setValue(1);
        expect(max.value).toBe(100);
        expect(min.value).toBe(1);
      });
      it('should set default for min, if field is empty', () => {
        max.setValue(98);
        expect(max.value).toBe(98);
        expect(min.value).toBe(0);
      });
      it('should do nothing on reset', () => {
        max.setValue(77);
        min.setValue(55);
        max.reset();
        expect(max.value).toBeFalsy();
        expect(min.value).toBe(55);
      });
    });
  });
});
