import { FormControl, Validators } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MATERIAL_SANITY_CHECKS } from '@angular/material/core';
import { RouterTestingModule } from '@angular/router/testing';

import { createComponentFactory, Spectator } from '@ngneat/spectator';
import { translate } from '@ngneat/transloco';
import { ReactiveComponentModule } from '@ngrx/component';
import { MockStore, provideMockStore } from '@ngrx/store/testing';

import { BreadcrumbsModule } from '@schaeffler/breadcrumbs';
import { SubheaderModule } from '@schaeffler/subheader';
import { provideTranslocoTestingModule } from '@schaeffler/transloco';

import { AppRoutePath } from '../app-route-path.enum';
import { initialState } from '../core/store/reducers/parameter/parameter.reducer';
import { GreaseCalculationPath } from '../grease-calculation/grease-calculation-path.enum';
import { SharedModule } from '../shared/shared.module';
import { patchParameters } from './../core/store/actions/parameters/parameters.actions';
import { Movement } from './../shared/models/parameters/movement.model';
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
      ReactiveComponentModule,
      provideTranslocoTestingModule({ en: {} }),

      // UI Modules
      SubheaderModule,
      BreadcrumbsModule,

      // Material Modules
      MatButtonModule,
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

    it('should dispatch with valid false on invalid form change', () => {
      component.radial.patchValue(500);

      expect(store.dispatch).toHaveBeenCalledWith(
        patchParameters({
          parameters: {
            environment: {
              environmentImpact: 0.8,
              environmentTemperature: 20,
              operatingTemperature: 70,
            },
            loads: {
              axial: 0,
              radial: 500,
              exact: true,
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
    });

    it('should dispatch with valid on valid form change', () => {
      component.rotationalSpeed.patchValue(1);

      expect(store.dispatch).toHaveBeenCalledWith(
        patchParameters({
          parameters: {
            environment: {
              environmentImpact: 0.8,
              environmentTemperature: 20,
              operatingTemperature: 70,
            },
            loads: {
              radial: 0,
              axial: 0,
              exact: true,
              loadRatio: undefined,
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
    });

    it('should select movement type and set validators for rotational', () => {
      component.rotationalSpeed.addValidators = jest.fn();
      component.shiftFrequency.removeValidators = jest.fn();
      component.shiftAngle.removeValidators = jest.fn();
      component.rotationalSpeed.updateValueAndValidity = jest.fn();
      component.shiftFrequency.updateValueAndValidity = jest.fn();
      component.shiftAngle.updateValueAndValidity = jest.fn();

      component.ngOnInit();

      expect(component.rotationalSpeed.addValidators).toHaveBeenCalledWith([
        // eslint-disable-next-line jest/unbound-method
        Validators.required,
      ]);
      expect(component.shiftFrequency.removeValidators).toHaveBeenCalledWith([
        // eslint-disable-next-line jest/unbound-method
        Validators.required,
      ]);
      expect(component.shiftAngle.removeValidators).toHaveBeenCalledWith([
        // eslint-disable-next-line jest/unbound-method
        Validators.required,
      ]);
      expect(
        component.rotationalSpeed.updateValueAndValidity
      ).toHaveBeenCalled();
      expect(
        component.shiftFrequency.updateValueAndValidity
      ).toHaveBeenCalled();
      expect(component.shiftAngle.updateValueAndValidity).toHaveBeenCalled();
    });

    it('should select movement type and set validators for oscillating', () => {
      store.setState({
        bearing: {
          loading: false,
          result: undefined,
          selectedBearing: 'selected bearing',
        },
        parameter: {
          ...initialState,
          movements: {
            ...initialState.movements,
            type: Movement.oscillating,
          },
        },
      });

      component.rotationalSpeed.removeValidators = jest.fn();
      component.shiftFrequency.addValidators = jest.fn();
      component.shiftAngle.addValidators = jest.fn();
      component.rotationalSpeed.updateValueAndValidity = jest.fn();
      component.shiftFrequency.updateValueAndValidity = jest.fn();
      component.shiftAngle.updateValueAndValidity = jest.fn();

      component.ngOnInit();

      expect(component.rotationalSpeed.removeValidators).toHaveBeenCalledWith([
        // eslint-disable-next-line jest/unbound-method
        Validators.required,
      ]);
      expect(component.shiftFrequency.addValidators).toHaveBeenCalledWith([
        // eslint-disable-next-line jest/unbound-method
        Validators.required,
      ]);
      expect(component.shiftAngle.addValidators).toHaveBeenCalledWith([
        // eslint-disable-next-line jest/unbound-method
        Validators.required,
      ]);
      expect(
        component.rotationalSpeed.updateValueAndValidity
      ).toHaveBeenCalled();
      expect(
        component.shiftFrequency.updateValueAndValidity
      ).toHaveBeenCalled();
      expect(component.shiftAngle.updateValueAndValidity).toHaveBeenCalled();
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
});
