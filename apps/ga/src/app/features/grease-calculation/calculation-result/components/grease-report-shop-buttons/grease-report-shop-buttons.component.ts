import {
  ChangeDetectionStrategy,
  Component,
  Input,
  OnInit,
} from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule, MatIconRegistry } from '@angular/material/icon';
import { MatRadioModule } from '@angular/material/radio';
import { MatTooltipModule } from '@angular/material/tooltip';
import { DomSanitizer } from '@angular/platform-browser';

import { translate } from '@jsverse/transloco';

import { ApplicationInsightsService } from '@schaeffler/application-insights';
import { RotaryControlComponent } from '@schaeffler/controls';
import { SharedTranslocoModule } from '@schaeffler/transloco';

import { PartnerAfiliateCode, PartnerVersion } from '@ga/shared/models';
import { EmbeddedGoogleAnalyticsService } from '@ga/shared/services';

import { MEDIASGREASE } from '../../constants';
import {
  concept1InShop,
  concept1ShopQuery,
  greaseLinkText,
  greaseShopQuery,
  isGreaseUnSuited,
  shortTitle,
} from '../../helpers/grease-helpers';
import {
  CONCEPT1,
  CONCEPT1_SIZES,
  GreaseConcep1Suitablity,
  GreaseResult,
} from '../../models';

@Component({
  selector: 'ga-grease-report-shop-buttons',
  standalone: true,
  imports: [
    SharedTranslocoModule,
    FormsModule,
    MatButtonModule,
    MatTooltipModule,
    MatIconModule,
    MatRadioModule,
    RotaryControlComponent,
  ],
  templateUrl: './grease-report-shop-buttons.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class GreaseReportShopButtonsComponent implements OnInit {
  @Input() public greaseResult: GreaseResult;
  @Input() public settings: GreaseConcep1Suitablity;
  @Input() public showConcept1Button = false;
  @Input() partnerVersion?: `${PartnerVersion}`;

  public concept1Selection: CONCEPT1_SIZES;
  public concept1UnSuitable = false;

  public constructor(
    private readonly applicationInsightsService: ApplicationInsightsService,
    private readonly matIconRegistry: MatIconRegistry,
    private readonly domSanitizer: DomSanitizer,
    private readonly embeddedGoogleAnalyticsService: EmbeddedGoogleAnalyticsService
  ) {
    this.matIconRegistry.addSvgIcon(
      'concept1',
      this.domSanitizer.bypassSecurityTrustResourceUrl(
        'assets/images/concept1.svg'
      )
    );
  }

  ngOnInit(): void {
    this.concept1UnSuitable = isGreaseUnSuited(this.settings?.label);
    this.concept1Selection = this.settings?.c1_125
      ? CONCEPT1_SIZES['125ML']
      : CONCEPT1_SIZES['60ML'];
  }

  public getShortTitle(): string {
    return shortTitle(this.greaseResult?.mainTitle);
  }

  public getConcept1InShop(): string {
    return concept1InShop(this.greaseResult?.mainTitle, this.concept1Selection);
  }

  public getConcept1ShopUrl(): string {
    const affiliateCode = this.getPatnerVersionAffiliateCode();

    return `${translate('calculationResult.shopBaseUrl')}/p/${concept1ShopQuery(
      this.greaseResult?.mainTitle,
      this.concept1Selection
    )}?utm_source=grease-app${affiliateCode}`;
  }

  public trackConcept1Selection(): void {
    this.embeddedGoogleAnalyticsService.logOpenExternalLinkEvent(
      `${CONCEPT1} ${this.getShortTitle()} ${this.concept1Selection}`
    );
    this.applicationInsightsService.logEvent(MEDIASGREASE, {
      grease: `${CONCEPT1} ${this.getShortTitle()} ${this.concept1Selection}`,
    });
  }

  public getShopUrl(): string {
    const affiliateCode = this.getPatnerVersionAffiliateCode();

    return `${translate('calculationResult.shopBaseUrl')}/p/${greaseShopQuery(
      this.greaseResult?.mainTitle
    )}?utm_source=grease-app${affiliateCode}`;
  }

  public getLinkText(): string {
    return greaseLinkText(this.greaseResult?.mainTitle);
  }

  public trackGreaseSelection(): void {
    this.embeddedGoogleAnalyticsService.logOpenExternalLinkEvent(
      this.greaseResult?.mainTitle
    );
    this.applicationInsightsService.logEvent(MEDIASGREASE, {
      grease: this.greaseResult?.mainTitle,
    });
  }

  private getPatnerVersionAffiliateCode(): string {
    const code: string = PartnerAfiliateCode[this.partnerVersion];

    return code ? `&${code}` : '';
  }
}
