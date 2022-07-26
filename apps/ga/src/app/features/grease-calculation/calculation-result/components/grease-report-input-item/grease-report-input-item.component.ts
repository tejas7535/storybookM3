import { CommonModule } from '@angular/common';
import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  ElementRef,
  Input,
  OnInit,
} from '@angular/core';

import { TranslocoLocaleService } from '@ngneat/transloco-locale';

import { LabelValue, LabelValueModule } from '@schaeffler/label-value';
import { SharedTranslocoModule } from '@schaeffler/transloco';

import { GreaseReportSubordinate } from '../../models';

export enum LabelWidth {
  Default = 180,
  Small = 110,
}

export const elementWidthSmall = 400;

@Component({
  selector: 'ga-grease-report-input-item',
  standalone: true,
  imports: [CommonModule, SharedTranslocoModule, LabelValueModule],
  templateUrl: './grease-report-input-item.component.html',
  styleUrls: ['./grease-report-input-item.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class GreaseReportInputItemComponent implements OnInit {
  @Input() public greaseReportInputItem!: GreaseReportSubordinate;

  public labelValues: LabelValue[] = [];
  public labelWidth: number = LabelWidth.Default;

  private readonly htmlElement!: HTMLElement;
  private observer!: ResizeObserver;

  public constructor(
    private readonly localeService: TranslocoLocaleService,
    private readonly elementRef: ElementRef,
    private readonly changeDetector: ChangeDetectorRef
  ) {
    this.htmlElement = this.elementRef.nativeElement;
  }

  public ngOnInit() {
    if (this.greaseReportInputItem) {
      this.assignLabelValues(this.greaseReportInputItem.subordinates);
    }

    this.observer = new ResizeObserver((entries) => {
      const width = entries[0].contentRect.width;

      this.adjustLabelWidth(width);
    });

    this.observer.observe(this.htmlElement);
  }

  private assignLabelValues(subordinates?: GreaseReportSubordinate[]): void {
    this.labelValues = this.adaptLabelValuesFromSubordinates(subordinates);
  }

  private readonly adaptLabelValuesFromSubordinates = (
    subordinates?: GreaseReportSubordinate[]
  ): LabelValue[] =>
    subordinates && subordinates.length > 0
      ? subordinates.map((subordinate) => ({
          label: this.getLabel(subordinate),
          value: this.getValue(subordinate),
        }))
      : [];

  private readonly getLabel = (subordinate?: GreaseReportSubordinate): string =>
    `${subordinate?.designation || ''} ${this.getLabelAbbreviation(
      subordinate
    )}`;

  private readonly getValue = (
    subordinate?: GreaseReportSubordinate
  ): string => {
    const unit = this.getUnit(subordinate);

    return unit
      ? `${this.localeService.localizeNumber(
          subordinate?.value || '',
          'decimal'
        )} ${unit}`
      : subordinate?.value || '';
  };

  private readonly getUnit = (subordinate?: GreaseReportSubordinate): string =>
    subordinate?.unit || '';

  private readonly getLabelAbbreviation = (
    subordinate?: GreaseReportSubordinate
  ): string =>
    subordinate?.abbreviation ? `(${subordinate?.abbreviation})` : '';

  private adjustLabelWidth(elementWidth: number): void {
    this.labelWidth =
      elementWidth < elementWidthSmall ? LabelWidth.Small : LabelWidth.Default;

    this.changeDetector.detectChanges();
  }
}
