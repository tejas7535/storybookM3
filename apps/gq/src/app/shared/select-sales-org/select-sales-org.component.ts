import { Component, OnInit } from '@angular/core';
import { MatSelectChange } from '@angular/material/select';

import { Observable } from 'rxjs';

import { Store } from '@ngrx/store';

import {
  getSalesOrgs,
  getSelectedSalesOrg,
  selectSalesOrg,
} from '../../core/store';
import { SalesOrg } from '../../core/store/reducers/create-case/models';

@Component({
  selector: 'gq-select-sales-org',
  templateUrl: './select-sales-org.component.html',
})
export class SelectSalesOrgComponent implements OnInit {
  salesOrgs$: Observable<SalesOrg[]>;
  selectedSalesOrg$: Observable<SalesOrg>;

  constructor(private readonly store: Store) {}

  ngOnInit(): void {
    this.salesOrgs$ = this.store.select(getSalesOrgs);
    this.selectedSalesOrg$ = this.store.select(getSelectedSalesOrg);
  }

  selectionChange(event: MatSelectChange): void {
    this.store.dispatch(selectSalesOrg({ salesOrgId: event.value }));
  }

  public trackByFn(index: number): number {
    return index;
  }
}
