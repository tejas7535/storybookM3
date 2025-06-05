import { Component, computed, input, InputSignal } from '@angular/core';

import { HorizontalDividerComponent } from '@gq/shared/components/horizontal-divider/horizontal-divider.component';

import { SharedTranslocoModule } from '@schaeffler/transloco';

import { StepColor } from './step-number/models/step-color.enum';
import { StepNumberComponent } from './step-number/step-number.component';

@Component({
  selector: 'gq-recalculation-progress',
  templateUrl: './recalculation-progress.component.html',
  imports: [
    StepNumberComponent,
    HorizontalDividerComponent,
    SharedTranslocoModule,
  ],
})
export class RecalculationProgressComponent {
  activeStep: InputSignal<number> = input(null);
  cancelled: InputSignal<boolean> = input(false);

  color = computed(() =>
    this.cancelled() ? StepColor.CANCELLED : StepColor.ACTIVE
  );
  readonly stepColor = StepColor;
}
