import { Component, OnInit } from '@angular/core';

import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

import { IStatusPanelParams, RowNode } from '@ag-grid-community/all-modules';
import { select, Store } from '@ngrx/store';

import { getRoles } from '@schaeffler/azure-auth';

import { AppState, getCustomerCurrency } from '../../../core/store';
import { QuotationDetail } from '../../../core/store/models';
import { COLUMN_DEFS_SHORT } from '../../offer-table/config/column-defs';
import { UserRoles } from '../../roles/user-roles.enum';
import { COLUMN_DEFS } from '../../services/create-column-service/column-defs';
import { PriceService } from '../../services/price-service/price.service';

@Component({
  selector: 'gq-quotation-details-status',
  templateUrl: './quotation-details-status.component.html',
  styleUrls: ['./quotation-details-status.component.scss'],
})
export class QuotationDetailsStatusComponent implements OnInit {
  showAverageGPI$: Observable<boolean>;
  customerCurrency$: Observable<string>;
  totalNetValue = 0;
  totalAverageGPI = 0;
  selectedNetValue = 0;
  selectedAverageGPI = 0;
  isOfferTable = false;
  selections: QuotationDetail[] = [];
  private params: IStatusPanelParams;

  constructor(private readonly store: Store<AppState>) {}

  ngOnInit(): void {
    this.showAverageGPI$ = this.store.pipe(
      select(getRoles),
      map((roles: string[]) => roles.includes(UserRoles.COST_GPC))
    );
    this.customerCurrency$ = this.store.pipe(select(getCustomerCurrency));
  }

  agInit(params: IStatusPanelParams): void {
    this.params = params;
    this.params.api.addEventListener('gridReady', this.getTableSpec.bind(this));
    this.params.api.addEventListener(
      'selectionChanged',
      this.onSelectionChange.bind(this)
    );
    this.params.api.addEventListener(
      'rowDataChanged',
      this.rowValueChanges.bind(this)
    );
  }

  getTableSpec(): void {
    const colDefs = this.params.api.getColumnDefs();
    this.isOfferTable =
      colDefs.length === COLUMN_DEFS_SHORT.length ||
      colDefs.length === COLUMN_DEFS.length - 1
        ? true
        : false;
  }

  rowValueChanges(): void {
    this.onSelectionChange();

    const details: QuotationDetail[] = [];
    this.params.api.forEachNode((row: RowNode) => details.push(row.data));
    const allRows = PriceService.calculateStatusBarValues(details);

    this.totalNetValue = allRows.netValue;
    this.totalAverageGPI = allRows.weightedGPI;
  }

  onSelectionChange(): void {
    this.selections = this.params.api.getSelectedRows();
    const selectedDetails = PriceService.calculateStatusBarValues(
      this.selections
    );

    this.selectedNetValue = selectedDetails.netValue;
    this.selectedAverageGPI = selectedDetails.weightedGPI;
  }
}
