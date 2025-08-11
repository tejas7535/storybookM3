import { CommonModule } from '@angular/common';
import { Component, Input } from '@angular/core';

import { TagComponent } from '@schaeffler/tag';

import { HomepageCard } from '@ga/home/models';

@Component({
  selector: 'ga-homepage-card',
  templateUrl: './homepage-card.component.html',
  imports: [CommonModule, TagComponent],
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
