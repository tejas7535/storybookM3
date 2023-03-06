import { Component, Input } from '@angular/core';

@Component({
  selector: 'gq-quotation-rating',
  templateUrl: './quotation-rating.component.html',
})
export class QuotationRatingComponent {
  @Input() rating: number;

  public trackByFn(index: number): number {
    return index;
  }
}
