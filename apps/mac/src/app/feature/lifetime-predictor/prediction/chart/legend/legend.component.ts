import { Component, Input } from '@angular/core';

import { LegendSquare } from '../../../models';

@Component({
  selector: 'mac-ltp-legend',
  templateUrl: './legend.component.html',
})
export class LegendComponent {
  @Input() graphs: LegendSquare[];

  /**
   * Helps Angular to track array
   */
  public trackByFn(index: number): number {
    return index;
  }
}
