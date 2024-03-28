import { ChangeDetectionStrategy, Component, Input } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';

import { Card } from '@ea/core/services/home/card.model';

import { SharedTranslocoModule } from '@schaeffler/transloco';

@Component({
  selector: 'ea-home-page-sustainability-card',
  templateUrl: './home-page-sustainability-card.component.html',
  standalone: true,
  imports: [MatIconModule, MatButtonModule, SharedTranslocoModule],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class HomePageSustainabilityCardComponent {
  @Input() card: Card;

  onCardClick(): void {
    this.card.action();
  }
}
