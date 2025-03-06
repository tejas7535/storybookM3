import { Component } from '@angular/core';

import { CellClassParams } from 'ag-grid-enterprise';

@Component({
  selector: 'gq-gq-rating',
  templateUrl: './gq-rating.component.html',
  styleUrls: ['./gq-rating.component.scss'],
  standalone: false,
})
export class GqRatingComponent {
  rating: number;

  agInit(params: CellClassParams): void {
    this.rating = params.value;
  }
}
