import { Component, OnDestroy, OnInit } from '@angular/core';
import { Router } from '@angular/router';

import { debounceTime, Subscription } from 'rxjs';

import { TranslocoService } from '@ngneat/transloco';
import { Store } from '@ngrx/store';

import { AppRoutePath } from '../app-route-path.enum';
import { getCalculation } from '../core/store/actions/result/result.actions';
import { getReportUrls } from '../core/store/selectors/result/result.selector';
import { GreaseCalculationPath } from '../grease-calculation/grease-calculation-path.enum';
import { ReportUrls } from '../shared/models';

@Component({
  selector: 'ga-result',
  templateUrl: './result.component.html',
})
export class ResultComponent implements OnInit, OnDestroy {
  public reportUrls: ReportUrls;
  public reportSelector = '.content';
  public showCompactView = true;

  private currentLanguage!: string;
  private reportUrlsSubscription!: Subscription;
  private languageChangeSubscription!: Subscription;

  constructor(
    private readonly store: Store,
    private readonly router: Router,
    private readonly translocoService: TranslocoService
  ) {}

  public ngOnInit(): void {
    this.store.dispatch(getCalculation());

    this.reportUrlsSubscription = this.store
      .select(getReportUrls)
      .pipe(debounceTime(3000))
      .subscribe((reportUrls) => {
        this.reportUrls = reportUrls;
      });

    this.currentLanguage = this.translocoService.getActiveLang();

    this.languageChangeSubscription =
      this.translocoService.langChanges$.subscribe((language) => {
        if (language !== this.currentLanguage) {
          this.currentLanguage = language;
          this.resetReportUrls();
          this.store.dispatch(getCalculation());
        }
      });
  }

  public ngOnDestroy(): void {
    if (this.reportUrlsSubscription) {
      this.reportUrlsSubscription.unsubscribe();
    }

    if (this.languageChangeSubscription) {
      this.languageChangeSubscription.unsubscribe();
    }
  }

  public navigateBack(): void {
    this.router.navigate([
      `${AppRoutePath.GreaseCalculationPath}/${GreaseCalculationPath.ParametersPath}`,
    ]);
  }

  private resetReportUrls(): void {
    this.reportUrls = undefined;
  }
}
