import { inject, Injectable } from '@angular/core';

import {
  Component,
  PdfComponentFactory,
  PdfLayoutService,
  PdfTableFactory,
} from '@schaeffler/pdf-generator';

import {
  GreasePdfInput,
  GreasePdfInputTable,
  GreasePdfReportModel,
} from '../../../models';
import { GreaseReportDataGeneratorService } from '../../grease-report-data-generator.service';

@Injectable({
  providedIn: 'root',
})
export class PdfInputsService {
  private readonly componentFactory = inject(PdfComponentFactory);
  private readonly tableFactory = inject(PdfTableFactory);
  private readonly layoutService = inject(PdfLayoutService);

  private readonly dataGeneratorService = inject(
    GreaseReportDataGeneratorService
  );

  getInputsSection(report: GreasePdfReportModel): Component[] {
    const data: GreasePdfInput =
      this.dataGeneratorService.prepareReportInputData(report.data);

    if (data.tableItems.length === 0) {
      return [];
    }

    const heading = this.componentFactory.createSectionHeading(
      data.sectionTitle
    );

    const inputTables = this.createInputTableComponents(data.tableItems);

    const layouts = this.layoutService.createTwoColumnLayouts(inputTables);

    return [heading, ...layouts];
  }

  private createInputTableComponents(inputTables: GreasePdfInputTable[]) {
    return inputTables
      .filter((tableData) => tableData.items?.length > 0)
      .map((tableData) =>
        this.tableFactory.createCompleteTable(tableData.items, tableData.title)
      );
  }
}
