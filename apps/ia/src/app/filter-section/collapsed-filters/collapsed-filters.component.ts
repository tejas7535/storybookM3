import { ChangeDetectionStrategy, Component, Input } from '@angular/core';

@Component({
  selector: 'ia-collapsed-filters',
  templateUrl: './collapsed-filters.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  styles: ['::ng-deep {--mat-expansion-header-text-size: 16px;}'],
})
export class CollapsedFiltersComponent {
  private _filters: {
    timeRange: string;
    value: string;
  };

  @Input() set filters(filters: { timeRange: string; value: string }) {
    this._filters = filters;
  }

  get filters() {
    return this._filters;
  }
}
