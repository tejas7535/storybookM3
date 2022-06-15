import { FormControl, Validators } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MATERIAL_SANITY_CHECKS } from '@angular/material/core';
import { MatIconModule } from '@angular/material/icon';
import { RouterTestingModule } from '@angular/router/testing';

import { createComponentFactory, Spectator } from '@ngneat/spectator';
import { translate } from '@ngneat/transloco';
import { PushModule } from '@ngrx/component';
import { MockStore, provideMockStore } from '@ngrx/store/testing';
import { MockModule } from 'ng-mocks';

import { BreadcrumbsModule } from '@schaeffler/breadcrumbs';
import { SubheaderModule } from '@schaeffler/subheader';
import { provideTranslocoTestingModule } from '@schaeffler/transloco/testing';

import { AppRoutePath } from '../app-route-path.enum';
import { initialState } from '../core/store/reducers/parameter/parameter.reducer';
import { GreaseCalculationPath } from '../grease-calculation/grease-calculation-path.enum';
import { EnvironmentImpact, LoadLevels } from '../shared/models';
import { SharedModule } from '../shared/shared.module';
import { patchParameters } from './../core/store/actions/parameters/parameters.actions';
import { Movement } from './../shared/models/parameters/movement.model';
import {
  loadRatioOptions,
  loadValidators,
  rotationalSpeedValidators,
  shiftAngleValidators,
  shiftFrequencyValidators,
} from './parameter-constants';
import { ParametersComponent } from './parameters.component';

