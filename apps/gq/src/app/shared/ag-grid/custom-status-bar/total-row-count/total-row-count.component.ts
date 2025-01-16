import { CommonModule } from '@angular/common';
import { Component, DestroyRef, inject, OnInit } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';

import { map, Observable } from 'rxjs';

import { activeCaseFeature } from '@gq/core/store/active-case/active-case.reducer';
import { getSimulationModeEnabled } from '@gq/core/store/active-case/active-case.selectors';
import { LetDirective, PushPipe } from '@ngrx/component';
import { Store } from '@ngrx/store';
import { IStatusPanelParams } from 'ag-grid-enterprise';

import { SharedTranslocoModule } from '@schaeffler/transloco';

import { selectedQuotationDetailsKpiFeature } from '../quotation-details-status/store/selected-quotation-details-kpi.reducer';
import { calculateFilteredRows } from '../statusbar.utils';

@Component({
  selector: 'gq-total-row-count',
  standalone: true,
  imports: [SharedTranslocoModule, CommonModule, LetDirective, PushPipe],
  styles: [
    `
      :host {
        @apply h-full;
      }
    `,
  ],
  templateUrl: './total-row-count.component.html',
})
export class TotalRowCountComponent implements OnInit {
  private readonly store: Store = inject(Store);
  private readonly destroyRef = inject(DestroyRef);
  private totalRowCount = 0;
  private params: IStatusPanelParams;
  filteredRowCount = 0;

  agInit(params: IStatusPanelParams): void {
    this.params = params;
    this.params.api.addEventListener(
      'filterChanged',
      this.onFilterChange.bind(this)
    );
  }

  simulationModeEnabled$: Observable<boolean> = this.store.select(
    getSimulationModeEnabled
  );
  totalRowCount$: Observable<number> = this.store
    .select(activeCaseFeature.getQuotationDetailsSummaryKpi)
    .pipe(map((q) => q?.amountOfQuotationDetails));
  selectedRowCount$: Observable<number> = this.store
    .select(
      selectedQuotationDetailsKpiFeature.selectSelectedQuotationDetailsKpi
    )
    .pipe(map((q) => q?.amountOfQuotationDetails));

  ngOnInit(): void {
    this.totalRowCount$
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe((total) => (this.totalRowCount = total));
  }

  onFilterChange(): void {
    const displayedRowCount = this.params.api.getDisplayedRowCount();
    this.filteredRowCount = calculateFilteredRows(
      displayedRowCount,
      this.totalRowCount
    );
  }
}
