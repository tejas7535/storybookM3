import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  ElementRef,
  Input,
  OnInit,
} from '@angular/core';

import { LabelValue, LabelValueModule } from '@schaeffler/label-value';
import { SharedTranslocoModule } from '@schaeffler/transloco';

import { CalculationResultReportInput } from '../../models/calculation-result-report-input.model';
import { MeaningfulRoundPipe } from '../../pipes/meaningful-round.pipe';
import { CatalogCalculationInputFormatterService } from '../../services/catalog-calculation-input-formatter.service';

export enum LabelWidth {
  Default = 180,
  Small = 110,
}

export const elementWidthSmall = 400;

@Component({
  selector: 'schaeffler-calculation-result-report-input-item',
  imports: [SharedTranslocoModule, LabelValueModule, MeaningfulRoundPipe],
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

  public constructor(
    private readonly elementRef: ElementRef,
    private readonly changeDetector: ChangeDetectorRef,
    private readonly catalogCalculationInputFormatterService: CatalogCalculationInputFormatterService
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
          value:
            this.catalogCalculationInputFormatterService.formatInputValue(
              subordinate
            ),
        }))
      : [];

  private readonly getLabel = (
    subordinate?: CalculationResultReportInput
  ): string =>
    `${subordinate?.designation || ''} ${this.getLabelAbbreviation(
      subordinate
    )}`;

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
