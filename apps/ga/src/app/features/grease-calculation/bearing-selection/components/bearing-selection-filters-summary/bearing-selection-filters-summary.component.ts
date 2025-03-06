import { Component, Input } from '@angular/core';

import { AdvancedBearingSelectionFilters } from '@ga/shared/models';

@Component({
  selector: 'ga-bearing-selection-filters-summary',
  templateUrl: './bearing-selection-filters-summary.component.html',
  standalone: false,
})
export class BearingSelectionFiltersSummaryComponent {
  @Input()
  public advancedBearingSelectionFilters: AdvancedBearingSelectionFilters;
}
