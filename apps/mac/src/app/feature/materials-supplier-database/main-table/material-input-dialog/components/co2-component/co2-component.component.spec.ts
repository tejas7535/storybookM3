import { CommonModule } from '@angular/common';
import {
  FormArray,
  FormControl,
  ReactiveFormsModule,
  ValidatorFn,
  Validators,
} from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatTooltipModule } from '@angular/material/tooltip';

import { of } from 'rxjs';

import { createComponentFactory, Spectator } from '@ngneat/spectator/jest';
import { PushPipe } from '@ngrx/component';
import { provideMockActions } from '@ngrx/effects/testing';
import { MockStore, provideMockStore } from '@ngrx/store/testing';

import { StringOption } from '@schaeffler/inputs';
import { SelectModule } from '@schaeffler/inputs/select';
import { provideTranslocoTestingModule } from '@schaeffler/transloco/testing';

import { initialState as initialDataState } from '@mac/msd/store/reducers/data/data.reducer';
import { initialState as initialDialogState } from '@mac/msd/store/reducers/dialog/dialog.reducer';

import * as en from '../../../../../../../assets/i18n/en.json';
import { Co2ComponentComponent } from './co2-component.component';

const initialState = {
  msd: {
    data: {
      ...initialDataState,
    },
    dialog: {
      ...initialDialogState,
      dialogOptions: {
        ...initialDialogState.dialogOptions,
        ratingsLoading: false,
        co2Classifications: [] as StringOption[],
      },
    },
  },
};

