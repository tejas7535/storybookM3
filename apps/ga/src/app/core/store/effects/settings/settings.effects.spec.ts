import { Router } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';

import { marbles } from 'rxjs-marbles';

import { createServiceFactory, SpectatorService } from '@ngneat/spectator';
import { Actions } from '@ngrx/effects';
import { provideMockActions } from '@ngrx/effects/testing';
import { ROUTER_NAVIGATED } from '@ngrx/router-store';
import { MockStore, provideMockStore } from '@ngrx/store/testing';

import { AppRoutePath } from '../../../../app-route-path.enum';
import { initialState } from '../../reducers/settings/settings.reducer';
import { getSelectedBearing } from '../../selectors';
import { getStepperState } from '../../selectors/settings/settings.selector';
import { Step } from './../../../../shared/models/settings/step.model';
import {
  completeStep,
  previousStep,
  setCurrentStep,
  setStepper,
  updateStep,
} from './../../actions/settings/settings.action';
import { SettingsEffects } from './settings.effects';

const getStep = (index: number, steps: Step[]): Step =>
  steps.find((step) => step.index === index);

const getOtherSteps = (index: number, steps: Step[]): Step[] =>
  steps.filter((step) => step.index !== index);

describe('Settings Effects', () => {
  let action: any;
  let actions$: any;
  let effects: SettingsEffects;
  let spectator: SpectatorService<SettingsEffects>;
  let store: MockStore;
  let router: Router;

  let initialSteps: Step[];

  const createService = createServiceFactory({
    service: SettingsEffects,
    imports: [RouterTestingModule],
    providers: [
      provideMockActions(() => actions$),
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
    spectator = createService();
    actions$ = spectator.inject(Actions);
    effects = spectator.inject(SettingsEffects);
    store = spectator.inject(MockStore);
    router = spectator.inject(Router);

    initialSteps = initialState.stepper.steps;
    router.navigate = jest.fn();
  });

  describe('updateStep$', () => {
    it(
      'should update the steps accordingly',
      marbles((m) => {
        action = updateStep({ step: { index: 0, completed: true } });

        actions$ = m.hot('-a', { a: action });

        const expectedSteps = [
          ...getOtherSteps(0, initialSteps),
          {
            ...getStep(0, initialSteps),
            completed: true,
          },
        ].sort((a, b) => a.index - b.index);

        const result = setStepper({
          ...initialState.stepper,
          steps: [...expectedSteps],
        });
        const expected = m.cold('-b', { b: result });

        m.expect(effects.updateStep$).toBeObservable(expected);
        m.flush();
      })
    );
  });

  describe('completeStep$', () => {
    beforeEach(() => {
      action = completeStep();
    });
    it(
      'should return setStepper action without changes on last step',
      marbles((m) => {
        store.overrideSelector(getStepperState, {
          ...initialState.stepper,
          nextStep: undefined,
        });

        actions$ = m.hot('-a', { a: action });

        const result = setStepper({
          ...initialState.stepper,
          nextStep: undefined,
        });
        const expected = m.cold('-b', { b: result });

        m.expect(effects.completeStep$).toBeObservable(expected);
        m.flush();
      })
    );

    it(
      'should return setStepper action',
      marbles((m) => {
        actions$ = m.hot('-a', { a: action });

        const newFirst: Step = {
          ...getStep(0, initialSteps),
          completed: true,
        };

        const newSecond: Step = {
          ...getStep(1, initialSteps),
          enabled: true,
          editable: true,
        };

        const expectedSteps: Step[] = [
          newFirst,
          newSecond,
          getStep(2, initialSteps),
        ];

        const result = setStepper({
          steps: expectedSteps,
          currentStep: 1,
          previousStep: 0,
          nextStep: 2,
        });
        const expected = m.cold('-b', { b: result });

        m.expect(effects.completeStep$).toBeObservable(expected);
        m.flush();
      })
    );
    it(
      'should return setStepper action with no new next step',
      marbles((m) => {
        store.overrideSelector(getStepperState, {
          ...initialState.stepper,
          previousStep: 0,
          currentStep: 1,
          nextStep: 2,
        });
        actions$ = m.hot('-a', { a: action });

        const newSecond: Step = {
          ...getStep(1, initialSteps),
          completed: true,
        };

        const newThird: Step = {
          ...getStep(2, initialSteps),
          enabled: true,
          editable: true,
        };

        const expectedSteps: Step[] = [
          getStep(0, initialSteps),
          newSecond,
          newThird,
        ];

        const result = setStepper({
          steps: expectedSteps,
          currentStep: 2,
          previousStep: 1,
          nextStep: undefined,
        });
        const expected = m.cold('-b', { b: result });

        m.expect(effects.completeStep$).toBeObservable(expected);
        m.flush();
      })
    );
  });

  describe('setCurrentStep$', () => {
    it(
      'should return setStepper and navigate on setCurrentStep with no previous step',
      marbles((m) => {
        store.overrideSelector(getSelectedBearing, 'theBearing');
        action = setCurrentStep({ step: 0 });

        actions$ = m.hot('-a', { a: action });

        const result = setStepper({
          ...initialState.stepper,
          currentStep: 0,
          nextStep: 1,
          previousStep: undefined,
        });
        const expected = m.cold('-b', { b: result });

        m.expect(effects.setCurrentStep$).toBeObservable(expected);
        m.flush();
      })
    );
    it(
      'should return setStepper and navigate on setCurrentStep with no next step',
      marbles((m) => {
        store.overrideSelector(getSelectedBearing, 'theBearing');
        action = setCurrentStep({ step: 2 });

        actions$ = m.hot('-a', { a: action });

        const result = setStepper({
          ...initialState.stepper,
          currentStep: 2,
          nextStep: undefined,
          previousStep: 1,
        });
        const expected = m.cold('-b', { b: result });

        m.expect(effects.setCurrentStep$).toBeObservable(expected);
        m.flush();
      })
    );
  });

  describe('previousStep$', () => {
    it(
      'should return setStepper and navigate on previousStep',
      marbles((m) => {
        store.overrideSelector(getStepperState, {
          ...initialState.stepper,
          previousStep: 1,
          currentStep: 2,
          nextStep: undefined,
        });
        action = previousStep();
        actions$ = m.cold('-a', { a: action });

        const result = setStepper({
          ...initialState.stepper,
          previousStep: 0,
          currentStep: 1,
          nextStep: 2,
        });
        const expected = m.cold('-b', { b: result });

        m.expect(effects.previousStep$).toBeObservable(expected);
        m.flush();

        expect(router.navigate).toHaveBeenCalledWith(
          [AppRoutePath.GreaseCalculationPath, getStep(1, initialSteps).link],
          {
            queryParamsHandling: 'merge',
          }
        );
      })
    );
    it(
      'should return setStepper and navigate on previousStep with no new previous step',
      marbles((m) => {
        store.overrideSelector(getStepperState, {
          ...initialState.stepper,
          previousStep: 0,
          currentStep: 1,
          nextStep: 2,
        });
        action = previousStep();
        actions$ = m.cold('-a', { a: action });

        const result = setStepper({
          ...initialState.stepper,
        });
        const expected = m.cold('-b', { b: result });

        m.expect(effects.previousStep$).toBeObservable(expected);
        m.flush();

        expect(router.navigate).toHaveBeenCalledWith(
          [AppRoutePath.GreaseCalculationPath, getStep(0, initialSteps).link],
          {
            queryParamsHandling: 'merge',
          }
        );
      })
    );
  });

  describe('router$', () => {
    it(
      'should return setCurrentStep with 0 on greaseCalculation bearing route',
      marbles((m) => {
        action = {
          type: ROUTER_NAVIGATED,
          payload: { routerState: { url: 'greaseCalculation/bearing' } },
        };
        actions$ = m.hot('-a', {
          a: action,
        });

        const result = setCurrentStep({ step: 0 });
        const expected = m.cold('-(b|)', { b: result });

        m.expect(effects.router$).toBeObservable(expected);
        m.flush();
      })
    );
    it(
      'should return setCurrentStep with 1 on greaseCalculation parameters route',
      marbles((m) => {
        action = {
          type: ROUTER_NAVIGATED,
          payload: {
            routerState: { url: 'greaseCalculation/parameters?bearing=b1' },
          },
        };
        actions$ = m.hot('-a', {
          a: action,
        });

        const result = setCurrentStep({ step: 1 });
        const expected = m.cold('-(b|)', { b: result });

        m.expect(effects.router$).toBeObservable(expected);
        m.flush();
      })
    );
  });

  describe('getNewSteps', () => {
    it('should return new steps array', () => {
      const expected = [
        ...getOtherSteps(1, initialSteps),
        {
          ...getStep(1, initialSteps),
          completed: true,
        },
      ].sort((a, b) => a.index - b.index);

      const result = effects['getNewSteps'](initialSteps, {
        index: 1,
        completed: true,
      });

      expect(result).toEqual(expected);
    });
  });
});
