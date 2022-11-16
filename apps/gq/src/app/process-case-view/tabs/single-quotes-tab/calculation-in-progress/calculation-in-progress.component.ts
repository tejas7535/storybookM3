import { Component, Input, OnInit } from '@angular/core';

import { SapCallInProgress } from '../../../../shared/models/quotation';

@Component({
  selector: 'gq-calculation-in-progress',
  templateUrl: './calculation-in-progress.component.html',
})
export class CalculationInProgressComponent implements OnInit {
  public imagePath: string;
  public translationSource = '';

  @Input() amountDetails: number;
  @Input() sapCallInProgress: SapCallInProgress;

  reload(): void {
    window.location.reload();
  }

  ngOnInit(): void {
    this.translationSource = this.sapCallInProgress
      ? `processCaseView.sapCallInProgress.${
          SapCallInProgress[this.sapCallInProgress]
        }`
      : 'processCaseView.calcInProgress';

    this.imagePath =
      this.sapCallInProgress === SapCallInProgress.FETCH_DATA_IN_PROGRESS
        ? 'assets/png/sap_refresh_in_progress.png'
        : 'assets/png/calc_in_progress.png';
  }
}
