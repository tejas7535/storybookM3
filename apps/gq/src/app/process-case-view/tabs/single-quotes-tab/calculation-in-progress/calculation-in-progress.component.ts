import { Component, DestroyRef, inject, Input, OnInit } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';

import { BehaviorSubject, map, Observable } from 'rxjs';

import { SapCallInProgress } from '@gq/shared/models/quotation';
import { TranslocoService } from '@jsverse/transloco';
import { isEmpty } from 'lodash';

@Component({
  selector: 'gq-calculation-in-progress',
  templateUrl: './calculation-in-progress.component.html',
  standalone: false,
})
export class CalculationInProgressComponent implements OnInit {
  private readonly translationLoadedSubject: BehaviorSubject<boolean> =
    new BehaviorSubject<boolean>(false);
  private readonly destroyRef: DestroyRef = inject(DestroyRef);

  public imagePath: string;
  public translationSource = '';
  public translationsLoaded$: Observable<boolean> =
    this.translationLoadedSubject.asObservable();

  @Input() amountDetails: number;
  @Input() sapCallInProgress: SapCallInProgress;

  constructor(private readonly translocoService: TranslocoService) {}

  reload(): void {
    window.location.reload();
  }

  ngOnInit(): void {
    // check if translation is loaded already, otherwise subscribe to the events and wait until load is complete
    if (isEmpty(this.translocoService.getTranslation('process-case-view'))) {
      this.translocoService.events$
        .pipe(
          takeUntilDestroyed(this.destroyRef),
          map(
            (event) =>
              event.type === 'translationLoadSuccess' &&
              event.payload?.scope === 'process-case-view'
          )
        )
        .subscribe((result) => {
          this.translationLoadedSubject.next(result);
        });
    } else {
      this.translationLoadedSubject.next(true);
    }

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
