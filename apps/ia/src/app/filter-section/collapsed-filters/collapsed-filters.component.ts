import { ChangeDetectionStrategy, Component, Input } from '@angular/core';

@Component({
  selector: 'ia-collapsed-filters',
  templateUrl: './collapsed-filters.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CollapsedFiltersComponent {
  @Input() filters: (string | number)[];

  trackByFn(index: number): number {
    return index;
  }
}
