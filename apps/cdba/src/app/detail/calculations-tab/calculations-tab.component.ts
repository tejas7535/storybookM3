import { Component, OnInit } from '@angular/core';

import { Observable } from 'rxjs';

import { select, Store } from '@ngrx/store';

import { Calculation } from '@cdba/shared/models';

import { selectCalculation } from '../../core/store';
import { DetailState } from '../../core/store/reducers/detail/detail.reducer';
import {
  getCalculations,
  getCalculationsErrorMessage,
  getCalculationsLoading,
  getSelectedCalculationNodeId,
} from '../../core/store/selectors';

@Component({
  selector: 'cdba-calculations-tab',
  templateUrl: './calculations-tab.component.html',
  styleUrls: ['./calculations-tab.component.scss'],
})
export class CalculationsTabComponent implements OnInit {
  calculations$: Observable<Calculation[]>;
  selectedNodeId$: Observable<string>;
  loading$: Observable<boolean>;
  errorMessage$: Observable<string>;

  public constructor(private readonly store: Store<DetailState>) {}

  ngOnInit(): void {
    this.calculations$ = this.store.pipe(select(getCalculations));
    this.selectedNodeId$ = this.store.pipe(
      select(getSelectedCalculationNodeId)
    );
    this.loading$ = this.store.pipe(select(getCalculationsLoading));
    this.errorMessage$ = this.store.pipe(select(getCalculationsErrorMessage));
  }

  public selectCalculation(event: {
    nodeId: string;
    calculation: Calculation;
  }): void {
    this.store.dispatch(selectCalculation(event));
  }
}
