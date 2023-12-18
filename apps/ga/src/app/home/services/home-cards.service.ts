import { Inject, Injectable } from '@angular/core';
import { Router } from '@angular/router';

import { map, Observable } from 'rxjs';

import { TranslocoService } from '@ngneat/transloco';

import { ApplicationInsightsService } from '@schaeffler/application-insights';

import { AppRoutePath } from '@ga/app-route-path.enum';
import { SettingsFacade } from '@ga/core/store';
import { Environment } from '@ga/environments/environment.model';
import { ENV } from '@ga/environments/environments.provider';
import {
  TRACKING_NAME_HOMECARD,
  UTM_PARAMS_DEFAULT,
} from '@ga/shared/constants';
import { PartnerVersion } from '@ga/shared/models';

import { HomepageCard } from '../models';
import { HomeCardsTrackingIds } from './home-cards-tracking-ids.enum';

@Injectable()
export class HomeCardsService {
  private readonly isProduction;
  private readonly translationKeyBase = 'homepage.cards';
  private readonly imagePathBase = 'assets/images/homepage/cards';

  constructor(
    private readonly settingsFacade: SettingsFacade,
    private readonly router: Router,
    private readonly translocoService: TranslocoService,
    private readonly applicationInsightsService: ApplicationInsightsService,
    @Inject(ENV) private readonly env: Environment
  ) {
    this.isProduction = this.env.production;
  }

  public getHomeCards(): Observable<HomepageCard[]> {
    return this.settingsFacade.partnerVersion$.pipe(
      map((partnerVersion) => this.mapToHomeCards(partnerVersion))
    );
  }

  private mapToHomeCards(partnerVersion: string): HomepageCard[] {
    return [
      {
        mainTitle: this.translateText('calculator.title.main'),
        subTitle: this.translateText('calculator.title.sub'),
        templateId: 'calculatorLogo',
        cardAction: this.createNavigationAction(
          AppRoutePath.GreaseCalculationPath,
          HomeCardsTrackingIds.GreaseCalculation
        ),
      },
      {
        mainTitle: this.translateText('greases.title.main'),
        subTitle: this.translateText('greases.title.sub'),
        templateId: 'imageCard',
        imagePath: this.getCardImageUrl('greases.jpg'),
        cardAction: this.getExternalLinkAction(
          'greases.externalLink',
          HomeCardsTrackingIds.Sources,
          UTM_PARAMS_DEFAULT
        ),
      },
      {
        mainTitle: this.translateText('lubricators.title.main'),
        templateId: 'imageCard',
        imagePath: this.getCardImageUrl('lubricators.jpg'),
        cardAction: this.getExternalLinkAction(
          'lubricators.externalLink',
          HomeCardsTrackingIds.LubricatorsLink,
          UTM_PARAMS_DEFAULT
        ),
      },
      {
        mainTitle: this.translateText('maintenance.title.main'),
        subTitle: this.translateText('maintenance.title.sub'),
        templateId: 'imageCard',
        imagePath: this.getCardImageUrl('maintenance.jpg'),
        cardAction: this.getExternalLinkAction(
          'maintenance.externalLink',
          HomeCardsTrackingIds.MaintenanceLink,
          UTM_PARAMS_DEFAULT
        ),
      },
      {
        mainTitle: this.translateText('optime.title.main'),
        templateId: 'imageCard',
        imagePath: this.getCardImageUrl('optime.jpg'),
        cardAction: this.getExternalLinkAction(
          'optime.externalLink',
          HomeCardsTrackingIds.OptimeLink,
          UTM_PARAMS_DEFAULT
        ),
      },
      {
        mainTitle: this.translateText('catalog.title.main'),
        templateId: 'imageCard',
        imagePath: this.getCardImageUrl('catalog.jpg'),
        cardAction: this.getExternalLinkAction(
          'catalog.externalLink',
          HomeCardsTrackingIds.CatalogLink,
          UTM_PARAMS_DEFAULT
        ),
      },
      {
        mainTitle: this.translateText('contact.title.main'),
        templateId: 'imageCard',
        imagePath: this.getCardImageUrl('contact.jpg'),
        cardAction: this.getSchaefflerExpertsCardAction(partnerVersion),
      },
      {
        mainTitle: this.translateText('faq.title.main'),
        templateId: 'imageCard',
        imagePath: this.getCardImageUrl('faq.jpg'),
        cardAction: this.getExternalLinkAction(
          'faq.externalLink',
          HomeCardsTrackingIds.FaqLink,
          UTM_PARAMS_DEFAULT
        ),
      },
    ];
  }

  private getSchaefflerExpertsCardAction(partnerVersion: string): () => void {
    if (partnerVersion === PartnerVersion.Schmeckthal) {
      return this.createSchmeckthalContactAction();
    }

    return this.getExternalLinkAction(
      'contact.externalLink',
      HomeCardsTrackingIds.ContactLink
    );
  }

  private getCardImageUrl(imagePath: string): string {
    return `${this.imagePathBase}/${imagePath}`;
  }

  private translateText(translationKey: string): string {
    return this.translocoService.translate(`homepage.cards.${translationKey}`);
  }

  private createSchmeckthalContactAction(): () => void {
    return (): void => {
      this.logCardClick(HomeCardsTrackingIds.ContactLink);
      window.open(
        'mailto:technik@schmeckthal-gruppe.de?subject=Schmeckthal Grease App Anfrage',
        '_blank'
      );
    };
  }

  private createNavigationAction(
    navigationPath: string,
    trackingId: HomeCardsTrackingIds
  ): () => void {
    return (): void => {
      this.logCardClick(trackingId);

      this.router.navigate([navigationPath]);
    };
  }

  private getExternalLinkAction(
    externalLink: string,
    trackingId: HomeCardsTrackingIds,
    utmParameters?: string
  ): () => void {
    return (): void => {
      this.logCardClick(trackingId);

      const externalLinkUrl = this.getExternalLinkUrl(
        externalLink,
        utmParameters
      );
      window.open(externalLinkUrl, '_blank');
    };
  }

  private logCardClick(trackingId: HomeCardsTrackingIds): void {
    this.applicationInsightsService.logEvent(TRACKING_NAME_HOMECARD, {
      card: trackingId,
    });
  }

  private getExternalLinkUrl(
    externalLink: string,
    utmParameters?: string
  ): string {
    let url = this.translocoService.translate(
      `${this.translationKeyBase}.${externalLink}`
    );

    if (this.isProduction && utmParameters) {
      url += `?${utmParameters}`;
    }

    return url;
  }
}
