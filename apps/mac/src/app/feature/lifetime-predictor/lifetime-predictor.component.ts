import { BreakpointObserver, Breakpoints } from '@angular/cdk/layout';
import { Component, OnInit } from '@angular/core';

import { map, Observable } from 'rxjs';

import { Store } from '@ngrx/store';

import { ApplicationInsightsService } from '@schaeffler/application-insights';

import * as fromStore from './store';

@Component({
  selector: 'mac-lifetime-predictor',
  templateUrl: './lifetime-predictor.component.html',
  styleUrls: ['./lifetime-predictor.component.scss'],
})
export class LifetimePredictorComponent implements OnInit {
  public isLessThanMediumViewPort$: Observable<boolean>;

  public constructor(
    private readonly store: Store,
    private readonly breakpointObserver: BreakpointObserver,
    private readonly applicationInsightService: ApplicationInsightsService
  ) {}

  public ngOnInit(): void {
    this.applicationInsightService.logEvent('[MAC - LTP] opened');
    this.isLessThanMediumViewPort$ = this.breakpointObserver
      .observe([Breakpoints.XSmall, Breakpoints.Small])
      .pipe(map((state) => state.matches));
  }

  public handleReset(): void {
    this.store.dispatch(fromStore.unsetPredictionRequest());
    this.store.dispatch(fromStore.unsetDisplay());
  }
}
