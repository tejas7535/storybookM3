import { Component, Input } from '@angular/core';

import { LegendSquare } from '../../../../shared/models';

@Component({
  selector: 'ltp-legend',
  templateUrl: './legend.component.html',
  styleUrls: ['./legend.component.scss'],
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
