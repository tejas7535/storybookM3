import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

import { Observable, tap } from 'rxjs';
import { Store } from '@ngrx/store';

import { Breadcrumb } from '@schaeffler/breadcrumbs';

import { AppRoutePath } from '@cdba/app-route-path.enum';
import { EMAIL_CDBA } from '@cdba/shared/constants/emails';
import { BreadcrumbsService } from '@cdba/shared/services';
import { ProductCostAnalysis } from '@cdba/shared/models';
import { getPortfolioAnalysisDataForSelectedNodes } from '@cdba/core/store';

@Component({
  selector: 'cdba-portfolio-analysis',
  templateUrl: './portfolio-analysis.component.html',
  styles: [],
})
export class PortfolioAnalysisComponent implements OnInit {
  breadcrumbs$: Observable<Breadcrumb[]>;
  productCostAnalyses$: Observable<ProductCostAnalysis[]>;

  emailAddress = EMAIL_CDBA;

  constructor(
    private readonly store: Store,
    private readonly router: Router,
    private readonly breadcrumbsService: BreadcrumbsService
  ) {}

  ngOnInit(): void {
    this.breadcrumbs$ = this.breadcrumbsService.breadcrumbs$;
    this.productCostAnalyses$ = this.store
      .select(getPortfolioAnalysisDataForSelectedNodes)
      .pipe(
        tap((productCostAnalyses) => {
          if (!productCostAnalyses || productCostAnalyses.length === 0) {
            this.router.navigateByUrl(AppRoutePath.ResultsPath);
          }
        })
      );
  }
}
