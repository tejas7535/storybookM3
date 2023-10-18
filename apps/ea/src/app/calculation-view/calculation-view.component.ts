import { Component } from '@angular/core';

import { CalculationContainerComponent } from '@ea/calculation/calculation-container/calculation-container.component';
import { TranslocoDecimalPipe } from '@ngneat/transloco-locale';

@Component({
  selector: 'ea-calculation-view',
  templateUrl: './calculation-view.component.html',
  standalone: true,
  imports: [CalculationContainerComponent],
  providers: [TranslocoDecimalPipe],
})
export class CalculationViewComponent {}
