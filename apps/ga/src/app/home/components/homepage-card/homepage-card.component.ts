import { CommonModule } from '@angular/common';
import { Component, Input } from '@angular/core';

import { TagComponent } from '@schaeffler/tag';

import { HomepageCard } from '@ga/home/models';
import { CalculatorLogoComponent } from '@ga/shared/components/calculator-logo/calculator-logo.component';

@Component({
  selector: 'ga-homepage-card',
  templateUrl: './homepage-card.component.html',
  imports: [CommonModule, TagComponent, CalculatorLogoComponent],
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
