import { ChangeDetectionStrategy, Component } from '@angular/core';
import { MatDividerModule } from '@angular/material/divider';

import { CalculationParametersComponent } from '../calculation-parameters/calculation-parameters';
import { CalculationResultPreviewComponent } from '../calculation-result-preview/calculation-result-preview';
import { CalculationTypesSelectionComponent } from '../calculation-types-selection/calculation-types-selection';

@Component({
  selector: 'ea-calculation-container',
  templateUrl: './calculation-container.component.html',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    MatDividerModule,
    CalculationParametersComponent,
    CalculationTypesSelectionComponent,
    CalculationResultPreviewComponent,
  ],
})
export class CalculationContainerComponent {}
