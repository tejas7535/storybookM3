import { StepperSelectionEvent } from '@angular/cdk/stepper';
import { ChangeDetectionStrategy, Component } from '@angular/core';
import { MatStepperModule } from '@angular/material/stepper';
import { Router } from '@angular/router';

import { firstValueFrom } from 'rxjs';

import { LetDirective, PushPipe } from '@ngrx/component';
import { Store } from '@ngrx/store';

import { StepperModule } from '@schaeffler/stepper';
import { SharedTranslocoModule } from '@schaeffler/transloco';

import { AppRoutePath } from '@ga/app-route-path.enum';
import {
  getCurrentStep,
  getSteps,
} from '@ga/core/store/selectors/settings/settings.selector';

@Component({
  selector: 'ga-grease-stepper',
  standalone: true,
  imports: [
    MatStepperModule,
    StepperModule,
    LetDirective,
    PushPipe,
    SharedTranslocoModule,
  ],
  templateUrl: './grease-stepper.component.html',
  styleUrls: ['./grease-stepper.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class GreaseStepperComponent {
  public steps$ = this.store.select(getSteps);

  public currentStep$ = this.store.select(getCurrentStep);

  constructor(
    private readonly store: Store,
    private readonly router: Router
  ) {}

  async selectStep(_event: StepperSelectionEvent): Promise<void> {
    const items = await firstValueFrom(this.steps$);

    const targetRoute = items.find(
      ({ index }) => index === _event.selectedIndex
    );

    if (!targetRoute.enabled) {
      return;
    }

    this.router.navigate([
      `${AppRoutePath.GreaseCalculationPath}/${targetRoute.link}`,
    ]);
  }
}
