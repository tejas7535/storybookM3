import { Component, Input, OnInit } from '@angular/core';

@Component({
  selector: 'gq-calculation-in-progress',
  templateUrl: './calculation-in-progress.component.html',
})
export class CalculationInProgressComponent implements OnInit {
  imagePath: string;

  @Input() amountDetails: number;

  @Input() isSapRefreshInProgress: boolean;

  reload(): void {
    window.location.reload();
  }

  ngOnInit(): void {
    this.imagePath = this.isSapRefreshInProgress
      ? 'assets/png/sap_refresh_in_progress.png'
      : 'assets/png/calc_in_progress.png';
  }
}
