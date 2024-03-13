import { Injectable } from '@angular/core';

import { TranslocoLocaleService } from '@ngneat/transloco-locale';

import { CalculationResultReportInput } from '../store/models';

@Injectable({ providedIn: 'root' })
export class CatalogCalculationInputFormatterService {
  private readonly doNotFormat = [
    'Designation',
    'Bezeichnung',
    'Denominación',
    'Désignation',
    '型号',
  ];

  public constructor(private readonly localeService: TranslocoLocaleService) {}

  public formatInputValue(input: CalculationResultReportInput): string {
    const unit = this.getUnit(input);

    if (this.doNotFormat.includes(input.designation)) {
      return `${input?.value} ${unit}`.trim();
    }

    const localizedNumberString = this.localeService.localizeNumber(
      input?.value || '',
      'decimal'
    );

    // return original if we couldn't transform to number (e.g. because input was a string after all)
    if (!localizedNumberString) {
      return (input?.value || '').trim();
    }

    return `${localizedNumberString} ${unit}`.trim();
  }

  private getUnit(input: CalculationResultReportInput): string {
    return input?.unit || '';
  }
}
