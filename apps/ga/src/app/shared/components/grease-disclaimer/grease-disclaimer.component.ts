import { Component, inject } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';

import { SharedTranslocoModule } from '@schaeffler/transloco';

import { HomeCardsService } from '@ga/home/services/home-cards.service';

@Component({
  selector: 'ga-grease-disclaimer',
  templateUrl: './grease-disclaimer.component.html',
  imports: [SharedTranslocoModule, MatIconModule, MatButtonModule],
})
export class GreaseDisclaimerComponent {
  private readonly homeCardsService = inject(HomeCardsService);

  private readonly action = this.homeCardsService.contactExpertsAction();

  onContact() {
    this.action();
  }
}
