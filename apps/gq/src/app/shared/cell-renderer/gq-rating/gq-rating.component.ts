import { Component } from '@angular/core';

@Component({
  selector: 'gq-gq-rating',
  templateUrl: './gq-rating.component.html',
  styleUrls: ['./gq-rating.component.scss'],
})
export class GqRatingComponent {
  rating: number;

  agInit(params: any): void {
    this.rating = params.value;
  }
  public trackByFn(index: number): number {
    return index;
  }
}
