import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';

import { BehaviorSubject } from 'rxjs';

import { IToolPanelAngularComp } from 'ag-grid-angular';
import { ColDef, IToolPanelParams } from 'ag-grid-community';

import { SharedTranslocoModule } from '@schaeffler/transloco';

import { FilterComponent } from '@cdba/shared/components/filter/filter.component';

import { getVisibleColumns } from '../../column-utils';

@Component({
  selector: 'cdba-navigate-columns-panel',
  imports: [CommonModule, FilterComponent, SharedTranslocoModule],
  templateUrl: './navigate-columns-panel.component.html',
  styleUrls: ['./navigate-columns-panel.component.scss'],
})
export class NavigateColumnsPanelComponent implements IToolPanelAngularComp {
  private params: IToolPanelParams;
  filterInput = '';

  invariantVisibleColumns: ColDef[] = [];

  visibleColDefsSubject = new BehaviorSubject<ColDef[]>([]);
  visibleColDefs$ = this.visibleColDefsSubject.asObservable();

  agInit(params: IToolPanelParams): void {
    this.params = params;

    this.params.api.addEventListener('gridReady', () => {
      this.updateView();
    });

    this.params.api.addEventListener('columnVisible', () => {
      this.updateView();
    });
  }

  updateView() {
    this.filterInput = '';

    this.invariantVisibleColumns = getVisibleColumns(
      this.params.api.getColumnDefs()
    );

    this.visibleColDefsSubject.next(this.invariantVisibleColumns);
  }

  onNavigate(colDef: ColDef): void {
    this.params.api.ensureColumnVisible(colDef.colId, 'middle');

    this.params.api.flashCells({ columns: [colDef.colId] });
  }

  onFilter(value: string): void {
    if (value === '') {
      this.visibleColDefsSubject.next(this.invariantVisibleColumns);

      return;
    }

    const filteredColDefs = this.invariantVisibleColumns.filter((colDef) =>
      colDef.headerName.toLowerCase().includes(value.toLowerCase())
    );

    this.visibleColDefsSubject.next(filteredColDefs);
  }

  refresh(): void {}
}