describe('Co2ComponentComponent', () => {
  let component: Co2ComponentComponent;
  let spectator: Spectator<Co2ComponentComponent>;
  let store: MockStore;
  const co2Scope1Control = new FormControl<number>(undefined);
  const co2Scope2Control = new FormControl<number>(undefined);
  const co2Scope3Control = new FormControl<number>(undefined);
  const co2TotalControl = new FormControl<number>(undefined);
  const co2ClassificationControl = new FormControl<StringOption>(undefined);
  const releaseRestrictionsControl = new FormControl<string>(undefined);

  const createComponent = createComponentFactory({
    component: Co2ComponentComponent,
    // required so we can set the inputs
    detectChanges: false,
    imports: [
      CommonModule,
      MatButtonModule,
      MatFormFieldModule,
      MatIconModule,
      PushPipe,
      ReactiveFormsModule,
      MatTooltipModule,
      SelectModule,
      MatInputModule,
      provideTranslocoTestingModule({ en }),
    ],
    providers: [
      provideMockStore({ initialState }),
      provideMockActions(() => of()),
    ],
    declarations: [Co2ComponentComponent],
  });

  beforeEach(() => {
    spectator = createComponent();
    spectator.setInput({
      co2Scope1Control,
      co2Scope2Control,
      co2Scope3Control,
      co2TotalControl,
      co2ClassificationControl,
      releaseRestrictionsControl,
    });
    // run ngOnInit
    spectator.detectChanges();

    component = spectator.debugElement.componentInstance;
    store = spectator.inject(MockStore);
    store.dispatch = jest.fn();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  describe('modify co2 scope', () => {
    afterEach(() => {
      co2Scope1Control.reset();
      co2Scope2Control.reset();
      co2Scope3Control.reset();
      co2TotalControl.reset();
      co2ClassificationControl.reset();
    });
    it('base state', () => {
      expect(component.co2TotalControl.valid).toBeTruthy();
      expect(
        component.co2TotalControl.hasValidator(Validators.required)
      ).toBeFalsy();
    });
    it('should add validator with scope1', () => {
      component.co2Scope1Control.patchValue(7);
      expect(component.co2TotalControl.valid).toBeFalsy();
      expect(
        component.co2TotalControl.hasValidator(Validators.required)
      ).toBeTruthy();
    });
    it('should add validator with scope2', () => {
      component.co2Scope2Control.patchValue(7);
      expect(component.co2TotalControl.valid).toBeFalsy();
      expect(
        component.co2TotalControl.hasValidator(Validators.required)
      ).toBeTruthy();
    });

    it('should add validator with scope3', () => {
      component.co2Scope3Control.patchValue(7);
      expect(component.co2TotalControl.valid).toBeFalsy();
      expect(
        component.co2TotalControl.hasValidator(Validators.required)
      ).toBeTruthy();
    });
    it('should add validator with all scopes set', () => {
      component.co2Scope1Control.patchValue(7);
      component.co2Scope2Control.patchValue(7);
      component.co2Scope3Control.patchValue(7);
      expect(component.co2TotalControl.valid).toBeFalsy();
      expect(
        component.co2TotalControl.hasValidator(Validators.required)
      ).toBeTruthy();
    });
    it('should reset validator with scopes unset', () => {
      component.co2Scope1Control.patchValue(7);
      component.co2Scope2Control.patchValue(7);
      component.co2Scope3Control.patchValue(7);

      component.co2Scope1Control.reset();
      component.co2Scope2Control.reset();
      component.co2Scope3Control.reset();

      expect(
        component.co2TotalControl.hasValidator(Validators.required)
      ).toBeFalsy();
      expect(component.co2TotalControl.valid).toBeTruthy();
    });
  });
  describe('Use preset validator', () => {
    beforeAll(() => {
      co2TotalControl.addValidators(Validators.required);
    });
    afterEach(() => {
      co2Scope1Control.reset();
      co2Scope2Control.reset();
      co2Scope3Control.reset();
      co2TotalControl.reset();
      co2ClassificationControl.reset();
      co2TotalControl.removeValidators(Validators.required);
    });
    it('should not remove validator with scopes unset', () => {
      component.co2Scope1Control.patchValue(7);
      component.co2Scope2Control.patchValue(7);
      component.co2Scope3Control.patchValue(7);

      component.co2Scope1Control.reset();
      component.co2Scope2Control.reset();
      component.co2Scope3Control.reset();

      expect(
        component.co2TotalControl.hasValidator(Validators.required)
      ).toBeTruthy();
      expect(component.co2TotalControl.valid).toBeFalsy();
    });
  });

  describe('modify co2TotalControl', () => {
    beforeEach(() => {
      co2TotalControl.reset();
      co2ClassificationControl.reset();

      component.co2ClassificationControl.enable = jest.fn();
      component.co2ClassificationControl.disable = jest.fn();
    });
    it('co2Classification should be enabled when co2Total has a value', () => {
      component.co2TotalControl.setValue(1);

      expect(component.co2ClassificationControl.disable).not.toHaveBeenCalled();
      expect(component.co2ClassificationControl.enable).toHaveBeenCalled();
    });
    it('co2Classification should be disabled when co2Total has no value', () => {
      component.co2TotalControl.setValue(1, { emitEvent: false });
      component.co2TotalControl.reset();

      expect(component.co2ClassificationControl.disable).toHaveBeenCalledTimes(
        1
      );
      expect(component.co2ClassificationControl.enable).not.toHaveBeenCalled();
    });
  });

  describe('scopeTotalValidatorFn', () => {
    const mockScope1 = new FormControl<number>(undefined);
    const mockScope2 = new FormControl<number>(undefined);
    const mockScope3 = new FormControl<number>(undefined);
    const testControl = new FormControl<number>(undefined);
    const rand = (max: number) => (Math.random() * 1000) % max;
    let validator: ValidatorFn;
    beforeEach(() => {
      validator = component['scopeTotalValidatorFn'](
        new FormArray([mockScope1, mockScope2, mockScope3])
      );
      mockScope1.reset();
      mockScope2.reset();
      mockScope3.reset();
      testControl.reset();
    });
    it('should return undefined without value', () => {
      expect(validator(testControl)).toBe(undefined);
    });

    it('should return undefined with valid total value - empty scopes', () => {
      const val = rand(99);
      testControl.setValue(val);
      expect(validator(testControl)).toBe(undefined);
    });

    it('should return undefined with valid total value - scope 1', () => {
      const val = rand(99);
      mockScope1.setValue(val);
      testControl.setValue(val);
      expect(validator(testControl)).toBe(undefined);
    });
    it('should return undefined with valid total value - scope 2', () => {
      const val = rand(99);
      mockScope2.setValue(val);
      testControl.setValue(val);
      expect(validator(testControl)).toBe(undefined);
    });
    it('should return undefined with valid total value - scope 1+2', () => {
      const val1 = rand(99);
      const val2 = rand(99);
      mockScope1.setValue(val1);
      mockScope2.setValue(val2);
      testControl.setValue(val1 + val2);
      expect(validator(testControl)).toBe(undefined);
    });

    it('should return error with invalid total value - scope 1', () => {
      const current = rand(99);
      const scope = current + 7;
      mockScope1.setValue(scope);
      testControl.setValue(current);
      expect(validator(testControl)).toEqual({
        scopeTotalLowerThanSingleScopes: { min: scope, current },
      });
    });
    it('should return error with invalid total value - scope 2', () => {
      const current = rand(99);
      const scope = current + 7;
      mockScope2.setValue(scope);
      testControl.setValue(current);
      expect(validator(testControl)).toEqual({
        scopeTotalLowerThanSingleScopes: { min: scope, current },
      });
    });
    it('should return error with invalid total value - scope 1+2', () => {
      const current = rand(99);
      const scope1 = current;
      const scope2 = current;
      mockScope1.setValue(scope1);
      mockScope2.setValue(scope2);
      testControl.setValue(current);
      expect(validator(testControl)).toEqual({
        scopeTotalLowerThanSingleScopes: { min: scope1 + scope2, current },
      });
    });
    it('should return error with to high total value', () => {
      const scope1 = 1;
      const scope2 = 2;
      const scope3 = 3;
      const current = scope1 + scope2 + scope3 + 1;
      mockScope1.setValue(scope1);
      mockScope2.setValue(scope2);
      mockScope3.setValue(scope3);
      testControl.setValue(current);
      expect(validator(testControl)).toEqual({
        scopeTotalHigherThanSingleScopes: { max: current - 1, current },
      });
    });
  });
});
