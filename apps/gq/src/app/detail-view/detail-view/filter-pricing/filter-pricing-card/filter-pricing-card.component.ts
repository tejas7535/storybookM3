import { Component, EventEmitter, Input, Output } from '@angular/core';

@Component({
  selector: 'gq-filter-pricing-card',
  templateUrl: './filter-pricing-card.component.html',
  standalone: false,
})
export class FilterPricingCardComponent {
  @Input() title: string;
  @Input() isSelected: boolean;
  @Input() isDisabled: boolean;
  @Input() isLoading: boolean;

  @Output() readonly selectManualPrice = new EventEmitter();

  selectPrice(): void {
    this.selectManualPrice.emit();
  }
}
