/* eslint-disable @typescript-eslint/no-unnecessary-type-arguments */
/* eslint-disable unused-imports/no-unused-vars */
import { Component } from '@angular/core';

import { IFilterAngularComp } from 'ag-grid-angular';
import {
  AgPromise,
  IAfterGuiAttachedParams,
  IDoesFilterPassParams,
  IFilterParams,
} from 'ag-grid-community';

@Component({
  selector: 'gq-custom-date-filter',
  templateUrl: './custom-date-filter.component.html',
})
export class CustomDateFilterComponent implements IFilterAngularComp {
  params: IFilterParams;
  compareDate: Date;

  agInit(params: IFilterParams): void {
    this.params = params;
  }

  // custom method for receiving filter value from floating filter component
  takeValueFromFloatingFilter(value: Date) {
    this.compareDate = value;

    this.params.filterChangedCallback();
  }

  // filtering will only apply if filter is active
  isFilterActive(): boolean {
    return true;
  }

  doesFilterPass(params: IDoesFilterPassParams): boolean {
    const cellDate = new Date(
      (params.data as any)[this.params.column.getColId()]
    );
    // always match on missing compareDate
    if (!this.compareDate) {
      return true;
    }

    this.compareDate.setHours(0, 0, 0, 0);
    cellDate.setHours(0, 0, 0, 0);

    const parsedCompareDate = this.compareDate.getTime();
    const parsedCellDate = cellDate.getTime();

    if (parsedCompareDate === parsedCellDate) {
      return true;
    }

    return false;
  }

  // required from the ag-grid the interface
  setModel(_model: any): void | AgPromise<void> {}
  onNewRowsLoaded?(): void {}
  onAnyFilterChanged?(): void {}
  getModelAsString?(_model: any): string {
    return '';
  }
  afterGuiAttached?(_params?: IAfterGuiAttachedParams): void {}
  getModel() {}
}
