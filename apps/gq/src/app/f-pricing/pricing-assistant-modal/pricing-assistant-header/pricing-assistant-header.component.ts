import { Component, EventEmitter, Input, Output } from '@angular/core';

import { MaterialDetails } from '@gq/shared/models/quotation-detail/material';

@Component({
  selector: 'gq-pricing-assistant-header',
  templateUrl: './pricing-assistant-header.component.html',
  standalone: false,
})
export class PricingAssistantHeaderComponent {
  @Input() material: MaterialDetails;
  @Output() closeDialog = new EventEmitter<void>();
  @Output() showMore = new EventEmitter<void>();
}
