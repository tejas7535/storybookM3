import { Component, Input } from '@angular/core';

@Component({
  selector: 'gq-star-rating',
  templateUrl: './star-rating.component.html',
})
export class StarRatingComponent {
  @Input() rating: number;
  @Input() iconClasses: string;
}
