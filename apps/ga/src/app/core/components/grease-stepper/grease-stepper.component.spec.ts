import { StepperSelectionEvent } from '@angular/cdk/stepper';
import { MatStepperModule } from '@angular/material/stepper';
import { Router } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';

import { of } from 'rxjs';

import { createComponentFactory, Spectator } from '@ngneat/spectator/jest';
import { LetModule, PushModule } from '@ngrx/component';
import { MockStore, provideMockStore } from '@ngrx/store/testing';
import { MockModule } from 'ng-mocks';

import { StepperModule } from '@schaeffler/stepper';
import { provideTranslocoTestingModule } from '@schaeffler/transloco/testing';

import { AppRoutePath } from '@ga/app-route-path.enum';
import { initialState } from '@ga/core/store/reducers/settings/settings.reducer';
import { GreaseCalculationPath } from '@ga/features/grease-calculation/grease-calculation-path.enum';
import { Step } from '@ga/shared/models';

import { GreaseStepperComponent } from './grease-stepper.component';

describe('StepperComponent', () => {
  let component: GreaseStepperComponent;
  let spectator: Spectator<GreaseStepperComponent>;
  let store: MockStore;
  let router: Router;

  const createComponent = createComponentFactory({
    component: GreaseStepperComponent,
    imports: [
      RouterTestingModule,
      provideTranslocoTestingModule({ en: {} }),
      MockModule(LetModule),
      MockModule(PushModule),
      MockModule(MatStepperModule),
      MockModule(StepperModule),
    ],
    providers: [
      provideMockStore({
        initialState: {
          settings: {
            ...initialState,
          },
        },
      }),
    ],
  });

  beforeEach(() => {
    spectator = createComponent();
    component = spectator.debugElement.componentInstance;
    store = spectator.inject(MockStore);
    router = spectator.inject(Router);
    store.dispatch = jest.fn();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  describe('selectStep', () => {
    it('should dispatch setCurrentStep', async () => {
      router.navigate = jest.fn();
      const validFirstStep: Step[] = [
        {
          name: 'Test 0',
          index: 0,
          link: `${GreaseCalculationPath.BearingPath}`,
          enabled: true,
        },
      ];

      component.steps$ = of(validFirstStep);

      await component.selectStep({ selectedIndex: 0 } as StepperSelectionEvent);

      expect(router.navigate).toHaveBeenCalledWith([
        `${AppRoutePath.GreaseCalculationPath}/${GreaseCalculationPath.BearingPath}`,
      ]);
    });

    it('should not skip ahead with missing information', () => {
      router.navigate = jest.fn();

      component.selectStep({ selectedIndex: 1 } as StepperSelectionEvent);
      expect(router.navigate).not.toHaveBeenCalled();
    });

    it('should proceed when the information is provided', async () => {
      const steps: Step[] = [
        {
          name: 'bearingSelection',
          index: 0,
          link: `${GreaseCalculationPath.BearingPath}`,
          complete: true,
          enabled: false,
        },
        {
          name: 'parameters',
          index: 1,
          link: `${GreaseCalculationPath.ParametersPath}`,
          enabled: true,
          complete: false,
        },
        {
          name: 'report',
          index: 2,
          link: `${GreaseCalculationPath.ResultPath}`,
        },
      ];

      router.navigate = jest.fn();
      component.steps$ = of(steps);

      await component.selectStep({ selectedIndex: 1 } as StepperSelectionEvent);

      expect(router.navigate).toHaveBeenCalledWith([
        `${AppRoutePath.GreaseCalculationPath}/${GreaseCalculationPath.ParametersPath}`,
      ]);
    });
  });
});
