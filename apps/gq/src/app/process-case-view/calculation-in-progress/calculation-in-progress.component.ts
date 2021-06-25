import { Component, Input } from '@angular/core';

@Component({
  selector: 'gq-calculation-in-progress',
  templateUrl: './calculation-in-progress.component.html',
})
export class CalculationInProgressComponent {
  imagePath = 'assets/png/calc_in_progress.png';
  @Input() amountDetails: number;

  reload(): void {
    window.location.reload();
  }
}
