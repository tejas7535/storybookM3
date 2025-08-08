import { Component, OnDestroy, OnInit } from '@angular/core';

import { Observable, Subscription, take } from 'rxjs';

import { Breadcrumb } from '@schaeffler/breadcrumbs';

import { Tab } from '@cdba/shared/components';
import { BetaFeature } from '@cdba/shared/constants/beta-feature';
import { BreadcrumbsService } from '@cdba/shared/services';
import { BetaFeatureService } from '@cdba/shared/services/beta-feature/beta-feature.service';

import { CompareRoutePath } from './compare-route-path.enum';

@Component({
  selector: 'cdba-compare',
  templateUrl: './compare.component.html',
  standalone: false,
})
export class CompareComponent implements OnInit, OnDestroy {
  breadcrumbs$: Observable<Breadcrumb[]>;
  tabs: Tab[];

  canAccessComparisonSummarySubscription: Subscription;

  constructor(
    private readonly breadcrumbService: BreadcrumbsService,
    private readonly betaFeatureService: BetaFeatureService
  ) {}

  ngOnInit(): void {
    this.breadcrumbs$ = this.breadcrumbService.breadcrumbs$;
    let canAccessComparisonSummary;
    this.canAccessComparisonSummarySubscription = this.betaFeatureService
      .canAccessBetaFeature$(BetaFeature.COMPARISON_SUMMARY)
      .pipe(take(1))
      .subscribe((canAccess) => (canAccessComparisonSummary = canAccess));

    const tabz: Tab[] = [
      {
        label: 'compare.tabs.billOfMaterial',
        link: CompareRoutePath.BomPath,
      },
      {
        label: 'compare.tabs.details',
        link: CompareRoutePath.DetailsPath,
      },
    ];

    if (canAccessComparisonSummary) {
      tabz.splice(1, 0, {
        label: 'compare.tabs.comparisonSummary',
        link: CompareRoutePath.ComparisonSummaryPath,
        betaFeature: true,
      });
    }

    this.tabs = tabz;
  }

  ngOnDestroy(): void {
    this.canAccessComparisonSummarySubscription?.unsubscribe();
  }

  /**
   * Improves performance of ngFor.
   */
  trackByFn(index: number): number {
    return index;
  }
}
