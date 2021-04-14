import { Component, OnInit } from '@angular/core';

import { Observable } from 'rxjs';

import { Store } from '@ngrx/store';

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

  constructor(
    private readonly store: Store<AppState>,
    private readonly breakpointService: BreakpointService
  ) {}

  public ngOnInit(): void {
    this.isLessThanMediumViewPort$ = this.breakpointService.isLessThanMedium();
  }

  public handleReset(): void {
    this.store.dispatch(fromStore.unsetPredictionRequest());
    this.store.dispatch(fromStore.unsetDisplay());
  }
}
