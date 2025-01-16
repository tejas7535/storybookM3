import { CommonModule } from '@angular/common';
import { Component, input, InputSignal } from '@angular/core';

import { SimulatedQuotation } from '@gq/shared/models';
import { SharedPipesModule } from '@gq/shared/pipes/shared-pipes.module';

import { SharedTranslocoModule } from '@schaeffler/transloco';

@Component({
  selector: 'gq-simulated-kpi',
  standalone: true,
  imports: [CommonModule, SharedTranslocoModule, SharedPipesModule],
  templateUrl: './simulated-kpi.component.html',
})
export class SimulatedKpiComponent {
  readonly quotationCurrency: InputSignal<string> = input.required<string>();
  readonly simulatedQuotation: InputSignal<SimulatedQuotation> =
    input.required<SimulatedQuotation>();
}
