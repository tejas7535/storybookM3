import { Injectable } from '@angular/core';
import { Router } from '@angular/router';

import { filter, map } from 'rxjs';
import { take, withLatestFrom } from 'rxjs/operators';

import { Actions, createEffect, ofType } from '@ngrx/effects';
import { ROUTER_NAVIGATED } from '@ngrx/router-store';
import { Store } from '@ngrx/store';

import { AppRoutePath } from '../../../../app-route-path.enum';
import { GreaseCalculationPath } from './../../../../grease-calculation/grease-calculation-path.enum';
import { Step } from './../../../../shared/models/settings/step.model';
import {
  completeStep,
  previousStep,
  setCurrentStep,
  setStepper,
  updateStep,
} from './../../actions/settings/settings.action';
import { getStepperState } from './../../selectors/settings/settings.selector';

@Injectable()
export class SettingsEffects {
  updateStep$ = createEffect(() => {
    return this.actions$.pipe(
      ofType(updateStep),
      withLatestFrom(this.store.select(getStepperState)),
      map(([action, stepperState]) => {
        const updatedSteps = this.getNewSteps(stepperState.steps, action.step);

        return setStepper({
          ...stepperState,
          steps: updatedSteps,
        });
      })
    );
  });

  completeStep$ = createEffect(() => {
    return this.actions$.pipe(
      ofType(completeStep),
      withLatestFrom(this.store.select(getStepperState)),
      map(([_action, stepperState]) => {
        if (stepperState.nextStep) {
          // complete current
          let updatedSteps = this.getNewSteps(stepperState.steps, {
            index: stepperState.currentStep,
            completed: true,
          });
          // enable next
          const newCurrentStep = stepperState.steps.find(
            (step: Step) => step.index === stepperState.nextStep
          );

          updatedSteps = this.getNewSteps(updatedSteps, {
            ...newCurrentStep,
            enabled: true,
            editable: true,
          });
          // determine new next step
          const newNext = stepperState.steps.find(
            (step: Step) => step.index === stepperState.nextStep + 1
          )?.index;

          return setStepper({
            ...stepperState,
            steps: updatedSteps,
            currentStep: stepperState.nextStep,
            previousStep: stepperState.currentStep,
            nextStep: newNext,
          });
        }

        return setStepper({ ...stepperState });
      })
    );
  });

  setCurrentStep$ = createEffect(() => {
    return this.actions$.pipe(
      ofType(setCurrentStep),
      withLatestFrom(this.store.select(getStepperState)),
      map(([action, stepperState]) => {
        const newCurrentStep = stepperState.steps.find(
          (step: Step) => step.index === action.step
        );

        const newPrevious = stepperState.steps.find(
          (step: Step) => step.index === newCurrentStep.index - 1
        )?.index;

        const newNext = stepperState.steps.find(
          (step: Step) => step.index === newCurrentStep.index + 1
        )?.index;

        this.router.navigate(
          [AppRoutePath.GreaseCalculationPath, newCurrentStep.link],
          {
            queryParamsHandling: 'merge',
          }
        );

        return setStepper({
          ...stepperState,
          currentStep: newCurrentStep.index,
          previousStep: newPrevious,
          nextStep: newNext,
        });
      })
    );
  });

  previousStep$ = createEffect(() => {
    return this.actions$.pipe(
      ofType(previousStep),
      withLatestFrom(this.store.select(getStepperState)),
      map(([_action, stepperState]) => {
        const newCurrentStep = stepperState.steps.find(
          (step: Step) => step.index === stepperState.previousStep
        );

        const newPrevious = stepperState.steps.find(
          (step: Step) => step.index === stepperState.previousStep - 1
        )?.index;

        this.router.navigate(
          [AppRoutePath.GreaseCalculationPath, newCurrentStep.link],
          {
            queryParamsHandling: 'merge',
          }
        );

        return setStepper({
          ...stepperState,
          currentStep: stepperState.previousStep,
          nextStep: stepperState.currentStep,
          previousStep: newPrevious,
        });
      })
    );
  });

  router$ = createEffect(() => {
    return this.actions$.pipe(
      ofType(ROUTER_NAVIGATED),
      take(1),
      map((action: any) => {
        if (action.payload.routerState.url.includes('?')) {
          return action.payload.routerState.url.split('?')[0];
        }

        return action.payload.routerState.url;
      }),

      map((url: string) =>
        Object.values({ ...GreaseCalculationPath }).find(
          (route: string) => route !== '' && url.includes(route)
        )
      ),
      filter((currentRoute: string) => (currentRoute ? true : false)),
      map((currentRoute: string) => {
        // TODO: needs to be changed when report is enabled
        const step =
          currentRoute === GreaseCalculationPath.ParametersPath ? 1 : 0;

        return setCurrentStep({ step });
      })
    );
  });

  private getNewSteps(
    steps: Step[],
    updatedStep: { index: number } & Partial<Step>
  ): Step[] {
    const targetedStep = steps.find(
      (step: Step) => step.index === updatedStep.index
    );
    const newStep: Step = {
      ...targetedStep,
      ...updatedStep,
    };

    const remainingSteps = steps.filter(
      (step: Step) => step.index !== updatedStep.index
    );

    const newSteps = [...remainingSteps, newStep].sort(
      (a: Step, b: Step) => a.index - b.index
    );

    return newSteps;
  }

  constructor(
    private readonly actions$: Actions,
    private readonly store: Store,
    private readonly router: Router
  ) {}
}
