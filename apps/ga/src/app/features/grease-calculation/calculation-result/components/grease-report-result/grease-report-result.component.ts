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

import { translate } from '@jsverse/transloco';
import { PushPipe } from '@ngrx/component';

import { LabelValue, LabelValueModule } from '@schaeffler/label-value';
import { TagComponent } from '@schaeffler/tag';
import { SharedTranslocoModule } from '@schaeffler/transloco';

import { SettingsFacade } from '@ga/core/store';
import { generalHighTemperature } from '@ga/shared/constants';
import { AppAnalyticsService } from '@ga/shared/services/app-analytics-service/app-analytics-service';
import { InteractionEventType } from '@ga/shared/services/app-analytics-service/interaction-event-type.enum';

import { adaptLabelValuesFromGreaseResultData } from '../../helpers/grease-helpers';
import {
  CONCEPT1,
  GreaseConcep1Suitablity,
  GreaseResult,
  GreaseResultDataItem,
  GreaseResultDataSourceItem,
  PreferredGreaseResult,
} from '../../models';
import { AutomaticLubricationPipe } from '../../pipes';
import { GreaseReportConcept1Component } from '../grease-report-concept1';
import { GreaseReportConcept1DetailComponent } from '../grease-report-concept1-detail';
import { GreaseReportShopButtonsComponent } from '../grease-report-shop-buttons/grease-report-shop-buttons.component';

export enum LabelWidth {
  Default = 180,
  Small = 120,
}

export const elementWidthSmall = 400;
export const shopSearchPathBase = 'search/searchpage?text=';

@Component({
  selector: 'ga-grease-report-result',
  imports: [
    CommonModule,
    SharedTranslocoModule,
    MatButtonModule,
    MatIconModule,
    MatTooltipModule,
    LabelValueModule,
    GreaseReportConcept1Component,
    GreaseReportConcept1DetailComponent,
    GreaseReportShopButtonsComponent,
    AutomaticLubricationPipe,
    PushPipe,
    TagComponent,
  ],
  templateUrl: './grease-report-result.component.html',
  styleUrls: ['./grease-report-result.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class GreaseReportResultComponent implements OnInit, OnDestroy {
  private readonly htmlElement!: HTMLElement;

  @Input() public greaseResult!: GreaseResult;
  @Input() public valuesLimit = 4;
  @Input() public preferredGreaseResult: PreferredGreaseResult;
  @Input() public automaticLubrication = false;

  public partnerVersion$ = this.settingsFacade.partnerVersion$;

  public labelValues: LabelValue[] = [];
  public labelWidth: number = LabelWidth.Default;
  public small = false;
  public concept1 = CONCEPT1;

  public showAllValues = false;
  public showConcept1Details = false;
  private observer!: ResizeObserver;

  public constructor(
    private readonly elementRef: ElementRef,
    private readonly changeDetector: ChangeDetectorRef,
    private readonly appAnalyticsService: AppAnalyticsService,
    private readonly settingsFacade: SettingsFacade
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

  public toggleShowValues(): void {
    this.showAllValues = !this.showAllValues;

    this.appAnalyticsService.logInteractionEvent(
      InteractionEventType.ShowAllValues
    );
    this.assignGreaseResultData();
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
