import { CommonModule } from '@angular/common';
import { Component, ElementRef, ViewChild } from '@angular/core';

import { IHeaderParams } from 'ag-grid-community';

import { SharedTranslocoModule } from '@schaeffler/transloco';

import { InfoIconModule } from '../../../components/info-icon/info-icon.module';

export type HeaderInfoIconComponentParams = IHeaderParams & {
  tooltipText: string;
};

@Component({
  standalone: true,
  imports: [InfoIconModule, SharedTranslocoModule, CommonModule],
  selector: 'gq-header-info-icon',
  templateUrl: './header-info-icon.component.html',
})
export class HeaderInfoIconComponent {
  public params!: HeaderInfoIconComponentParams;
  public sort: 'asc' | 'desc';

  @ViewChild('menuButton', { read: ElementRef }) public menuButton!: ElementRef;

  agInit(params: HeaderInfoIconComponentParams): void {
    this.params = params;
    params.column.addEventListener(
      'sortChanged',
      this.onSortChanged.bind(this)
    );
    this.onSortChanged();
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

  onMenuClicked(e: Event) {
    e.stopPropagation();
    e.preventDefault();

    this.params.showColumnMenu(this.menuButton.nativeElement);
  }

  refresh() {
    return false;
  }
}
