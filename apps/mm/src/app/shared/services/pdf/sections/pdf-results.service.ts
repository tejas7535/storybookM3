import { inject, Injectable } from '@angular/core';

import { TranslocoService } from '@jsverse/transloco';
import { ResultItem } from '@mm/core/store/models/calculation-result-state.model';

import {
  Component,
  PdfComponentFactory,
  PdfLayoutService,
  PdfTableFactory,
} from '@schaeffler/pdf-generator';

import { ResultDataService } from '../../result-data.service';

@Injectable()
export class PdfResultsService {
  private readonly tableFactory = inject(PdfTableFactory);
  private readonly layoutService = inject(PdfLayoutService);
  private readonly dataService = inject(ResultDataService);
  private readonly translocoService = inject(TranslocoService);
  private readonly componentFactory = inject(PdfComponentFactory);

  getHeading(): Component[] {
    return [
      this.componentFactory.createSectionHeading(
        this.translocoService.translate('pdf.resultsTitle')
      ),
    ];
  }

  getRadialClearanceSection(): Component[] {
    return this.createTwoColumnSection(
      () => this.dataService.radialClearance(),
      'reportResult.radialClearance',
      () => this.dataService.clearanceClasses(),
      'reportResult.clearanceClasses'
    );
  }

  getStartEndPositionsSection(): Component[] {
    const startEndPostionSection = this.createTwoColumnSection(
      () => this.dataService.startPositions(),
      'reportResult.startPositions',
      () => this.dataService.endPositions(),
      'reportResult.endPositions'
    );

    return startEndPostionSection;
  }

  private createTwoColumnSection(
    leftDataFn: () => ResultItem[] | null,
    leftTitleKey: string,
    rightDataFn: () => ResultItem[] | null,
    rightTitleKey: string
  ): Component[] {
    const leftTable = this.createResultTable(
      leftDataFn(),
      this.translocoService.translate(leftTitleKey)
    );

    const rightTable = this.createResultTable(
      rightDataFn(),
      this.translocoService.translate(rightTitleKey)
    );

    if (leftTable.length === 0 && rightTable.length === 0) {
      return [];
    }

    const layouts = this.layoutService.createTwoColumnLayoutsWithComponents(
      leftTable,
      rightTable
    );

    return layouts;
  }

  private createResultTable(
    items: ResultItem[] | null,
    title: string
  ): Component[] {
    if (!items || items.length === 0) {
      return [];
    }

    const data = this.formatResultItemData(items);
    const tableWithHeader = this.tableFactory.createCompleteTable(data, title);

    return [tableWithHeader];
  }

  private formatResultItemData(items: ResultItem[]): string[][] {
    return items.map((item) => [
      item.designation || '',
      this.formatValueWithUnit(item.value, item.unit),
    ]);
  }

  private formatValueWithUnit(value?: string, unit?: string): string {
    const formattedValue = value || '';

    if (!unit) {
      return formattedValue;
    }

    return `${formattedValue} ${unit}`;
  }
}
