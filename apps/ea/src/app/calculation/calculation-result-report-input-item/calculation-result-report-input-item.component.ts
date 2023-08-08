import { CommonModule } from '@angular/common';
import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  ElementRef,
  Input,
  OnInit,
} from '@angular/core';

import { CalculationResultReportInput } from '@ea/core/store/models';
import { MeaningfulRoundPipe } from '@ea/shared/pipes/meaningful-round.pipe';
import { TranslocoLocaleService } from '@ngneat/transloco-locale';

import { LabelValue, LabelValueModule } from '@schaeffler/label-value';
import { SharedTranslocoModule } from '@schaeffler/transloco';

export enum LabelWidth {
  Default = 180,
  Small = 110,
}

export const elementWidthSmall = 400;

@Component({
  selector: 'ea-calculation-result-report-input-item',
  standalone: true,
  imports: [CommonModule, SharedTranslocoModule, LabelValueModule],
  templateUrl: './calculation-result-report-input-item.component.html',
  styleUrls: ['./calculation-result-report-input-item.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CalculationResultReportInputItemComponent implements OnInit {
  @Input() public reportInputItem!: CalculationResultReportInput;

  public labelValues: LabelValue[] = [];
  public labelWidth: number = LabelWidth.Default;

  private readonly htmlElement!: HTMLElement;
  private observer!: ResizeObserver;
  private readonly meaningFulRoundPipe = new MeaningfulRoundPipe(
    this.localeService.getLocale()
  );

  public constructor(
    private readonly localeService: TranslocoLocaleService,
    private readonly elementRef: ElementRef,
    private readonly changeDetector: ChangeDetectorRef
  ) {
    this.htmlElement = this.elementRef.nativeElement;
  }

  public ngOnInit() {
    if (this.reportInputItem) {
      this.assignLabelValues(this.reportInputItem.subItems);
    }

    this.observer = new ResizeObserver((entries) => {
      const width = entries[0].contentRect.width;

      this.adjustLabelWidth(width);
    });

    this.observer.observe(this.htmlElement);
  }

  private assignLabelValues(
    subordinates?: CalculationResultReportInput[]
  ): void {
    this.labelValues = this.adaptLabelValuesFromSubordinates(subordinates);
  }

  private readonly adaptLabelValuesFromSubordinates = (
    subordinates?: CalculationResultReportInput[]
  ): LabelValue[] =>
    subordinates && subordinates.length > 0
      ? subordinates.map((subordinate) => ({
          label: this.getLabel(subordinate),
          value: this.getValue(subordinate),
        }))
      : [];

  private readonly getLabel = (
    subordinate?: CalculationResultReportInput
  ): string =>
    `${subordinate?.designation || ''} ${this.getLabelAbbreviation(
      subordinate
    )}`;

  private readonly getValue = (
    subordinate?: CalculationResultReportInput
  ): string => {
    const unit = this.getUnit(subordinate);

    if (this.reportInputItem.meaningfulRound || subordinate.meaningfulRound) {
      return `${this.meaningFulRoundPipe.transform(
        subordinate?.value
      )} ${unit}`.trim();
    }

    const localizedNumberString = this.localeService.localizeNumber(
      subordinate?.value || '',
      'decimal'
    );

    // return original if we couldn't transform to number (e.g. because input was a string after all)
    if (!localizedNumberString) {
      return (subordinate?.value || '').trim();
    }

    return `${localizedNumberString} ${unit}`.trim();
  };

  private readonly getUnit = (
    subordinate?: CalculationResultReportInput
  ): string => subordinate?.unit || '';

  private readonly getLabelAbbreviation = (
    subordinate?: CalculationResultReportInput
  ): string =>
    subordinate?.abbreviation ? `(${subordinate?.abbreviation})` : '';

  private adjustLabelWidth(elementWidth: number): void {
    this.labelWidth =
      elementWidth < elementWidthSmall ? LabelWidth.Small : LabelWidth.Default;

    this.changeDetector.detectChanges();
  }
}
