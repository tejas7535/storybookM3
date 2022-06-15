import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  ElementRef,
  Input,
  OnDestroy,
  OnInit,
} from '@angular/core';

import { translate } from '@ngneat/transloco';

import { ApplicationInsightsService } from '@schaeffler/application-insights';
import { LabelValue } from '@schaeffler/label-value';

import {
  GreaseResult,
  GreaseResultDataItem,
  GreaseResultDataSourceItem,
} from '../../models/grease-result.model';
import { MEDIASGREASE } from '../../models';
import { adaptLabelValuesFromGreaseResultData } from '../helpers/grease-helpers';

export enum LabelWidth {
  Default = 200,
  Small = 120,
}

export const elementWidthSmall = 400;
export const shopSearchPathBase = 'search/searchpage?text=';

@Component({
  selector: 'schaeffler-grease-result',
  templateUrl: './grease-result.component.html',
  styleUrls: ['./grease-result.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class GreaseResultComponent implements OnInit, OnDestroy {
  @Input() public greaseResult!: GreaseResult;
  @Input() public valuesLimit = 3;

  public labelValues: LabelValue[] = [];
  public labelWidth: number = LabelWidth.Default;
  public small = false;

  public showAllValues = false;
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
    return `${translate('shopBaseUrl')}/${shopSearchPathBase}${
      this.greaseResult?.mainTitle
    }`;
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
