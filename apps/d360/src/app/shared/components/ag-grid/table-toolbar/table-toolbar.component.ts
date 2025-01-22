import { Component, effect, inject, input } from '@angular/core';
import { MatButton } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';

import { translate } from '@jsverse/transloco';
import { TranslocoLocaleService } from '@jsverse/transloco-locale';
import { GridApi } from 'ag-grid-enterprise';

import { SharedTranslocoModule } from '@schaeffler/transloco';

import { showFloatingFilters } from '../../../ag-grid/grid-utils';

@Component({
  selector: 'd360-table-toolbar',
  standalone: true,
  imports: [MatIconModule, MatButton, SharedTranslocoModule],
  templateUrl: './table-toolbar.component.html',
  styleUrls: ['./table-toolbar.component.scss'],
})
export class TableToolbarComponent {
  public rowCount = input.required<number | undefined>();
  public grid = input.required<GridApi>();
  public renderFloatingFilter = input<boolean>(true);
  public openFloatingFilters = input<boolean>(false);
  public customOnResetFilters = input<() => void>(() =>
    this.grid()?.setFilterModel(null)
  );
  public customGetFilterCount = input<() => number>(() => {
    if (!this.grid()) {
      return 0;
    }

    return Object.keys(this.grid().getFilterModel()).length;
  });

  private readonly translocoLocaleService: TranslocoLocaleService = inject(
    TranslocoLocaleService
  );

  protected showFloatingFilters = false;

  public constructor() {
    effect(() => {
      this.showFloatingFilters = !this.openFloatingFilters();
      this.toggleFloatingFilter();
    });
  }

  protected toggleFloatingFilter() {
    this.showFloatingFilters = !this.showFloatingFilters;

    if (this.grid()) {
      showFloatingFilters(this.grid(), this.showFloatingFilters);
    }
  }

  protected onResetFilters(): void {
    this.customOnResetFilters()();
  }

  protected getFilterCount(): number {
    return this.customGetFilterCount()();
  }

  protected getFilterCountText(): string {
    return translate('table.toolbar.activeFilterCount', {
      count: this.translocoLocaleService.localizeNumber(
        this.getFilterCount(),
        'decimal'
      ),
    });
  }
}
