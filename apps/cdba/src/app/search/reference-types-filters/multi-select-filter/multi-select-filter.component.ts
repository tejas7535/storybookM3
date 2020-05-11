import { Component, Input } from '@angular/core';
import { FormControl } from '@angular/forms';

import { FilterItemIdValue } from '../../../core/store/reducers/search/models';

@Component({
  selector: 'cdba-multi-select-filter',
  templateUrl: './multi-select-filter.component.html',
})
export class MultiSelectFilterComponent {
  @Input() filter: FilterItemIdValue;

  form = new FormControl();

  /**
   * Improves performance of ngFor.
   */
  public trackByFn(index: number, _item: any): number {
    return index;
  }
}
