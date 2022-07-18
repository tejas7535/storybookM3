import { StepperSelectionEvent } from '@angular/cdk/stepper';
import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component } from '@angular/core';
import { MatStepperModule } from '@angular/material/stepper';
import { Router } from '@angular/router';

import { LetModule, PushModule } from '@ngrx/component';
import { Store } from '@ngrx/store';

import { StepperModule } from '@schaeffler/stepper';
import { SharedTranslocoModule } from '@schaeffler/transloco';

import { AppRoutePath } from '@ga/app-route-path.enum';
import {
  getCurrentStep,
  getSteps,
} from '@ga/core/store/selectors/settings/settings.selector';
import { steps } from '@ga/shared/constants';

@Component({
  selector: 'ga-grease-stepper',
  standalone: true,
  imports: [
    CommonModule,
    MatStepperModule,
    StepperModule,
    LetModule,
    PushModule,
    SharedTranslocoModule,
  ],
  templateUrl: './grease-stepper.component.html',
  styleUrls: ['./grease-stepper.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class GreaseStepperComponent {
  public steps$ = this.store.select(getSteps);
  public currentStep$ = this.store.select(getCurrentStep);

  constructor(private readonly store: Store, private readonly router: Router) {}

  selectStep(event: StepperSelectionEvent): void {
    const newRoute = steps.find(
      ({ index }) => index === event.selectedIndex
    ).link;
    this.router.navigate([`${AppRoutePath.GreaseCalculationPath}/${newRoute}`]);
  }
}
