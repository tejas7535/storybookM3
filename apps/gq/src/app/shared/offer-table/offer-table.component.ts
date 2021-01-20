import { Component, Input, OnChanges, OnDestroy, OnInit } from '@angular/core';

import { Subscription } from 'rxjs';

import { ColDef, StatusPanelDef } from '@ag-grid-community/all-modules';
import { select, Store } from '@ngrx/store';

import { getRoles } from '@schaeffler/auth';

import { AppState } from '../../core/store';
import { QuotationDetail } from '../../core/store/models';
import { ColumnUtilityService } from '../services/createColumnService/column-utility.service';
import {
  COLUMN_DEFS_SHORT,
  DEFAULT_COLUMN_DEFS,
  FRAMEWORK_COMPONENTS,
  FRAMEWORK_COMPONENTS_FINISH_OFFER,
  MODULES,
  STATUS_BAR_CONFIG,
  STATUS_BAR_CONFIG_FINISH_OFFER,
} from './config';

@Component({
  selector: 'gq-offer-table',
  templateUrl: './offer-table.component.html',
  styleUrls: ['./offer-table.component.scss'],
})
export class OfferTableComponent implements OnChanges, OnInit, OnDestroy {
  @Input() rowData: QuotationDetail[];

  @Input() drawerTable = false;

  modules: any[] = MODULES;

  public defaultColumnDefs: ColDef = DEFAULT_COLUMN_DEFS;

  public statusBar: {
    statusPanels: StatusPanelDef[];
  } = STATUS_BAR_CONFIG_FINISH_OFFER;

  public frameworkComponents: any = FRAMEWORK_COMPONENTS_FINISH_OFFER;

  public columnDefs: ColDef[] = [];

  public rowSelection = 'multiple';
  public roles: string[] = [];
  readonly subscription: Subscription = new Subscription();

  constructor(private readonly store: Store<AppState>) {}

  ngOnInit(): void {
    this.subscription.add(
      this.store.pipe(select(getRoles)).subscribe((roles) => {
        this.roles = roles;
        this.columnDefs = this.drawerTable
          ? COLUMN_DEFS_SHORT
          : ColumnUtilityService.createColumnDefs(roles, false);
      })
    );
  }

  ngOnDestroy(): void {
    this.subscription.unsubscribe();
  }

  onGridReady(params: any): void {
    if (this.drawerTable) {
      params.api.sizeColumnsToFit();
    }
  }

  ngOnChanges(): void {
    this.columnDefs = this.drawerTable
      ? COLUMN_DEFS_SHORT
      : ColumnUtilityService.createColumnDefs(this.roles, false);
    this.frameworkComponents = this.drawerTable
      ? FRAMEWORK_COMPONENTS
      : FRAMEWORK_COMPONENTS_FINISH_OFFER;
    this.statusBar = this.drawerTable
      ? STATUS_BAR_CONFIG
      : STATUS_BAR_CONFIG_FINISH_OFFER;
  }
}
