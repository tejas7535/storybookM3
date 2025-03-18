import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  OnDestroy,
} from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';

import { IStatusPanelAngularComp } from 'ag-grid-angular';
import { GridApi, IStatusPanelParams } from 'ag-grid-community';

import { SharedTranslocoModule } from '@schaeffler/transloco';

import { SharedModule } from '../../../shared.module';

@Component({
  selector: 'ia-excel-export-status-bar',
  imports: [
    SharedModule,
    SharedTranslocoModule,
    MatButtonModule,
    MatIconModule,
  ],
  templateUrl: './excel-export-status-bar.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  styles: [
    `
      :host {
        @apply mt-4 p-2;
      }
    `,
  ],
})
export class ExcelExportStatusBarComponent
  implements IStatusPanelAngularComp, OnDestroy
{
  api!: GridApi;
  disabled = true;

  constructor(private readonly ref: ChangeDetectorRef) {}

  agInit(params: IStatusPanelParams): void {
    this.api = params.api;
    this.api.addEventListener('rowDataUpdated', this.onGridReady.bind(this));
  }

  exportToExcel(): void {
    this.api.exportDataAsExcel();
  }

  onGridReady(): void {
    this.disabled = false;
    this.ref.markForCheck();
  }

  ngOnDestroy(): void {
    this.api.removeEventListener('rowDataUpdated', this.onGridReady);
  }
}
