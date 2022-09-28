import { Component, Input } from '@angular/core';
import { Router } from '@angular/router';

import { translate } from '@ngneat/transloco';

import { ApplicationInsightsService } from '@schaeffler/application-insights';

import { environment } from '@ga/environments/environment';
import { HomepageCard } from '@ga/home/models';
import { TRACKING_NAME_HOMECARD } from '@ga/shared/constants';

@Component({
  selector: 'ga-homepage-card',
  templateUrl: './homepage-card.component.html',
})
export class HomepageCardComponent {
  @Input() homepageCard: HomepageCard;

  public translationKeyBase = 'homepage.cards';
  protected isProduction = environment.production;
  private readonly imagePathBase = 'assets/images/homepage/cards';

  constructor(
    private readonly applicationInsightsService: ApplicationInsightsService,
    public readonly router: Router
  ) {}

  public getCardImageUrl(): string {
    return `${this.imagePathBase}/${this.homepageCard?.imagePath}`;
  }

  public onCardClick(): void {
    this.logCardClick(this.homepageCard);
    this.handleNavigation(this.homepageCard);
  }

  private logCardClick(card: HomepageCard): void {
    this.applicationInsightsService.logEvent(TRACKING_NAME_HOMECARD, {
      card: card?.trackingId,
    });
  }

  private handleNavigation(card: HomepageCard): void {
    if (card?.externalLink) {
      window.open(this.getExternalLinkUrl(card), '_blank');
    } else if (card?.routerPath) {
      this.router.navigate([card.routerPath]);
    }
  }

  private getExternalLinkUrl(card: HomepageCard): string {
    let url = translate(`${this.translationKeyBase}.${card?.externalLink}`);

    if (this.isProduction && card?.utmParameters) {
      url += `?${card.utmParameters}`;
    }

    return url;
  }
}
