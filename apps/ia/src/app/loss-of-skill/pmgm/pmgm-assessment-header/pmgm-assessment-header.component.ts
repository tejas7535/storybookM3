import { Component } from '@angular/core';
import { MatIconModule } from '@angular/material/icon';
import { MatTooltipModule } from '@angular/material/tooltip';

import { IHeaderAngularComp } from 'ag-grid-angular';
import { IHeaderParams, SortDirection } from 'ag-grid-community';

import { SharedTranslocoModule } from '@schaeffler/transloco';

import { SharedModule } from '../../../shared/shared.module';

@Component({
  selector: 'ia-pmgm-assessment-header',
  standalone: true,
  imports: [
    SharedModule,
    MatIconModule,
    MatTooltipModule,
    SharedTranslocoModule,
  ],
  templateUrl: './pmgm-assessment-header.component.html',
})
export class PmgmAssessmentHeaderComponent implements IHeaderAngularComp {
  sort: SortDirection;
  displayName: string;
  params: IHeaderParams;

  agInit(params: IHeaderParams): void {
    this.params = params;
    this.displayName = params.displayName;

    params.column.addEventListener(
      'sortChanged',
      this.onSortChanged.bind(this)
    );
    this.sort = params.column.getSort() ?? this.sort;
  }

  refresh(): boolean {
    return false;
  }

  onSortChanged() {
    this.sort = this.params.column.getSort();
  }

  onSortRequested(event: MouseEvent) {
    let newSort: SortDirection;
    if (!this.sort) {
      newSort = 'asc';
    } else if (this.sort === 'asc') {
      newSort = 'desc';
    } else {
      // eslint-disable-next-line unicorn/no-null
      newSort = null;
    }

    this.params.setSort(newSort, event.shiftKey);
  }
}
