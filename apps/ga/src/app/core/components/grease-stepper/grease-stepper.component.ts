import { StepperSelectionEvent } from '@angular/cdk/stepper';
import { ChangeDetectionStrategy, Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

import { Observable } from 'rxjs';

import { Store } from '@ngrx/store';

import { AppRoutePath } from '../../../app-route-path.enum';
import { steps } from '../../../shared/constants';
import {
  EnabledStep,
  Step,
} from './../../../shared/models/settings/step.model';
import {
  getCurrentStep,
  getEnabledSteps,
} from './../../store/selectors/settings/settings.selector';

@Component({
  selector: 'ga-grease-stepper',
  templateUrl: './grease-stepper.component.html',
  styleUrls: ['./grease-stepper.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class GreaseStepperComponent implements OnInit {
  public enabledSteps$: Observable<EnabledStep[]>;
  public hasNext$: Observable<boolean>;
  public currentStep$: Observable<number>;

  constructor(private readonly store: Store, private readonly router: Router) {}

  ngOnInit(): void {
    this.enabledSteps$ = this.store.select(getEnabledSteps);
    this.currentStep$ = this.store.select(getCurrentStep);
  }

  selectStep(event: StepperSelectionEvent): void {
    const newRoute = steps.find(
      ({ index }: Step) => index === event.selectedIndex
    ).link;
    this.router.navigate([`${AppRoutePath.GreaseCalculationPath}/${newRoute}`]);
  }
}
