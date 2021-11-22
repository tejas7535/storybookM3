import { Component, OnInit } from '@angular/core';

import { Observable } from 'rxjs';

import { Store } from '@ngrx/store';

import { Calculation } from '@cdba/shared/models';

import { selectCalculations } from '../../core/store';
import {
  getCalculations,
  getCalculationsError,
  getCalculationsLoading,
  getSelectedCalculationNodeIds,
} from '../../core/store/selectors';

@Component({
  selector: 'cdba-calculations-tab',
  templateUrl: './calculations-tab.component.html',
  styleUrls: ['./calculations-tab.component.scss'],
})
export class CalculationsTabComponent implements OnInit {
  calculations$: Observable<Calculation[]>;
  selectedNodeIds$: Observable<string[]>;
  loading$: Observable<boolean>;
  errorMessage$: Observable<string>;

  public constructor(private readonly store: Store) {}

  ngOnInit(): void {
    this.calculations$ = this.store.select(getCalculations);
    this.selectedNodeIds$ = this.store.select(getSelectedCalculationNodeIds);
    this.loading$ = this.store.select(getCalculationsLoading);
    this.errorMessage$ = this.store.select(getCalculationsError);
  }

  public selectCalculations(
    event: {
      nodeId: string;
      calculation: Calculation;
    }[]
  ): void {
    const nodeIds = event.map((entry) => entry.nodeId);
    this.store.dispatch(selectCalculations({ nodeIds }));
  }
}
