import { CommonModule } from '@angular/common';
import { Component, Input } from '@angular/core';
import { MatIconModule } from '@angular/material/icon';

import { Card } from '@ea/core/services/home/card.model';

import { SharedTranslocoModule } from '@schaeffler/transloco';

@Component({
  selector: 'ea-home-page-card',
  templateUrl: './home-page-card.component.html',
  imports: [CommonModule, SharedTranslocoModule, MatIconModule],
})
export class HomePageCardComponent {
  @Input() card: Card;

  public getCardImageUrl(): string {
    return this.card.imagePath;
  }

  public onCardClick(): void {
    this.card.action();
  }
}
