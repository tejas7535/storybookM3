import { StepperSelectionEvent } from '@angular/cdk/stepper';
import { MatStepperModule } from '@angular/material/stepper';
import { RouterTestingModule } from '@angular/router/testing';

import { createComponentFactory, Spectator } from '@ngneat/spectator';
import { LetModule, PushModule } from '@ngrx/component';
import { MockStore, provideMockStore } from '@ngrx/store/testing';
import { MockModule } from 'ng-mocks';

import { StepperModule } from '@schaeffler/stepper';
import { provideTranslocoTestingModule } from '@schaeffler/transloco/testing';

import { AppRoutePath } from '@ga/app-route-path.enum';
import { initialState } from '@ga/core/store/reducers/settings/settings.reducer';
import { GreaseCalculationPath } from '@ga/grease-calculation/grease-calculation-path.enum';

import { GreaseStepperComponent } from './grease-stepper.component';

describe('StepperComponent', () => {
  let component: GreaseStepperComponent;
  let spectator: Spectator<GreaseStepperComponent>;
  let store: MockStore;

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

    store.dispatch = jest.fn();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
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
