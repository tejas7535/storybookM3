import { Component, Input } from '@angular/core';

import { FilterItemRange } from '../../../core/store/reducers/search/models';

@Component({
  selector: 'cdba-range-filter',
  templateUrl: './range-filter.component.html',
})
export class RangeFilterComponent {
  @Input() filter: FilterItemRange;
}
