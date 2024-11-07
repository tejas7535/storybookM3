import { Component, OnInit } from '@angular/core';

import { TranslocoService } from '@jsverse/transloco';
import { Store } from '@ngrx/store';
import { GridApi, IStatusPanelParams } from 'ag-grid-enterprise';

import { getBomExportLoading } from '@cdba/core/store/selectors/search/search.selector';

@Component({
  selector: 'cdba-results-status-bar',
  templateUrl: './results-status-bar.component.html',
  styleUrls: ['./results-status-bar.component.scss'],
})
export class ResultsStatusBarComponent implements OnInit {
  gridApi: GridApi;
  isBomExportLoading$ = this.store.select(getBomExportLoading);

  bomExportLoadingTooltip = '';

  public constructor(
    private readonly store: Store,
    private readonly transloco: TranslocoService
  ) {}

  ngOnInit(): void {
    this.bomExportLoadingTooltip = this.transloco.translate(
      'search.bomExport.tooltips.loading'
    );
  }

  agInit(params: IStatusPanelParams): void {
    this.gridApi = params.api;
  }
}
