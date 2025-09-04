import { inject, Injectable } from '@angular/core';

import {
  Component,
  ListStyle,
  PdfComponentFactory,
} from '@schaeffler/pdf-generator';

import { GreasePdfMessage, GreasePdfReportModel } from '../../../models';
import { GreaseReportDataGeneratorService } from '../../grease-report-data-generator.service';

@Injectable({
  providedIn: 'root',
})
export class PdfMessagesService {
  private readonly componentFactory = inject(PdfComponentFactory);

  private readonly dataGeneratorService = inject(
    GreaseReportDataGeneratorService
  );

  public getMessagesSection(report: GreasePdfReportModel): Component[] {
    const data: GreasePdfMessage =
      this.dataGeneratorService.prepareReportErrorsAndWarningsData(report.data);

    if (data.messageItems.length === 0) {
      return [];
    }

    const heading = this.componentFactory.createSectionHeading(
      data.sectionTitle
    );

    const combinedList: string[] = data.messageItems.flatMap(
      (item) => item.items
    );

    combinedList.push(report.versions);

    const stringList = this.getReportMessagesSection(combinedList);

    return [heading, ...stringList];
  }

  getReportMessagesSection(messages: string[]): Component[] {
    const stringList = this.componentFactory.createStringList(
      messages,
      ListStyle.NONE
    );

    return [this.createCardWithComponents([stringList])];
  }

  private createCardWithComponents(components: Component[]): Component {
    return this.componentFactory.createCard(components);
  }
}
