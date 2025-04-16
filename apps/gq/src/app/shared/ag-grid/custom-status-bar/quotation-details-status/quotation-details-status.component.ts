import { CommonModule } from '@angular/common';
import { Component, DestroyRef, inject, OnInit } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { MatDialog } from '@angular/material/dialog';

import { Observable } from 'rxjs';

import { activeCaseFeature } from '@gq/core/store/active-case/active-case.reducer';
import {
  getQuotationCurrency,
  getSimulationModeEnabled,
} from '@gq/core/store/active-case/active-case.selectors';
import { userHasGPCRole, userHasSQVRole } from '@gq/core/store/selectors';
import { QuotationDetailsSummaryKpi } from '@gq/shared/models/quotation/quotation-details-summary-kpi.model';
import { SharedPipesModule } from '@gq/shared/pipes/shared-pipes.module';
import { PushPipe } from '@ngrx/component';
import { Store } from '@ngrx/store';
import { IStatusPanelParams } from 'ag-grid-enterprise';

import { SharedTranslocoModule } from '@schaeffler/transloco';

import { SimulatedQuotation } from '../../../models';
import { QuotationDetail } from '../../../models/quotation-detail';
import { calculateFilteredRows } from '../statusbar.utils';
import { SelectedKpiComponent } from './component/selected-kpi/selected-kpi.component';
import { SimulatedKpiComponent } from './component/simulated-kpi/simulated-kpi.component';
import { StatusBarModalComponent } from './component/status-bar-modal/status-bar-modal.component';
import { TotalKpiComponent } from './component/total-kpi/total-kpi.component';
import { SelectedQuotationDetailsKpiActions } from './store/selected-quotation-details-kpi.actions';
import { SelectedQuotationDetailsKpiStoreModule } from './store/selected-quotation-details-kpi.module';
import { selectedQuotationDetailsKpiFeature } from './store/selected-quotation-details-kpi.reducer';

@Component({
  selector: 'gq-quotation-details-status',
  templateUrl: './quotation-details-status.component.html',
  standalone: true,
  imports: [
    SharedPipesModule,
    PushPipe,
    CommonModule,
    SharedTranslocoModule,
    TotalKpiComponent,
    SelectedKpiComponent,
    SimulatedKpiComponent,
    SelectedQuotationDetailsKpiStoreModule,
  ],
  styles: [
    `
      :host {
        @apply h-full;
        @apply w-full;
      }
    `,
  ],
})
export class QuotationDetailsStatusComponent implements OnInit {
  filteredRows = 0;
  selections: QuotationDetail[] = [];
  private totalRowCount = 0;
  private params: IStatusPanelParams;

  private readonly store: Store = inject(Store);
  private readonly dialog: MatDialog = inject(MatDialog);
  private readonly destroyRef$ = inject(DestroyRef);

  showGPI$: Observable<boolean> = this.store.pipe(userHasGPCRole);
  showGPM$: Observable<boolean> = this.store.pipe(userHasSQVRole);
  quotationCurrency$: Observable<string> =
    this.store.select(getQuotationCurrency);
  simulationModeEnabled$: Observable<boolean> = this.store.select(
    getSimulationModeEnabled
  );
  simulatedQuotation$: Observable<SimulatedQuotation> = this.store.select(
    activeCaseFeature.selectSimulatedItem
  );
  quotationDetailsSummaryKpi$: Observable<QuotationDetailsSummaryKpi> =
    this.store.select(activeCaseFeature.getQuotationDetailsSummaryKpi);
  selectedQuotationDetailsSummaryKpi$: Observable<QuotationDetailsSummaryKpi> =
    this.store.select(
      selectedQuotationDetailsKpiFeature.selectSelectedQuotationDetailsKpi
    );

  ngOnInit(): void {
    this.quotationDetailsSummaryKpi$
      .pipe(takeUntilDestroyed(this.destroyRef$))
      .subscribe((q) => (this.totalRowCount = q.amountOfQuotationDetails));
  }

  agInit(params: IStatusPanelParams): void {
    this.params = params;
    this.params.api.addEventListener(
      'selectionChanged',
      this.onSelectionChange.bind(this)
    );
    this.params.api.addEventListener(
      'rowDataUpdated',
      this.rowValueChanges.bind(this)
    );
    this.params.api.addEventListener(
      'filterChanged',
      this.onFilterChanged.bind(this)
    );
  }

  rowValueChanges(): void {
    this.onSelectionChange();
  }

  onSelectionChange(): void {
    const newSelections = this.params.api.getSelectedRows();

    if (this.selections?.length === newSelections?.length) {
      return;
    }
    this.selections = newSelections;
    this.store.dispatch(
      SelectedQuotationDetailsKpiActions.loadKPI({
        data: this.selections,
      })
    );
  }

  onFilterChanged(): void {
    const displayedRowCount = this.params.api.getDisplayedRowCount();
    this.filteredRows = calculateFilteredRows(
      displayedRowCount,
      this.totalRowCount
    );
  }

  showAll(): void {
    this.dialog.open(StatusBarModalComponent, {
      width: '600px',
      data: {
        filteredAmount: this.filteredRows,
      },
    });
  }
}
