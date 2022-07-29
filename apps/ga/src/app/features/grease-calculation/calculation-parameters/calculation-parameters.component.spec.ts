import { Validators } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatExpansionModule } from '@angular/material/expansion';
import { MatIconModule } from '@angular/material/icon';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { RouterTestingModule } from '@angular/router/testing';

import { createComponentFactory, Spectator } from '@ngneat/spectator';
import { translate } from '@ngneat/transloco';
import { PushModule } from '@ngrx/component';
import { MockStore, provideMockStore } from '@ngrx/store/testing';
import { MockModule } from 'ng-mocks';

import { BreadcrumbsModule } from '@schaeffler/breadcrumbs';
import { MaintenanceModule } from '@schaeffler/empty-states';
import { provideTranslocoTestingModule } from '@schaeffler/transloco/testing';

import { AppRoutePath } from '@ga/app-route-path.enum';
import {
  patchParameters,
  resetPreferredGreaseSelection,
} from '@ga/core/store/actions';
import { CalculationParametersState } from '@ga/core/store/models';
import { initialState } from '@ga/core/store/reducers/calculation-parameters/calculation-parameters.reducer';
import { PreferredGreaseSelectionComponent } from '@ga/shared/components/preferred-grease-selection';
import { EnvironmentImpact, LoadLevels, Movement } from '@ga/shared/models';
import {
  BEARING_SELECTION_STATE_MOCK,
  CALCULATION_PARAMETERS_STATE_MOCK,
  PREFERRED_GREASE_MOCK,
  PROPERTIES_MOCK,
  SETTINGS_STATE_MOCK,
} from '@ga/testing/mocks';

import { GreaseCalculationPath } from '../grease-calculation-path.enum';
import { CalculationParametersComponent } from './calculation-parameters.component';
import {
  loadRatioOptions,
  loadValidators,
  rotationalSpeedValidators,
  shiftAngleValidators,
  shiftFrequencyValidators,
} from './constants';
import { CalculationParametersService } from './services';

describe('CalculationParametersComponent', () => {
  let component: CalculationParametersComponent;
  let spectator: Spectator<CalculationParametersComponent>;
  let store: MockStore;

  const createComponent = createComponentFactory({
    component: CalculationParametersComponent,
    imports: [
      RouterTestingModule,
      PushModule,
      provideTranslocoTestingModule({ en: {} }),

      // UI
      BreadcrumbsModule,
      PreferredGreaseSelectionComponent,
      MockModule(MaintenanceModule),

      // Material Modules
      MockModule(MatButtonModule),
      MockModule(MatExpansionModule),
      MockModule(MatIconModule),
      MockModule(MatProgressSpinnerModule),
      MockModule(MatSlideToggleModule),
    ],
    providers: [
      provideMockStore({
        initialState: {
          settings: SETTINGS_STATE_MOCK,
          bearingSelection: {
            ...BEARING_SELECTION_STATE_MOCK,
            selectedBearing: 'selected bearing',
          },
          calculationParameters: {
            ...CALCULATION_PARAMETERS_STATE_MOCK,
            preferredGrease: PREFERRED_GREASE_MOCK,
            properties: PROPERTIES_MOCK,
          },
        },
      }),
      CalculationParametersService,
      {
        provide: translate,
        useValue: jest.fn(),
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
            } as CalculationParametersState,
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
            } as CalculationParametersState,
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

      component.toggleLoadsType({
        source: undefined,
        checked: false,
      });

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

  describe('onResetButtonClick', () => {
    it('should reset the form with initialState', () => {
      component.form.reset = jest.fn();

      component.onResetButtonClick();

      expect(component.form.reset).toHaveBeenCalledWith(initialState);
      expect(store.dispatch).toHaveBeenCalledWith(
        resetPreferredGreaseSelection()
      );
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
