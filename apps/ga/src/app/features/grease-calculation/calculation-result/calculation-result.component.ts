import { Component, OnDestroy, OnInit } from '@angular/core';
import { Router } from '@angular/router';

import { debounceTime, Subscription } from 'rxjs';

import { TranslocoService } from '@ngneat/transloco';
import { Store } from '@ngrx/store';

import { AppRoutePath } from '@ga/app-route-path.enum';
import { getSelectedBearing } from '@ga/core/store';
import { getCalculation } from '@ga/core/store/actions/calculation-result/calculation-result.actions';
import { getPreferredGreaseSelection } from '@ga/core/store/selectors/calculation-parameters/calculation-parameters.selector';
import { getReportUrls } from '@ga/core/store/selectors/calculation-result/calculation-result.selector';
import { GreaseCalculationPath } from '@ga/features/grease-calculation/grease-calculation-path.enum';
import { ReportUrls } from '@ga/shared/models';
import { environment } from 'apps/ga/src/environments/environment';

@Component({
  selector: 'ga-calculation-result',
  templateUrl: './calculation-result.component.html',
})
export class CalculationResultComponent implements OnInit, OnDestroy {
  public isProduction = environment.production;
  public reportUrls: ReportUrls;
  public reportSelector = '.content';
  public showCompactView = true;
  public selectedBearing$ = this.store.select(getSelectedBearing);
  public preferredGreaseSelection$ = this.store.select(
    getPreferredGreaseSelection
  );

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
