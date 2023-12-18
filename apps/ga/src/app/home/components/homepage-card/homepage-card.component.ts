import { CommonModule } from '@angular/common';
import { Component, Input } from '@angular/core';

import { HomepageCard } from '@ga/home/models';
import { CalculatorLogoModule } from '@ga/shared/components/calculator-logo';

@Component({
  selector: 'ga-homepage-card',
  templateUrl: './homepage-card.component.html',
  standalone: true,
  imports: [CommonModule, CalculatorLogoModule],
})
export class HomepageCardComponent {
  @Input() homepageCard: HomepageCard;

  public getCardImageUrl(): string {
    return this.homepageCard.imagePath;
  }

  public onCardClick(): void {
    this.homepageCard.cardAction();
  }
}
