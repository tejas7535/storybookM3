import { inject, Injectable } from '@angular/core';

import { TranslocoService } from '@jsverse/transloco';
import {
  PumpItem,
  ResultItem,
} from '@mm/core/store/models/calculation-result-state.model';
import {
  BadgeConfig,
  BadgePosition,
} from '@mm/shared/components/pdf/building-blocks';
import { MountingToolCardContent } from '@mm/shared/components/pdf/cards-content';
import { SleeveConnectorCardContent } from '@mm/shared/components/pdf/cards-content/sleeve-connector-card-content';
import { PdfProductQrLinkService } from '@mm/shared/services/pdf/pdf-product-qr-link.service';

import {
  Component,
  Link,
  PdfCardComponent,
  PdfComponentFactory,
} from '@schaeffler/pdf-generator';

/**
 * Factory service for creating PDF card components used in the application.
 */
@Injectable()
export class PdfCardFactory {
  private readonly componentFactory = inject(PdfComponentFactory);
  private readonly translocoService = inject(TranslocoService);
  private readonly qrCodeProviderService = inject(PdfProductQrLinkService);

  createMountingToolCard(
    item: PumpItem,
    leftColumnWidth: number,
    imageDataBase64: string,
    badge?: BadgeConfig
  ): PdfCardComponent {
    const title = item.field;
    const value = item.value;

    return this.createPdfCard(
      title,
      value,
      imageDataBase64,
      leftColumnWidth,
      badge
    );
  }

  createLockNutCard(
    item: ResultItem,
    imageDataBase64: string
  ): PdfCardComponent {
    return this.createResultItemCard(item, imageDataBase64, 0.18);
  }

  createAdditionalToolsCard(
    item: ResultItem,
    imageDataBase64: string
  ): PdfCardComponent {
    return this.createResultItemCard(item, imageDataBase64, 0.31);
  }

  createSleeveConnectorCard(
    item: ResultItem,
    rightResultItem: ResultItem
  ): PdfCardComponent {
    const link = this.getLink(item.value);
    const cardContent = new SleeveConnectorCardContent(
      item.designation,
      item.value,
      rightResultItem.designation,
      rightResultItem.value,
      link
    );

    return this.createCard(cardContent);
  }

  createRecommendedBadge(position: BadgePosition = 'top-right'): BadgeConfig {
    return {
      textValue: this.translate('reportResult.pumps.recommended'),
      style: 'recommended',
      position,
    };
  }

  createAlternativeBadge(position: BadgePosition = 'above-title'): BadgeConfig {
    return {
      textValue: this.translate('reportResult.pumps.alternative'),
      style: 'alternative',
      position,
    };
  }

  private createResultItemCard(
    item: ResultItem,
    imageDataBase64: string,
    leftColumnWidth: number
  ): PdfCardComponent {
    const title = item.designation;
    const value = item.value;

    return this.createPdfCard(title, value, imageDataBase64, leftColumnWidth);
  }

  private createPdfCard(
    title: string,
    value: string,
    imageDataBase64: string,
    leftColumnWidth: number,
    badge?: BadgeConfig
  ): PdfCardComponent {
    const link = this.getLink(value);

    const cardContent = new MountingToolCardContent(
      title,
      value,
      link,
      imageDataBase64,
      badge,
      {
        leftColumnWidth,
      }
    );

    return this.createCard(cardContent);
  }

  private getLink(value: string): Link {
    return this.qrCodeProviderService.getLink(value);
  }

  private translate(key: string): string {
    return this.translocoService.translate(key);
  }

  // eslint-disable-next-line @typescript-eslint/member-ordering
  public createCard(content: Component): PdfCardComponent {
    return this.componentFactory.createSingleComponentCard(content, {
      keepTogether: true,
    });
  }
}
