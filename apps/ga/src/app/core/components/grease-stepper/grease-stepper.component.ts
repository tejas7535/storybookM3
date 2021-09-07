import { StepperSelectionEvent } from '@angular/cdk/stepper';
import { ChangeDetectionStrategy, Component, OnInit } from '@angular/core';

import { Observable } from 'rxjs';

import { Store } from '@ngrx/store';

import { setCurrentStep } from '../../store/actions/settings/settings.action';
import { Step } from './../../../shared/models/settings/step.model';
import {
  getCurrentStep,
  getSteps,
  hasNext,
} from './../../store/selectors/settings/settings.selector';

@Component({
  selector: 'ga-grease-stepper',
  templateUrl: './grease-stepper.component.html',
  styleUrls: ['./grease-stepper.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class GreaseStepperComponent implements OnInit {
  public steps$: Observable<Step[]>;
  public hasNext$: Observable<boolean>;
  public currentStep$: Observable<number>;

  constructor(private readonly store: Store) {}

  ngOnInit(): void {
    this.steps$ = this.store.select(getSteps);
    this.hasNext$ = this.store.select(hasNext);
    this.currentStep$ = this.store.select(getCurrentStep);
  }

  selectStep(event: StepperSelectionEvent): void {
    this.store.dispatch(setCurrentStep({ step: event.selectedIndex }));
  }
}
