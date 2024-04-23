import { Inject, Injectable } from '@angular/core';
import { Router } from '@angular/router';

import { map, Observable } from 'rxjs';

import { TranslocoService } from '@jsverse/transloco';

import { ApplicationInsightsService } from '@schaeffler/application-insights';

import { AppRoutePath } from '@ga/app-route-path.enum';
import { SettingsFacade } from '@ga/core/store';
import { Environment } from '@ga/environments/environment.model';
import { ENV } from '@ga/environments/environments.provider';
import {
  TRACKING_NAME_HOMECARD,
  UTM_PARAMS_DEFAULT,
} from '@ga/shared/constants';
import { PartnerAfiliateCode, PartnerVersion } from '@ga/shared/models';

import { HomepageCard } from '../models';
import { HomeCardsTrackingIds } from './home-cards-tracking-ids.enum';

@Injectable()
export class HomeCardsService {
  private readonly isProduction;
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

  private mapToHomeCards(partnerVersion: `${PartnerVersion}`): HomepageCard[] {
    const affiliateCode = this.getPatnerVersionAffiliateCode(partnerVersion);

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
          affiliateCode,
          HomeCardsTrackingIds.Sources
        ),
      },
      {
        mainTitle: this.translateText('lubricators.title.main'),
        templateId: 'imageCard',
        imagePath: this.getCardImageUrl('lubricators.jpg'),
        cardAction: this.getExternalLinkAction(
          'lubricators.externalLink',
          affiliateCode,
          HomeCardsTrackingIds.LubricatorsLink
        ),
      },
      {
        mainTitle: this.translateText('maintenance.title.main'),
        subTitle: this.translateText('maintenance.title.sub'),
        templateId: 'imageCard',
        imagePath: this.getCardImageUrl('maintenance.jpg'),
        cardAction: this.getExternalLinkAction(
          'maintenance.externalLink',
          affiliateCode,
          HomeCardsTrackingIds.MaintenanceLink
        ),
      },
      {
        mainTitle: this.translateText('optime.title.main'),
        templateId: 'imageCard',
        imagePath: this.getCardImageUrl('optime.jpg'),
        cardAction: this.getExternalLinkAction(
          'optime.externalLink',
          affiliateCode,
          HomeCardsTrackingIds.OptimeLink
        ),
      },
      {
        mainTitle: this.translateText('catalog.title.main'),
        templateId: 'imageCard',
        imagePath: this.getCardImageUrl('catalog.jpg'),
        cardAction: this.getExternalLinkAction(
          'catalog.externalLink',
          affiliateCode,
          HomeCardsTrackingIds.CatalogLink
        ),
      },
      {
        mainTitle: this.getSchaefflerExpertsCardTitle(partnerVersion),
        subTitle: this.getSchaefflerExpertsCardSubTitle(partnerVersion),
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
          affiliateCode,
          HomeCardsTrackingIds.FaqLink
        ),
      },
    ];
  }

  private getSchaefflerExpertsCardTitle(partnerVersion: string): string {
    const key = 'contact.title.main';
    if (this.isSchmeckthalVersion(partnerVersion)) {
      return this.translocoService.translate(
        `partnerVersion.${partnerVersion}.cards.${key}`
      );
    }

    return this.translateText(key);
  }

  private getSchaefflerExpertsCardSubTitle(partnerVersion: string): string {
    if (!this.isSchmeckthalVersion(partnerVersion)) {
      return undefined;
    }

    return this.translocoService.translate(
      `partnerVersion.${partnerVersion}.cards.contact.title.sub`
    );
  }

  private getSchaefflerExpertsCardAction(partnerVersion: string): () => void {
    if (this.isSchmeckthalVersion(partnerVersion)) {
      return this.createSchmeckthalContactAction();
    }

    return this.getDefaultContactLinkAction();
  }

  private isSchmeckthalVersion(partnerVersion: string): boolean {
    return partnerVersion === PartnerVersion.Schmeckthal;
  }

  private getDefaultContactLinkAction(): () => void {
    return (): void => {
      this.logCardClick(HomeCardsTrackingIds.ContactLink);

      const url = this.translateText('contact.externalLink');
      this.openLink(url);
    };
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
    affiliateCode: string,
    trackingId: HomeCardsTrackingIds
  ): () => void {
    return (): void => {
      this.logCardClick(trackingId);

      const externalLinkUrl = this.getExternalLinkUrl(
        externalLink,
        affiliateCode
      );

      this.openLink(externalLinkUrl);
    };
  }

  private logCardClick(trackingId: HomeCardsTrackingIds): void {
    this.applicationInsightsService.logEvent(TRACKING_NAME_HOMECARD, {
      card: trackingId,
    });
  }

  private openLink(link: string): void {
    window.open(link, '_blank');
  }

  private getExternalLinkUrl(
    externalLink: string,
    affiliateCode: string
  ): string {
    let url = this.translateText(externalLink);

    if (this.isProduction) {
      url += `?${UTM_PARAMS_DEFAULT}${affiliateCode}`;
    }

    return url;
  }

  private getPatnerVersionAffiliateCode(
    partnerVersion: `${PartnerVersion}`
  ): string {
    const code: string = PartnerAfiliateCode[partnerVersion];

    return code ? `&${code}` : '';
  }
}
