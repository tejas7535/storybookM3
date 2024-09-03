import { Component } from '@angular/core';
import { MatIconModule } from '@angular/material/icon';
import { MatTooltipModule } from '@angular/material/tooltip';

import { IHeaderAngularComp } from 'ag-grid-angular';
import { IHeaderParams } from 'ag-grid-community';

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
  sort: 'asc' | 'desc';
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
    if (this.params.column.isSortAscending()) {
      this.sort = 'asc';
    } else if (this.params.column.isSortDescending()) {
      this.sort = 'desc';
    } else {
      this.sort = undefined;
    }
  }

  onSortRequested(event: MouseEvent) {
    let newSort: 'asc' | 'desc';
    if (!this.sort) {
      newSort = 'asc';
    }

    if (this.sort === 'asc') {
      newSort = 'desc';
    }

    this.params.setSort(newSort, event.shiftKey);
  }
}
