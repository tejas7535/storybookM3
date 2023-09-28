import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
} from '@angular/core';

import { IStatusPanelAngularComp } from 'ag-grid-angular';
import { IStatusPanelParams } from 'ag-grid-community';

import { SharedTranslocoModule } from '@schaeffler/transloco';

import { SharedModule } from '../../../shared.module';

@Component({
  selector: 'ia-employee-list-status-bar',
  standalone: true,
  imports: [SharedModule, SharedTranslocoModule],
  templateUrl: './employee-list-status-bar.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class EmployeeListStatusBarComponent implements IStatusPanelAngularComp {
  // eslint-disable-next-line unicorn/no-null
  total: number | null = null;
  params!: IStatusPanelParams;

  constructor(private readonly ref: ChangeDetectorRef) {}

  agInit(params: IStatusPanelParams): void {
    this.params = params;

    this.params.api.addEventListener(
      'rowDataUpdated',
      this.onGridReady.bind(this)
    );
  }

  onGridReady() {
    this.total = this.params.api.getModel().getRowCount();
    this.ref.markForCheck();
  }
}
