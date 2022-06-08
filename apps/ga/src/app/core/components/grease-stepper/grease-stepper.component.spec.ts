import { StepperSelectionEvent } from '@angular/cdk/stepper';
import { MATERIAL_SANITY_CHECKS } from '@angular/material/core';
import { MatIconModule } from '@angular/material/icon';
import { MatStepperModule } from '@angular/material/stepper';
import { RouterTestingModule } from '@angular/router/testing';

import { createComponentFactory, Spectator } from '@ngneat/spectator';
import { LetModule, PushModule } from '@ngrx/component';
import { MockStore, provideMockStore } from '@ngrx/store/testing';
import { MockModule } from 'ng-mocks';

import { StepperModule } from '@schaeffler/stepper';
import { provideTranslocoTestingModule } from '@schaeffler/transloco/testing';

import { AppRoutePath } from '../../../app-route-path.enum';
import { GreaseCalculationPath } from '../../../grease-calculation/grease-calculation-path.enum';
import { initialState } from './../../store/reducers/settings/settings.reducer';
import {
  getCurrentStep,
  getEnabledSteps,
} from './../../store/selectors/settings/settings.selector';
import { GreaseStepperComponent } from './grease-stepper.component';

describe('StepperComponent', () => {
  let component: GreaseStepperComponent;
  let spectator: Spectator<GreaseStepperComponent>;
  let store: MockStore;

  const createComponent = createComponentFactory({
    component: GreaseStepperComponent,
    imports: [
      provideTranslocoTestingModule({ en: {} }),
      MatStepperModule,
      StepperModule,
      MockModule(LetModule),
      MockModule(PushModule),
      MatIconModule,
      RouterTestingModule,
    ],
    providers: [
      provideMockStore({
        initialState: {
          settings: {
            ...initialState,
          },
        },
      }),
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
    it('should select stepper settings from store', () => {
      store.select = jest.fn();

      component.ngOnInit();

      expect(store.select).toHaveBeenCalledWith(getEnabledSteps);
      expect(store.select).toHaveBeenCalledWith(getCurrentStep);
    });
  });

  describe('selectStep', () => {
    it('should dispatch setCurrentStep', () => {
      component['router'].navigate = jest.fn();

      component.selectStep({ selectedIndex: 1 } as StepperSelectionEvent);

      expect(component['router'].navigate).toHaveBeenCalledWith([
        `${AppRoutePath.GreaseCalculationPath}/${GreaseCalculationPath.ParametersPath}`,
      ]);
    });
  });
});
