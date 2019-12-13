import { Component, Input } from '@angular/core';

import { SelectControl } from './select-control.model';

@Component({
  selector: 'ltp-select',
  templateUrl: './select.component.html'
})
export class SelectComponent {
  @Input() control: SelectControl;

  /**
   * Helps Angular to track array
   */
  public trackByFn(index): number {
    return index;
  }
}
