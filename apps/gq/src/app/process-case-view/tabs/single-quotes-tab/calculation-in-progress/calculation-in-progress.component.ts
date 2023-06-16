import { Component, Input, OnInit } from '@angular/core';

import { map, Observable } from 'rxjs';

import { SapCallInProgress } from '@gq/shared/models/quotation';
import { TranslocoService } from '@ngneat/transloco';

@Component({
  selector: 'gq-calculation-in-progress',
  templateUrl: './calculation-in-progress.component.html',
})
export class CalculationInProgressComponent implements OnInit {
  public imagePath: string;
  public translationSource = '';
  public translationsLoaded$: Observable<boolean>;

  @Input() amountDetails: number;
  @Input() sapCallInProgress: SapCallInProgress;

  constructor(private readonly translocoService: TranslocoService) {}

  reload(): void {
    window.location.reload();
  }

  ngOnInit(): void {
    this.translationsLoaded$ = this.translocoService
      .selectTranslateObject('processCaseView', {}, '')
      .pipe(map((res) => typeof res !== 'string'));

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
