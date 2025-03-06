import { CommonModule } from '@angular/common';
import { Component, Input } from '@angular/core';

import { HomepageCard } from '@hc/models';

@Component({
  selector: 'hc-homepage-card',
  templateUrl: './homepage-card.component.html',
  imports: [CommonModule],
})
export class HomepageCardComponent {
  @Input() homepageCard: HomepageCard;

  public onCardClick(): void {
    this.homepageCard.cardAction();
  }
}
