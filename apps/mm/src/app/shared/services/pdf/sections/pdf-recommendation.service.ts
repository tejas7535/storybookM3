import { inject, Injectable } from '@angular/core';

import { TranslocoService } from '@jsverse/transloco';
import { ListStyle } from '@mm/shared/components/pdf/string-list/string-list';

import { Component, PdfComponentFactory } from '@schaeffler/pdf-generator';

import { ResultDataService } from '../../result-data.service';

@Injectable()
export class PdfRecommendationService {
  private readonly componentFactory = inject(PdfComponentFactory);
  private readonly dataService = inject(ResultDataService);
  private readonly translocoService = inject(TranslocoService);

  getInstructionsHeading(): Component[] {
    return [
      this.componentFactory.createSectionHeading(
        this.translocoService.translate('reportResult.mountingInstructions')
      ),
    ];
  }

  getMountingRecommendationSection(): Component[] {
    const mountingRecommendations =
      this.dataService.mountingRecommendations() ?? [];

    const stringList = this.componentFactory.createStringList(
      mountingRecommendations,
      ListStyle.NUMBERED
    );

    return [this.createCardWithComponents([stringList])];
  }

  getReportMessagesHeading(): Component[] {
    return [
      this.componentFactory.createSectionHeading(
        this.translocoService.translate(
          'reportResult.reportSelection.reportMessages'
        )
      ),
    ];
  }

  getReportMessagesSection(): Component[] {
    const messages = this.dataService.messages() ?? [];

    const stringList = this.componentFactory.createStringList(
      messages,
      ListStyle.NONE
    );

    return [this.createCardWithComponents([stringList])];
  }

  private createCardWithComponents(components: any[]): Component {
    return this.componentFactory.createCard(components);
  }
}
