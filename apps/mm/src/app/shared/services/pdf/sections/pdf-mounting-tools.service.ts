import { inject, Injectable } from '@angular/core';

import { TranslocoService } from '@jsverse/transloco';
import { ConditionalPageBreak } from '@mm/shared/components/pdf/conditional-page-break/conditional-page-break';

import {
  Component,
  PdfComponentFactory,
  PdfLayoutService,
} from '@schaeffler/pdf-generator';

import { ResultDataService } from '../../result-data.service';
import { PdfCardFactory } from '../factories/pdf-card-factory.service';
import { PdfImagesProviderService } from '../pdf-images-provider.service';

@Injectable()
export class PdfMountingToolsService {
  private readonly cardFactory = inject(PdfCardFactory);
  private readonly layoutService = inject(PdfLayoutService);
  private readonly dataService = inject(ResultDataService);
  private readonly componentFactory = inject(PdfComponentFactory);
  private readonly translocoService = inject(TranslocoService);
  private readonly pdfImagesProvider = inject(PdfImagesProviderService);

  getHeading(): Component[] {
    if (!this.dataService.hasMountingTools()) {
      return [];
    }

    return [
      this.componentFactory.createSectionHeading(
        this.translocoService.translate(
          'reportResult.mountingToolsAndUtilities'
        )
      ),
    ];
  }

  getLockNutSection(): Component[] {
    const nutItem = this.dataService.nutItem();
    if (!nutItem) {
      return [];
    }

    const image = this.pdfImagesProvider.getImageBase64(nutItem.value);

    return [this.cardFactory.createLockNutCard(nutItem, image)];
  }

  getRecommendedPumpSection(): Component[] {
    const pump = this.dataService.recommendedPump();
    if (!pump) {
      return [];
    }

    const title = this.componentFactory.createSectionHeading(
      this.translocoService.translate('reportResult.pumps.title')
    );

    const subHeading = this.componentFactory.createSectionSubHeading(
      this.dataService.pumpsTile()
    );

    const image = this.pdfImagesProvider.getImageBase64(pump.value);

    return [
      new ConditionalPageBreak(100),
      title,
      subHeading,
      this.cardFactory.createMountingToolCard(
        pump,
        0.18,
        image,
        this.cardFactory.createRecommendedBadge()
      ),
    ];
  }

  getAlternativePumpsSection(): Component[] {
    const alternativePumps = this.dataService.alternativePumps();
    if (!alternativePumps || alternativePumps.length === 0) {
      return [];
    }

    const pumpCards = alternativePumps.map((pump) => {
      const image = this.pdfImagesProvider.getImageBase64(pump.value);

      return this.cardFactory.createMountingToolCard(
        pump,
        0.31,
        image,
        this.cardFactory.createAlternativeBadge()
      );
    });

    const layouts = this.layoutService.createTwoColumnLayouts(pumpCards);

    return layouts;
  }

  getSleeveConnectorSection(): Component[] {
    const sleeveConnectors = this.dataService.sleeveConnectors();
    if (!sleeveConnectors || sleeveConnectors.length !== 2) {
      return [];
    }

    const heading = this.componentFactory.createSectionHeading(
      this.translocoService.translate('reportResult.sleeveConnectors')
    );

    return [
      heading,
      this.cardFactory.createSleeveConnectorCard(
        sleeveConnectors[0],
        sleeveConnectors[1]
      ),
    ];
  }

  getAdditionalToolsSection(): Component[] {
    const additionalTools = this.dataService.additionalTools();
    if (!additionalTools || additionalTools.length === 0) {
      return [];
    }

    const additionalToolsCards = additionalTools.map((item) => {
      const image = this.pdfImagesProvider.getImageBase64(item.value);

      return this.cardFactory.createAdditionalToolsCard(item, image);
    });

    const layouts =
      this.layoutService.createTwoColumnLayouts(additionalToolsCards);

    return [...layouts];
  }
}
