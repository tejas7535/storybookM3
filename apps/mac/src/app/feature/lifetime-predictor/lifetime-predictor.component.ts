import { Component, OnInit } from '@angular/core';

import { Observable } from 'rxjs';

import { Store } from '@ngrx/store';

import { ApplicationInsightsService } from '@schaeffler/application-insights';
import { BreakpointService } from '@schaeffler/responsive';

import * as fromStore from './store';

@Component({
  selector: 'mac-lifetime-predictor',
  templateUrl: './lifetime-predictor.component.html',
  styleUrls: ['./lifetime-predictor.component.scss'],
})
export class LifetimePredictorComponent implements OnInit {
  public isLessThanMediumViewPort$: Observable<boolean>;
  public isMobileViewPort$: Observable<boolean>;

  public constructor(
    private readonly store: Store,
    private readonly breakpointService: BreakpointService,
    private readonly applicationInsightService: ApplicationInsightsService
  ) {}

  public ngOnInit(): void {
    this.applicationInsightService.logEvent('[MAC - LTP] opened');
    this.isLessThanMediumViewPort$ = this.breakpointService.isLessThanMedium();
    this.isMobileViewPort$ = this.breakpointService.isMobileViewPort();
  }

  public handleReset(): void {
    this.store.dispatch(fromStore.unsetPredictionRequest());
    this.store.dispatch(fromStore.unsetDisplay());
  }
}
