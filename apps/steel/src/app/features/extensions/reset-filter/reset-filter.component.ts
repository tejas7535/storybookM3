import { AfterViewInit, Component } from '@angular/core';

import { Filter, Worksheet } from '@tableau/extensions-api-types';

@Component({
  selector: 'schaeffler-reset-filter',
  templateUrl: './reset-filter.component.html',
  styleUrls: ['./reset-filter.component.scss']
})
export class ResetFilterComponent implements AfterViewInit {
  worksheets: Worksheet[];

  ngAfterViewInit(): void {
    this.getAllWorksheets();
  }

  getAllWorksheets(): void {
    tableau.extensions
      .initializeAsync()
      .then(
        () =>
          (this.worksheets =
            tableau.extensions.dashboardContent.dashboard.worksheets)
      )
      .catch((err: string) => {
        alert(err);
      });
  }

  async resetFilters(): Promise<any[]> {
    const promises: Promise<any>[] = [];
    this.worksheets.forEach((wsEntry: Worksheet) => {
      promises.push(
        wsEntry.getFiltersAsync().then((filters: Filter[]) => {
          filters.forEach((filter: Filter) => {
            wsEntry.clearFilterAsync(filter.fieldName);
          });
        })
      );
    });

    return Promise.all(promises);
  }
}
