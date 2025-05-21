import { computed, inject, Injectable } from '@angular/core';

import { TranslocoService } from '@jsverse/transloco';

import { Component } from '@schaeffler/pdf-generator';

import { ResultDataService } from '../../result-data.service';
import { PdfComponentFactory } from '../factories/pdf-component-factory.service';
import { PdfTableFactory } from '../factories/pdf-table-factory.service';
import { PdfLayoutService } from '../pdf-layout.service';

@Injectable()
export class PdfInputsService {
  readonly inputTables = computed(() =>
    this.dataService
      .inputs()
      .filter((input) => !!input.title)
      .map((input) => {
        const tableData =
          input.subItems?.map((subItem) => [
            subItem.designation || '',
            this.formatValueWithUnit(subItem.value, subItem.unit),
          ]) ?? [];

        return {
          title: input.title,
          data: tableData,
        };
      })
  );

  private readonly layoutService = inject(PdfLayoutService);
  private readonly componentFactory = inject(PdfComponentFactory);
  private readonly translocoService = inject(TranslocoService);
  private readonly tableFactory = inject(PdfTableFactory);
  private readonly dataService = inject(ResultDataService);

  getInputsSection(): Component[] {
    const inputTables = this.createInputTableComponents();

    if (inputTables.length === 0) {
      return [];
    }

    const heading = this.getHeading();
    const layouts = this.layoutService.createTwoColumnLayouts(inputTables);

    return [heading, ...layouts];
  }

  private getHeading(): Component {
    return this.componentFactory.createSectionHeading(
      this.translocoService.translate('pdf.inputsTitle')
    );
  }

  private createInputTableComponents() {
    return this.inputTables()
      .filter((tableData) => tableData.data?.length > 0)
      .map((tableData) =>
        this.tableFactory.createCompleteTable(tableData.data, tableData.title)
      );
  }

  private formatValueWithUnit(value?: string, unit?: string): string {
    const formattedValue = value || '';

    if (!unit) {
      return formattedValue;
    }

    return `${formattedValue} ${unit}`;
  }
}
