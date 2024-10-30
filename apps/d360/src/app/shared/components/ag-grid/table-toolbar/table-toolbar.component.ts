import { Component, Input } from '@angular/core';
import { MatButton } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';

import { GridApi } from 'ag-grid-community';

import { SharedTranslocoModule } from '@schaeffler/transloco';

import { showFloatingFilters } from '../../../ag-grid/grid-utils';

@Component({
  selector: 'app-table-toolbar',
  standalone: true,
  imports: [MatIconModule, MatButton, SharedTranslocoModule],
  templateUrl: './table-toolbar.component.html',
  styleUrls: ['./table-toolbar.component.scss'],
})
export class TableToolbarComponent {
  @Input() rowCount: number | undefined;
  @Input() grid: GridApi | undefined;

  showFloatingFilters = false;

  toggleFloatingFilter() {
    this.showFloatingFilters = !this.showFloatingFilters;

    if (this.grid) {
      showFloatingFilters(this.grid, this.showFloatingFilters);
    }
  }
}
