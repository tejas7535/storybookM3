import { Component, Input, OnInit } from '@angular/core';

import { Rating } from '@gq/shared/models/rating.enum';
import { getRatingText } from '@gq/shared/utils/misc.utils';

@Component({
  selector: 'gq-pricing-results',
  templateUrl: './pricing-results.component.html',
  standalone: false,
})
export class PricingResultsComponent implements OnInit {
  @Input() price: number;
  @Input() currency: string;
  @Input() gpm: number;
  @Input() confidence: Rating;

  ratingText: string;

  ngOnInit(): void {
    this.ratingText = getRatingText(this.confidence);
  }
}
