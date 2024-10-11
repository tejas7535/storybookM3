import { ChangeDetectionStrategy, Component, Input } from '@angular/core';
import { MatProgressBarModule } from '@angular/material/progress-bar';

@Component({
  selector: 'ea-calculation-indication-mobile',
  templateUrl: './calculation-indication-mobile.component.html',
  standalone: true,
  imports: [MatProgressBarModule],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CalculationIndicationMobileComponent {
  @Input() isCalculationLoading: boolean;

  @Input() isCalculationResultAvailable: boolean;
}
