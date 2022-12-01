import { CommonModule } from '@angular/common';
import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  ElementRef,
  Input,
  OnDestroy,
  OnInit,
} from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatTooltipModule } from '@angular/material/tooltip';

import { translate } from '@ngneat/transloco';

import { ApplicationInsightsService } from '@schaeffler/application-insights';
import { LabelValue, LabelValueModule } from '@schaeffler/label-value';
import { SharedTranslocoModule } from '@schaeffler/transloco';

import { alternativeTable, generalHighTemperature } from '@ga/shared/constants';

import { MEDIASGREASE } from '../../constants';
import {
  adaptLabelValuesFromGreaseResultData,
  greaseLinkText,
  greaseShopQuery,
} from '../../helpers/grease-helpers';
import {
  CONCEPT1,
  GreaseConcep1Suitablity,
  GreaseResult,
  GreaseResultDataItem,
  GreaseResultDataSourceItem,
  PreferredGreaseResult,
  SUITABILITY_LABEL,
} from '../../models';
import { AutomaticLubricationPipe } from '../../pipes';
import { GreaseReportConcept1Component } from '../grease-report-concept1';
import { GreaseReportConcept1DetailComponent } from '../grease-report-concept1-detail';

export enum LabelWidth {
  Default = 200,
  Small = 120,
}

export const elementWidthSmall = 400;
export const shopSearchPathBase = 'search/searchpage?text=';

@Component({
  selector: 'ga-grease-report-result',
  standalone: true,
  imports: [
    CommonModule,
    SharedTranslocoModule,
    MatButtonModule,
    MatIconModule,
    MatTooltipModule,
    LabelValueModule,
    GreaseReportConcept1Component,
    GreaseReportConcept1DetailComponent,
    AutomaticLubricationPipe,
  ],
  templateUrl: './grease-report-result.component.html',
  styleUrls: ['./grease-report-result.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class GreaseReportResultComponent implements OnInit, OnDestroy {
  @Input() public greaseResult!: GreaseResult;
  @Input() public valuesLimit = 3;
  @Input() public preferredGreaseResult: PreferredGreaseResult;
  @Input() public automaticLubrication = false;

  public labelValues: LabelValue[] = [];
  public labelWidth: number = LabelWidth.Default;
  public small = false;
  public concept1 = CONCEPT1;

  public showAllValues = false;
  public showConcept1Details = false;
  private readonly htmlElement!: HTMLElement;
  private observer!: ResizeObserver;

  public constructor(
    private readonly applicationInsightsService: ApplicationInsightsService,
    private readonly elementRef: ElementRef,
    private readonly changeDetector: ChangeDetectorRef
  ) {
    this.htmlElement = this.elementRef.nativeElement;
  }

  public ngOnInit() {
    this.assignGreaseResultData();

    this.observer = new ResizeObserver((entries) => {
      const width = entries[0].contentRect.width;

      this.adjustLabelWidth(width);
    });

    this.observer.observe(this.htmlElement);
  }

  public ngOnDestroy(): void {
    if (this.observer) {
      this.observer.unobserve(this.htmlElement);
    }
  }

  public getShopUrl(): string {
    return `${translate(
      'calculationResult.shopBaseUrl'
    )}/${shopSearchPathBase}${greaseShopQuery(this.greaseResult?.mainTitle)}`;
  }

  public getLinkText(): string {
    return greaseLinkText(this.greaseResult?.mainTitle);
  }

  public toggleShowValues(): void {
    this.showAllValues = !this.showAllValues;

    this.assignGreaseResultData();
  }

  public trackGreaseSelection(): void {
    this.applicationInsightsService.logEvent(MEDIASGREASE, {
      grease: this.greaseResult?.mainTitle,
    });
  }

  public getLabel(): SUITABILITY_LABEL {
    return this.greaseResult.dataSource[0].custom.data.label;
  }

  public isSuited(): boolean {
    return (
      this.greaseResult.dataSource[0].custom.data.label ===
      SUITABILITY_LABEL.SUITED
    );
  }

  public isUnSuited(): boolean {
    return (
      this.greaseResult.dataSource[0].custom.data.label ===
      SUITABILITY_LABEL.UNSUITED
    );
  }

  public toggleShowConcept1Details(): void {
    this.showConcept1Details = !this.showConcept1Details;
  }

  public getSettings(labelValues: LabelValue[]): GreaseConcep1Suitablity {
    return labelValues.find(({ custom }) => !!custom)?.custom.data;
  }

  public showSubtitle(): string {
    let subtitle = this.greaseResult.subTitle;
    if (
      this.preferredGreaseResult?.text === generalHighTemperature.name &&
      !this.greaseResult.isPreferred
    ) {
      subtitle += `<br/>(${translate('calculationResult.compatibilityCheck')})`;
    }

    return subtitle;
  }

  public isAlternative(): boolean {
    return (
      alternativeTable
        .find(({ name }) => name === this.preferredGreaseResult.text)
        ?.alternatives.indexOf(this.greaseResult.mainTitle) > -1
    );
  }

  private assignGreaseResultData(): void {
    const adaptedData = adaptLabelValuesFromGreaseResultData(
      this.removeEmptyItems(this.greaseResult?.dataSource)
    );

    this.labelValues = this.showAllValues
      ? adaptedData
      : adaptedData.slice(0, this.valuesLimit);
  }

  private readonly removeEmptyItems = (items: GreaseResultDataSourceItem[]) =>
    items?.filter((item): item is GreaseResultDataItem => !!item);

  private adjustLabelWidth(elementWidth: number): void {
    this.labelWidth =
      elementWidth < elementWidthSmall ? LabelWidth.Small : LabelWidth.Default;

    this.changeDetector.detectChanges();
  }
}
