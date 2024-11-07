import { Component, Input, OnDestroy, OnInit } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatTooltipModule } from '@angular/material/tooltip';

import { Subscription } from 'rxjs';

import { TranslocoService } from '@jsverse/transloco';
import { PushPipe } from '@ngrx/component';
import { Store } from '@ngrx/store';
import { GridApi } from 'ag-grid-community';

import { SharedTranslocoModule } from '@schaeffler/transloco';

import { exportBoms } from '@cdba/core/store';
import {
  getBomExportLoading,
  getSelectedRefTypeNodeIds,
} from '@cdba/core/store/selectors/search/search.selector';
import { ReferenceTypeIdentifier } from '@cdba/shared/models';

@Component({
  selector: 'cdba-bom-export-button',
  templateUrl: './bom-export-button.component.html',
  standalone: true,
  imports: [MatButtonModule, MatTooltipModule, SharedTranslocoModule, PushPipe],
})
export class BomExportButtonComponent implements OnInit, OnDestroy {
  selectedNodeIds: string[] = [];
  tooltip: string;

  selectedNodeIds$ = this.store.select(getSelectedRefTypeNodeIds);
  isLoading$ = this.store.select(getBomExportLoading);

  private selectedNodeIdsSubscription = new Subscription();
  private isLoadingSubscription = new Subscription();
  private _gridApi: GridApi;
  private _disabled: boolean;

  public constructor(
    private readonly store: Store,
    private readonly transloco: TranslocoService
  ) {}

  get gridApi(): GridApi {
    return this._gridApi;
  }

  @Input()
  set gridApi(gridApi: GridApi) {
    this._gridApi = gridApi;
  }

  get disabled(): boolean {
    return this._disabled;
  }

  @Input() set disabled(disabled: boolean) {
    this._disabled = disabled;
  }

  ngOnInit(): void {
    this.tooltip = this.transloco.translate(
      'search.bomExport.tooltips.default'
    );

    this.selectedNodeIdsSubscription = this.selectedNodeIds$.subscribe(
      (selectedNodeIds) => (this.selectedNodeIds = selectedNodeIds)
    );

    this.isLoadingSubscription = this.isLoading$.subscribe((isLoading) => {
      this.showOrHideOverlay(isLoading);
    });
  }

  ngOnDestroy(): void {
    this.selectedNodeIdsSubscription.unsubscribe();
    this.isLoadingSubscription.unsubscribe();
  }

  onClick(): void {
    const identifiers: ReferenceTypeIdentifier[] = [];

    this.selectedNodeIds.forEach((nodeId) => {
      const rowValue = this.gridApi.getRowNode(nodeId);

      if (rowValue) {
        let materialNumber = rowValue.data.materialNumber as string;
        materialNumber = materialNumber.replace('-', '');
        const plant = rowValue.data.plant;

        identifiers.push(new ReferenceTypeIdentifier(materialNumber, plant));
      }
    });

    if (identifiers.length > 0) {
      this.store.dispatch(exportBoms({ identifiers }));
    }
  }

  private showOrHideOverlay(isLoading: boolean) {
    if (this.gridApi && isLoading) {
      this.gridApi.showLoadingOverlay();
    } else {
      this.gridApi.hideOverlay();
    }
  }
}
