import { Component, OnDestroy, OnInit } from '@angular/core';

import { Observable, Subscription } from 'rxjs';

import { Store } from '@ngrx/store';
import { RowSelectionOptions } from 'ag-grid-enterprise';

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
})
export class CalculationsTabComponent implements OnInit, OnDestroy {
  calculations$: Observable<Calculation[]>;
  selectedNodeIds$: Observable<string[]>;
  loading$: Observable<boolean>;
  errorMessage$: Observable<string>;

  rowSelection = { enableSelectionWithoutKeys: true } as RowSelectionOptions;

  private selectedNodeIds: string[];
  private selectedNodeIdsSubscription: Subscription;

  public constructor(private readonly store: Store) {}

  ngOnInit(): void {
    this.calculations$ = this.store.select(getCalculations);
    this.selectedNodeIds$ = this.store.select(getSelectedCalculationNodeIds);
    this.loading$ = this.store.select(getCalculationsLoading);
    this.errorMessage$ = this.store.select(getCalculationsError);

    this.selectedNodeIdsSubscription = this.selectedNodeIds$.subscribe(
      (selectedNodeIds) => (this.selectedNodeIds = selectedNodeIds)
    );
  }

  ngOnDestroy(): void {
    this.selectedNodeIdsSubscription.unsubscribe();
  }

  public selectCalculations(
    event: {
      nodeId: string;
      calculation: Calculation;
    }[]
  ): void {
    const nodeIds = event.map((entry) => entry.nodeId);

    if (nodeIds.length === 1 && this.selectedNodeIds.length === 1) {
      nodeIds.splice(0, 0, this.selectedNodeIds[0]);
    }

    this.store.dispatch(selectCalculations({ nodeIds }));
  }
}
