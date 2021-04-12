import { Component } from '@angular/core';

import { CellClassParams } from '@ag-grid-community/core';

@Component({
  selector: 'gq-gq-rating',
  templateUrl: './gq-rating.component.html',
  styleUrls: ['./gq-rating.component.scss'],
})
export class GqRatingComponent {
  rating: number;

  agInit(params: CellClassParams): void {
    this.rating = params.value;
  }
  public trackByFn(index: number): number {
    return index;
  }
}
