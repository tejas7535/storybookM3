import {
  ChangeDetectionStrategy,
  Component,
  Input,
  OnInit,
} from '@angular/core';

import { TranslocoLocaleService } from '@ngneat/transloco-locale';

import { LabelValue } from '@schaeffler/label-value';

import { Subordinate } from '../../models';

@Component({
  selector: 'schaeffler-grease-report-input-item',
  templateUrl: './grease-report-input-item.component.html',
  styleUrls: ['./grease-report-input-item.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class GreaseReportInputItemComponent implements OnInit {
  @Input() public greaseReportInputItem!: Subordinate;

  public labelValues: LabelValue[] = [];

  public constructor(private readonly localeService: TranslocoLocaleService) {}

  public ngOnInit() {
    if (this.greaseReportInputItem) {
      this.assignLabelValues(this.greaseReportInputItem.subordinates);
    }
  }

  private assignLabelValues(subordinates?: Subordinate[]): void {
    this.labelValues = this.adaptLabelValuesFromSubordinates(subordinates);
  }

  private readonly adaptLabelValuesFromSubordinates = (
    subordinates?: Subordinate[]
  ): LabelValue[] =>
    subordinates && subordinates.length > 0
      ? subordinates.map((subordinate) => ({
          label: this.getLabel(subordinate),
          value: this.getValue(subordinate),
        }))
      : [];

  private readonly getLabel = (subordinate?: Subordinate): string =>
    `${subordinate?.designation || ''} ${this.getLabelAbbreviation(
      subordinate
    )}`;

  private readonly getValue = (subordinate?: Subordinate): string => {
    const unit = this.getUnit(subordinate);

    return unit
      ? `${this.localeService.localizeNumber(
          subordinate?.value || '',
          'decimal'
        )} ${subordinate?.unit || ''}`
      : subordinate?.value || '';
  };

  private readonly getUnit = (subordinate?: Subordinate): string =>
    subordinate?.unit || '';

  private readonly getLabelAbbreviation = (subordinate?: Subordinate): string =>
    subordinate?.abbreviation ? `(${subordinate?.abbreviation})` : '';
}
