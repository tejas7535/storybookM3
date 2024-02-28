import { Component, EventEmitter, Input, Output } from '@angular/core';

@Component({
  selector: 'gq-price-button',
  templateUrl: './price-button.component.html',
})
export class PriceButtonComponent {
  @Input() isAddPriceButton = false;
  @Input() priceLabelKey: string;
  @Input() priceValue: number;
  @Input() currency: string;
  @Input() gpmValue: number;
  @Input() icon: string;
  @Input() iconColor: string;
  @Input() isSelected: boolean;
  @Input() isActiveInDialog = false;
  @Output() addPriceButtonClicked = new EventEmitter<void>();
  @Output() priceButtonClicked = new EventEmitter<void>();
}
