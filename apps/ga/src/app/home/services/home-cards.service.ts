import { computed, inject, Injectable } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { Router } from '@angular/router';

import { TranslocoService } from '@jsverse/transloco';

import { ApplicationInsightsService } from '@schaeffler/application-insights';

import { AppRoutePath } from '@ga/app-route-path.enum';
import { SettingsFacade } from '@ga/core/store';
import { ENV } from '@ga/environments/environments.provider';
import { ViCalculatorService } from '@ga/features/vi-calculator/services/vi-calculator.service';
import {
  TRACKING_NAME_HOMECARD,
  UTM_PARAMS_DEFAULT,
} from '@ga/shared/constants';
import { PartnerAffiliateCode, PartnerVersion } from '@ga/shared/models';

import { HomepageCard } from '../models';
import { HomeCardsTrackingIds } from './home-cards-tracking-ids.enum';

@Injectable({
  providedIn: 'root',
})
export class HomeCardsService {
  private readonly imagePathBase = 'assets/images/homepage/cards';

  private readonly settingsFacade = inject(SettingsFacade);

  private readonly translocoService = inject(TranslocoService);
  private readonly applicationInsightsService = inject(
    ApplicationInsightsService
  );

  private readonly viCalculatorService = inject(ViCalculatorService);

  private readonly router = inject(Router);

  private readonly env = inject(ENV);
  private readonly isProduction = this.env.production;

  public partnerVersion = toSignal(this.settingsFacade.partnerVersion$);

  private readonly vicMainTitle = toSignal(
    this.translocoService.selectTranslate('homepage.cards.vic.title.main')
  );
  private readonly vicTag = toSignal(
    this.translocoService.selectTranslate('homepage.cards.vic.tag')
  );
  private readonly greasesMainTitle = toSignal(
    this.translocoService.selectTranslate('homepage.cards.greases.title.main')
  );
  private readonly greasesSubTitle = toSignal(
    this.translocoService.selectTranslate('homepage.cards.greases.title.sub')
  );
  private readonly lubricatorsMainTitle = toSignal(
    this.translocoService.selectTranslate(
      'homepage.cards.lubricators.title.main'
    )
  );
  private readonly maintenanceMainTitle = toSignal(
    this.translocoService.selectTranslate(
      'homepage.cards.maintenance.title.main'
    )
  );
  private readonly maintenanceSubTitle = toSignal(
    this.translocoService.selectTranslate(
      'homepage.cards.maintenance.title.sub'
    )
  );
  private readonly optimeMainTitle = toSignal(
    this.translocoService.selectTranslate('homepage.cards.optime.title.main')
  );
  private readonly catalogMainTitle = toSignal(
    this.translocoService.selectTranslate('homepage.cards.catalog.title.main')
  );
  private readonly contactMainTitle = toSignal(
    this.translocoService.selectTranslate('homepage.cards.contact.title.main')
  );
  private readonly faqMainTitle = toSignal(
    this.translocoService.selectTranslate('homepage.cards.faq.title.main')
  );
  private readonly calculatorMainTitle = toSignal(
    this.translocoService.selectTranslate(
      'homepage.cards.calculator.title.main'
    )
  );
  private readonly calculatorSubTitle = toSignal(
    this.translocoService.selectTranslate('homepage.cards.calculator.title.sub')
  );

  public homeCards = computed(() => {
    const partnerVersion = this.partnerVersion();

    return this.mapToHomeCards(partnerVersion);
  });

  public contactExpertsAction = computed(() => {
    const partnerVersion = this.partnerVersion();

    return this.getSchaefflerExpertsCardAction(partnerVersion);
  });

  private mapToHomeCards(partnerVersion: `${PartnerVersion}`): HomepageCard[] {
    const affiliateCode = this.getPatnerVersionAffiliateCode(partnerVersion);

    return [
      ...(this.isProduction
        ? [
            {
              mainTitle: this.calculatorMainTitle(),
              subTitle: this.calculatorSubTitle(),
              templateId: 'calculatorLogo',
              cardAction: this.createNavigationAction(
                AppRoutePath.GreaseCalculationPath,
                HomeCardsTrackingIds.GreaseCalculation
              ),
            },
          ]
        : [
            {
              mainTitle: this.vicMainTitle(),
              templateId: 'badgeCard',
              imagePath: 'assets/images/icons/vc-icon.svg',
              additionalDescription: this.vicTag(),
              cardAction: this.createViCalculatorDialogAction(),
            },
          ]),
      {
        mainTitle: this.greasesMainTitle(),
        subTitle: this.greasesSubTitle(),
        templateId: 'imageCard',
        imagePath: this.getCardImageUrl('greases.jpg'),
        cardAction: this.getExternalLinkAction(
          'greases.externalLink',
          affiliateCode,
          HomeCardsTrackingIds.Sources
        ),
      },
      {
        mainTitle: this.lubricatorsMainTitle(),
        templateId: 'imageCard',
        imagePath: this.getCardImageUrl('lubricators.jpg'),
        cardAction: this.getExternalLinkAction(
          'lubricators.externalLink',
          affiliateCode,
          HomeCardsTrackingIds.LubricatorsLink
        ),
      },
      {
        mainTitle: this.maintenanceMainTitle(),
        subTitle: this.maintenanceSubTitle(),
        templateId: 'imageCard',
        imagePath: this.getCardImageUrl('maintenance.jpg'),
        cardAction: this.getExternalLinkAction(
          'maintenance.externalLink',
          affiliateCode,
          HomeCardsTrackingIds.MaintenanceLink
        ),
      },
      {
        mainTitle: this.optimeMainTitle(),
        templateId: 'imageCard',
        imagePath: this.getCardImageUrl('optime.jpg'),
        cardAction: this.getExternalLinkAction(
          'optime.externalLink',
          affiliateCode,
          HomeCardsTrackingIds.OptimeLink
        ),
      },
      {
        mainTitle: this.catalogMainTitle(),
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
        mainTitle: this.faqMainTitle(),
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

    return this.contactMainTitle();
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

  private createViCalculatorDialogAction(): () => void {
    return (): void => {
      this.logCardClick(HomeCardsTrackingIds.ViscosityCard);

      this.viCalculatorService.showViscosityIndexCalculator();
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
    const code: string = PartnerAffiliateCode[partnerVersion];

    return code ? `&${code}` : '';
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
}
