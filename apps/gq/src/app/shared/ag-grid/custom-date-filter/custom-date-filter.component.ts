import { Component } from '@angular/core';

import { IFilterAngularComp } from 'ag-grid-angular';
import {
  AgPromise,
  IAfterGuiAttachedParams,
  IDoesFilterPassParams,
  IFilterParams,
} from 'ag-grid-enterprise';
import { Moment } from 'moment';

@Component({
  selector: 'gq-custom-date-filter',
  templateUrl: './custom-date-filter.component.html',
  standalone: false,
})
export class CustomDateFilterComponent implements IFilterAngularComp {
  params: IFilterParams;
  compareMoment: Moment;

  agInit(params: IFilterParams): void {
    this.params = params;
  }

  // custom method for receiving filter value from floating filter component
  takeValueFromFloatingFilter(value: Moment) {
    this.compareMoment = value;

    this.params.filterChangedCallback();
  }

  // filtering will only apply if filter is active
  // filter icon will be displayed if true is returned
  isFilterActive(): boolean {
    return this.compareMoment !== undefined;
  }

  doesFilterPass(params: IDoesFilterPassParams): boolean {
    const cellDate = new Date(
      (params.data as any)[this.params.column.getColId()]
    );
    // always match on missing compareDate
    if (!this.compareMoment) {
      return true;
    }
    const compareDate = this.compareMoment.toDate();
    compareDate.setHours(0, 0, 0, 0);
    cellDate.setHours(0, 0, 0, 0);

    const parsedCompareDate = compareDate.getTime();
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
