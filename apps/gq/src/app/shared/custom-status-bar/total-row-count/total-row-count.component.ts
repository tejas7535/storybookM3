import { Component, OnInit } from '@angular/core';

import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

import { IStatusPanelParams } from '@ag-grid-community/all-modules';
import { select, Store } from '@ngrx/store';

import { getRoles } from '@schaeffler/auth';

import { AppState } from '../../../core/store';
import { QuotationDetail } from '../../../core/store/models';
import { UserRoles } from '../../roles/user-roles.enum';

@Component({
  selector: 'gq-total-row-count',
  templateUrl: './total-row-count.component.html',
  styleUrls: ['./total-row-count.component.scss'],
})
export class TotalRowCountComponent implements OnInit {
  showMargins$: Observable<boolean>;
  totalNetValue = 0;
  totalMargin = 0;
  selections: QuotationDetail[] = [];
  selectedNetValue = 0;
  selectedMargin = 0;
  isOfferTable = false;
  private params: IStatusPanelParams;

  constructor(private readonly store: Store<AppState>) {}

  ngOnInit(): void {
    this.showMargins$ = this.store.pipe(
      select(getRoles),
      map((roles: string[]) => roles.includes(UserRoles.COST_GPC_ROLE))
    );
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
      colDefs.length === 5 || colDefs.length === 22 ? true : false;
  }
  rowValueChanges(): void {
    this.onSelectionChange();

    let sumMargin = 0;
    let totalRowCount = 0;
    this.totalNetValue = 0;

    this.params.api.forEachLeafNode((rowNode) => {
      this.totalNetValue += parseFloat(rowNode.data.netValue);
      this.totalNetValue = parseFloat(this.totalNetValue.toFixed(2));
      sumMargin += parseFloat(rowNode.data.margin);
      totalRowCount += 1;
    });

    if (totalRowCount > 0) {
      this.totalMargin = parseFloat((sumMargin / totalRowCount).toFixed(2));
    } else {
      this.totalMargin = 0;
      this.totalNetValue = 0;
      this.selectedMargin = 0;
      this.selectedNetValue = 0;
    }
  }

  onSelectionChange(): void {
    let sumMargin = 0;
    let selectionRowCount = 0;
    this.selectedNetValue = 0;

    this.selections = this.params.api.getSelectedRows();
    this.selections.forEach((value) => {
      this.selectedNetValue += parseFloat(value.netValue);
      this.selectedNetValue = parseFloat(this.selectedNetValue.toFixed(2));
      sumMargin += parseFloat(value.margin);
      selectionRowCount += 1;
    });

    this.selectedMargin = parseFloat(
      (sumMargin / selectionRowCount).toFixed(2)
    );
  }
}
