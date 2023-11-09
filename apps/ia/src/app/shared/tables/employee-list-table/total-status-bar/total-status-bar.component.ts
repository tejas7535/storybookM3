import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  OnDestroy,
} from '@angular/core';

import { IStatusPanelAngularComp } from 'ag-grid-angular';
import { IStatusPanelParams } from 'ag-grid-community';

import { SharedTranslocoModule } from '@schaeffler/transloco';

import { SharedModule } from '../../../shared.module';

@Component({
  selector: 'ia-total-status-bar',
  standalone: true,
  imports: [SharedModule, SharedTranslocoModule],
  templateUrl: './total-status-bar.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  styles: [
    `
      :host {
        @apply flex;
        @apply mt-4;
      }
    `,
  ],
})
export class TotalStatusBarComponent
  implements IStatusPanelAngularComp, OnDestroy
{
  // eslint-disable-next-line unicorn/no-null
  total: number | null = null;
  // eslint-disable-next-line unicorn/no-null
  filtered: number | null = null;
  params!: IStatusPanelParams;

  constructor(private readonly ref: ChangeDetectorRef) {}

  agInit(params: IStatusPanelParams): void {
    this.params = params;

    this.params.api.addEventListener(
      'rowDataUpdated',
      this.onRowDataUpdated.bind(this)
    );

    this.params.api.addEventListener(
      'filterChanged',
      this.onFilterChanged.bind(this)
    );
  }

  onRowDataUpdated(): void {
    this.total = this.params.api.getModel().getRowCount();
    this.ref.markForCheck();
  }

  onFilterChanged(): void {
    this.filtered = this.params.api.isAnyFilterPresent()
      ? this.params.api.getDisplayedRowCount()
      : undefined;
    this.ref.markForCheck();
  }

  ngOnDestroy(): void {
    this.params.api.removeEventListener(
      'rowDataUpdated',
      this.onRowDataUpdated
    );
    this.params.api.removeEventListener('filterChanged', this.onFilterChanged);
  }
}