describe('ParametersComponent', () => {
  let component: ParametersComponent;
  let spectator: Spectator<ParametersComponent>;
  let store: MockStore;

  const createComponent = createComponentFactory({
    component: ParametersComponent,
    imports: [
      RouterTestingModule,
      SharedModule,
      PushModule,
      provideTranslocoTestingModule({ en: {} }),

      // UI Modules
      SubheaderModule,
      BreadcrumbsModule,

      // Material Modules
      MockModule(MatButtonModule),
      MockModule(MatIconModule),
    ],
    providers: [
      provideMockStore({
        initialState: {
          bearing: {
            loading: false,
            result: undefined,
            selectedBearing: 'selected bearing',
          },
          parameter: {
            ...initialState,
          },
        },
      }),
      {
        provide: translate,
        useValue: jest.fn(),
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

    store = spectator.inject(MockStore);
    store.dispatch = jest.fn();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  describe('ngOnInit', () => {
    it('should get selectedBearing from store', (done) => {
      component.selectedBearing$.subscribe((bearing: string) => {
        expect(bearing).toEqual('selected bearing');
        done();
      });

      component.ngOnInit();
    });

    it('should dispatch with valid false on invalid form change', (done) => {
      component.radial.patchValue(500);

      setTimeout(() => {
        expect(store.dispatch).toHaveBeenCalledWith(
          patchParameters({
            parameters: {
              environment: {
                environmentImpact: EnvironmentImpact.moderate,
                environmentTemperature: 20,
                operatingTemperature: 70,
              },
              loads: {
                axial: undefined,
                radial: 500,
                exact: false,
                loadRatio: undefined,
              },
              movements: {
                type: Movement.rotating,
                rotationalSpeed: undefined,
                shiftFrequency: undefined,
                shiftAngle: undefined,
              },
              valid: false,
            },
          })
        );
        done();
      }, component.DEBOUNCE_TIME_DEFAULT + 100);
    });

    it('should dispatch with valid on valid form change', (done) => {
      component.rotationalSpeed.patchValue(1);
      component.loadRatio.patchValue(loadRatioOptions[0].id);

      setTimeout(() => {
        expect(store.dispatch).toHaveBeenCalledWith(
          patchParameters({
            parameters: {
              environment: {
                environmentImpact: EnvironmentImpact.moderate,
                environmentTemperature: 20,
                operatingTemperature: 70,
              },
              loads: {
                radial: undefined,
                axial: undefined,
                exact: false,
                loadRatio: LoadLevels.LB_VERY_LOW,
              },
              movements: {
                type: Movement.rotating,
                rotationalSpeed: 1,
                shiftFrequency: undefined,
                shiftAngle: undefined,
              },
              valid: true,
            },
          })
        );
        done();
      }, component.DEBOUNCE_TIME_DEFAULT + 100);
    });
  });

  describe('toggleMovementValidators', () => {
    it('should select movement type and set validators for rotational', () => {
      component.rotationalSpeed.addValidators = jest.fn();
      component.shiftFrequency.removeValidators = jest.fn();
      component.shiftAngle.removeValidators = jest.fn();
      component.rotationalSpeed.updateValueAndValidity = jest.fn();
      component.shiftFrequency.updateValueAndValidity = jest.fn();
      component.shiftAngle.updateValueAndValidity = jest.fn();

      component.toggleMovementValidators(Movement.rotating);

      expect(component.rotationalSpeed.addValidators).toHaveBeenCalledWith(
        rotationalSpeedValidators
      );
      expect(component.shiftFrequency.removeValidators).toHaveBeenCalledWith(
        shiftFrequencyValidators
      );
      expect(component.shiftAngle.removeValidators).toHaveBeenCalledWith(
        shiftAngleValidators
      );
      expect(
        component.rotationalSpeed.updateValueAndValidity
      ).toHaveBeenCalled();
      expect(
        component.shiftFrequency.updateValueAndValidity
      ).toHaveBeenCalled();
      expect(component.shiftAngle.updateValueAndValidity).toHaveBeenCalled();
    });

    it('should select movement type and set validators for oscillating', () => {
      component.rotationalSpeed.removeValidators = jest.fn();
      component.shiftFrequency.addValidators = jest.fn();
      component.shiftAngle.addValidators = jest.fn();
      component.rotationalSpeed.updateValueAndValidity = jest.fn();
      component.shiftFrequency.updateValueAndValidity = jest.fn();
      component.shiftAngle.updateValueAndValidity = jest.fn();

      component.toggleMovementValidators(Movement.oscillating);

      expect(component.rotationalSpeed.removeValidators).toHaveBeenCalledWith(
        rotationalSpeedValidators
      );
      expect(component.shiftFrequency.addValidators).toHaveBeenCalledWith(
        shiftFrequencyValidators
      );
      expect(component.shiftAngle.addValidators).toHaveBeenCalledWith(
        shiftAngleValidators
      );
      expect(
        component.rotationalSpeed.updateValueAndValidity
      ).toHaveBeenCalled();
      expect(
        component.shiftFrequency.updateValueAndValidity
      ).toHaveBeenCalled();
      expect(component.shiftAngle.updateValueAndValidity).toHaveBeenCalled();
    });
  });

  describe('toggleLoadValidators', () => {
    it('should select movement type and set validators for rotational', () => {
      component.axial.addValidators = jest.fn();
      component.radial.addValidators = jest.fn();
      component.loadRatio.removeValidators = jest.fn();
      component.axial.updateValueAndValidity = jest.fn();
      component.radial.updateValueAndValidity = jest.fn();
      component.loadRatio.updateValueAndValidity = jest.fn();

      component.toggleLoadValidators(true);

      expect(component.axial.addValidators).toHaveBeenCalledWith(
        loadValidators
      );
      expect(component.radial.addValidators).toHaveBeenCalledWith(
        loadValidators
      );
      expect(component.loadRatio.removeValidators).toHaveBeenCalledWith(
        Validators.required
      );

      expect(component.axial.updateValueAndValidity).toHaveBeenCalled();
      expect(component.radial.updateValueAndValidity).toHaveBeenCalled();
      expect(component.loadRatio.updateValueAndValidity).toHaveBeenCalled();
    });

    it('should select movement type and unset validators for rotational', () => {
      component.axial.removeValidators = jest.fn();
      component.radial.removeValidators = jest.fn();
      component.loadRatio.addValidators = jest.fn();
      component.axial.updateValueAndValidity = jest.fn();
      component.radial.updateValueAndValidity = jest.fn();
      component.loadRatio.updateValueAndValidity = jest.fn();

      component.toggleLoadValidators(false);

      expect(component.axial.removeValidators).toHaveBeenCalledWith(
        loadValidators
      );
      expect(component.radial.removeValidators).toHaveBeenCalledWith(
        loadValidators
      );
      expect(component.loadRatio.addValidators).toHaveBeenCalledWith(
        Validators.required
      );

      expect(component.axial.updateValueAndValidity).toHaveBeenCalled();
      expect(component.radial.updateValueAndValidity).toHaveBeenCalled();
      expect(component.loadRatio.updateValueAndValidity).toHaveBeenCalled();
    });
  });

  describe('toggleLoadsType', () => {
    it('should call the patchValue method of the "exact" formControl', () => {
      const patchValueSpy = jest.spyOn(component.exact, 'patchValue');
      component.exact.patchValue(true);

      component.toggleLoadsType();

      expect(patchValueSpy).toBeCalledWith(false);
    });
  });

  describe('ngOnDestroy', () => {
    it('should call the destroy methods', () => {
      component['destroy$'].next = jest.fn();
      component['destroy$'].complete = jest.fn();

      component.ngOnDestroy();

      expect(component['destroy$'].next).toHaveBeenCalled();
      expect(component['destroy$'].complete).toHaveBeenCalled();
    });
  });

  describe('complete Step', () => {
    it('should dispatch completeStep action', () => {
      component['router'].navigate = jest.fn();

      component.completeStep();

      expect(component['router'].navigate).toHaveBeenCalledWith([
        `${AppRoutePath.GreaseCalculationPath}/${GreaseCalculationPath.ResultPath}`,
      ]);
    });
  });

  describe('navigateBack', () => {
    it('should navigate to bearing selection', () => {
      component['router'].navigate = jest.fn();

      component.navigateBack();

      expect(component['router'].navigate).toHaveBeenCalledWith([
        `${AppRoutePath.GreaseCalculationPath}/${GreaseCalculationPath.BearingPath}`,
      ]);
    });
  });

  describe('resetForm', () => {
    it('should reset the form with initialState', () => {
      component.form.reset = jest.fn();

      component.resetForm();

      expect(component.form.reset).toHaveBeenCalledWith(initialState);
    });
  });

  describe('operatingTemperatureValidator', () => {
    it('should return the error if operatingTemperature < environmentTemperature', () => {
      const mockControl = new FormControl(10);

      const result = component['operatingTemperatureValidator']()(mockControl);

      expect(result).toEqual({
        lowerThanEnvironmentTemperature: true,
      });
    });
    it('should return undefined if operatingTemperature < environmentTemperature', () => {
      const mockControl = new FormControl(70);

      const result = component['operatingTemperatureValidator']()(mockControl);

      expect(result).toEqual(undefined);
    });
  });

  describe('loadValidator', () => {
    it('should set the anyLoad error if both fields are 0', () => {
      component.exact.setValue(true);
      component.radial.setValue(0);
      component.axial.setValue(0);

      component['loadValidator']();

      expect(component.radial.errors).toEqual({
        anyLoad: true,
      });
      expect(component.axial.errors).toEqual({
        anyLoad: true,
      });
    });

    it('should unset the anyLoad error if one field is > 0', () => {
      component.radial.setValue(0);
      component.axial.setValue(1);

      component['loadValidator']();

      /* eslint-disable unicorn/no-null */
      expect(component.radial.errors).toEqual(null);
      expect(component.axial.errors).toEqual(null);
      /* eslint-enable unicorn/no-null */
    });
  });
});
