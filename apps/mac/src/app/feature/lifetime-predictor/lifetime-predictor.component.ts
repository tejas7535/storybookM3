import { Component, OnInit } from '@angular/core';

import { Observable } from 'rxjs';

import { Store } from '@ngrx/store';

import { ApplicationInsightsService } from '@schaeffler/application-insights';
import { BreakpointService } from '@schaeffler/responsive';

import { AppState } from '../../core/store/reducers';
import * as fromStore from './store';

@Component({
  selector: 'mac-lifetime-predictor',
  templateUrl: './lifetime-predictor.component.html',
  styleUrls: ['./lifetime-predictor.component.scss'],
})
export class LifetimePredictorComponent implements OnInit {
  public isLessThanMediumViewPort$: Observable<boolean>;

  public constructor(
    private readonly store: Store<AppState>,
    private readonly breakpointService: BreakpointService,
    private readonly applicationInsightService: ApplicationInsightsService
  ) {}

  public ngOnInit(): void {
    this.applicationInsightService.logEvent('[MAC - LTP] opened');
    this.isLessThanMediumViewPort$ = this.breakpointService.isLessThanMedium();
  }

  public handleReset(): void {
    this.store.dispatch(fromStore.unsetPredictionRequest());
    this.store.dispatch(fromStore.unsetDisplay());
  }
}
