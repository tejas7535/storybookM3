import { Component, EventEmitter, Input, Output } from '@angular/core';

import { MaterialDetails } from '@gq/shared/models/quotation-detail/material-details.model';

@Component({
  selector: 'gq-pricing-assistant-header',
  templateUrl: './pricing-assistant-header.component.html',
})
export class PricingAssistantHeaderComponent {
  @Input() material: MaterialDetails;
  @Output() closeDialog = new EventEmitter<void>();
  @Output() showMore = new EventEmitter<void>();
}
