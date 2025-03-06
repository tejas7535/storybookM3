import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

import { Observable } from 'rxjs';

import { Store } from '@ngrx/store';

import { AppRoutePath } from '@cdba/app-route-path.enum';
import {
  getSelectedCalculationNodeIds,
  getSelectedRefTypeNodeIds,
} from '@cdba/core/store';
import {
  PORTFOLIO_ANALYSIS_ITEMS_MAX_COUNT,
  PORTFOLIO_ANALYSIS_ITEMS_MIN_COUNT,
} from '@cdba/shared/constants/table';

@Component({
  selector: 'cdba-portfolio-analysis-button',
  templateUrl: './portfolio-analysis-button.component.html',
  standalone: false,
})
export class PortfolioAnalysisButtonComponent implements OnInit {
  public selectedNodeIds$: Observable<string[]>;
  public appRoutePath = AppRoutePath;
  public minCount = PORTFOLIO_ANALYSIS_ITEMS_MIN_COUNT;
  public maxCount = PORTFOLIO_ANALYSIS_ITEMS_MAX_COUNT;

  public constructor(
    private readonly router: Router,
    private readonly store: Store
  ) {}

  public ngOnInit(): void {
    this.selectedNodeIds$ = this.router.routerState.snapshot.url.includes(
      AppRoutePath.ResultsPath
    )
      ? this.store.select(getSelectedRefTypeNodeIds)
      : this.store.select(getSelectedCalculationNodeIds);
  }
}
