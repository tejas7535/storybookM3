import { NgFor } from '@angular/common';
import { Component } from '@angular/core';
import { MatIconModule } from '@angular/material/icon';

import { Observable } from 'rxjs';

import { Card } from '@ea/core/services/home/card.model';
import { HomeCardsService } from '@ea/core/services/home/home-cards.service';
import { QualtricsInfoBannerComponent } from '@ea/shared/qualtrics-info-banner/qualtrics-info-banner.component';
import { PushPipe } from '@ngrx/component';

import { SharedTranslocoModule } from '@schaeffler/transloco';

import { HomePageCardComponent } from '../home-page-card/home-page-card.component';
import { HomePageSustainabilityCardComponent } from '../home-page-sustainability-card/home-page-sustainability-card.component';
import { QuickBearingSelectionComponent } from '../quick-bearing-selection';

@Component({
  selector: 'ea-home-page',
  templateUrl: './home-page.component.html',
  standalone: true,
  imports: [
    NgFor,
    HomePageCardComponent,
    PushPipe,
    SharedTranslocoModule,
    MatIconModule,
    QuickBearingSelectionComponent,
    HomePageSustainabilityCardComponent,
    QualtricsInfoBannerComponent,
  ],
})
export class HomePageComponent {
  public sustainbilityCard$ = this.homeCardsService.sustainabilityCard$;
  public homeCards$: Observable<Card[]> = this.homeCardsService.homeCards$;
  constructor(private readonly homeCardsService: HomeCardsService) {}
}
