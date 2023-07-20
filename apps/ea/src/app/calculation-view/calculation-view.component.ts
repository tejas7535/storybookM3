import { Component } from '@angular/core';
import { CalculationContainerComponent } from '@ea/calculation/calculation-container/calculation-container.component';

@Component({
  selector: 'ea-calculation-view',
  templateUrl: './calculation-view.component.html',
  standalone: true,
  imports: [CalculationContainerComponent],
})
export class CalculationViewComponent {}
