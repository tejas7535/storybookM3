import { StepperSelectionEvent } from '@angular/cdk/stepper';
import { MATERIAL_SANITY_CHECKS } from '@angular/material/core';
import { MatIconModule } from '@angular/material/icon';
import { MatStepperModule } from '@angular/material/stepper';

import { createComponentFactory, Spectator } from '@ngneat/spectator';
import { ReactiveComponentModule } from '@ngrx/component';
import { MockStore, provideMockStore } from '@ngrx/store/testing';

import { StepperModule } from '@schaeffler/stepper';
import { provideTranslocoTestingModule } from '@schaeffler/transloco';

import { setCurrentStep } from '../../store/actions/settings/settings.actions';
import { initialState } from './../../store/reducers/settings/settings.reducer';
import {
  getCurrentStep,
  getSteps,
  hasNext,
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
      ReactiveComponentModule,
      MatIconModule,
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

      expect(store.select).toHaveBeenCalledWith(getSteps);
      expect(store.select).toHaveBeenCalledWith(hasNext);
      expect(store.select).toHaveBeenCalledWith(getCurrentStep);
    });
  });

  describe('selectStep', () => {
    it('should dispatch setCurrentStep', () => {
      component.selectStep({ selectedIndex: 1 } as StepperSelectionEvent);

      expect(store.dispatch).toHaveBeenCalledWith(setCurrentStep({ step: 1 }));
    });
  });
});
