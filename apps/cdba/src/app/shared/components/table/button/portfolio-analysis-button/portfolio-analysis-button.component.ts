import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

import { Observable } from 'rxjs';

import { AppRoutePath } from '@cdba/app-route-path.enum';
import {
  getSelectedCalculationNodeIds,
  getSelectedRefTypeNodeIds,
} from '@cdba/core/store';
import { Store } from '@ngrx/store';

@Component({
  selector: 'cdba-portfolio-analysis-button',
  templateUrl: './portfolio-analysis-button.component.html',
})
export class PortfolioAnalysisButtonComponent implements OnInit {
  public selectedNodeIds$: Observable<string[]>;
  public appRoutePath = AppRoutePath;

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
