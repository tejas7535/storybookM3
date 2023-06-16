import { Component, OnDestroy, OnInit } from '@angular/core';

import {
  combineLatest,
  map,
  NEVER,
  Observable,
  Subject,
  takeUntil,
} from 'rxjs';

import {
  getQuotationDetails,
  getQuotationDetailsByGPSD,
  getQuotationDetailsByPL,
} from '@gq/core/store/active-case/active-case.selectors';
import { StatusBarProperties } from '@gq/shared/models';
import { QuotationDetail } from '@gq/shared/models/quotation-detail';
import { TransformationService } from '@gq/shared/services/transformation/transformation.service';
import { calculateStatusBarValues } from '@gq/shared/utils/pricing.utils';
import { Store } from '@ngrx/store';

import { BarChartData, ChartType } from '../../models';

@Component({
  selector: 'gq-quotation-by-product-line-or-gpsd',
  templateUrl: './quotation-by-product-line-or-gpsd.component.html',
  styleUrls: ['./quotation-by-product-line-or-gpsd.component.scss'],
})
export class QuotationByProductLineOrGpsdComponent
  implements OnInit, OnDestroy
{
  readonly chartType = ChartType;
  type = ChartType.GPSD;
  selectedChartType: ChartType = ChartType.PL;

  gpsdBarChartData$: Observable<BarChartData[]> = NEVER;
  plBarChartData$: Observable<BarChartData[]> = NEVER;

  private readonly shutdown$$: Subject<void> = new Subject<void>();
  constructor(
    private readonly store: Store,
    private readonly transformationService: TransformationService
  ) {}

  ngOnInit(): void {
    this.initObservables();
  }

  ngOnDestroy(): void {
    this.shutdown$$.next();
    this.shutdown$$.complete();
  }

  private initObservables(): void {
    const gpsdQuotationDetails$: Observable<Map<string, QuotationDetail[]>> =
      this.store.select(getQuotationDetailsByGPSD);

    const plQuotationDetails$: Observable<Map<string, QuotationDetail[]>> =
      this.store.select(getQuotationDetailsByPL);

    const allQuotationDetails$: Observable<QuotationDetail[]> =
      this.store.select(getQuotationDetails);

    this.gpsdBarChartData$ = combineLatest([
      allQuotationDetails$,
      gpsdQuotationDetails$,
    ]).pipe(
      takeUntil(this.shutdown$$),
      map(([all, gpsd]: [QuotationDetail[], Map<string, QuotationDetail[]>]) =>
        this.calculateBarChartData(gpsd, all)
      )
    );

    this.plBarChartData$ = combineLatest([
      allQuotationDetails$,
      plQuotationDetails$,
    ]).pipe(
      takeUntil(this.shutdown$$),
      map(([all, pl]: [QuotationDetail[], Map<string, QuotationDetail[]>]) =>
        this.calculateBarChartData(pl, all, 'PL')
      )
    );
  }

  /**
   * calculate the BarChartData of grouped QuotationDetails
   * @param list all quotationDetails grouped by GPSD or product Line
   * @param all all quotationDetails
   * @param labelPrefix optional label addition for the tooltip
   * @returns the calculated barChartData for displaying
   */
  private calculateBarChartData(
    list: Map<string, QuotationDetail[]>,
    all: QuotationDetail[],
    labelPrefix?: string
  ): BarChartData[] {
    const result: BarChartData[] = [];
    const totalValues = calculateStatusBarValues(all);
    list.forEach((groupedDetails, key) => {
      const calc = calculateStatusBarValues(groupedDetails);
      const barItem: BarChartData = {
        name: labelPrefix ? `${labelPrefix} ${key}` : key,
        gpm: this.transformationService.transformPercentage(calc.gpm),
        value: calc.netValue,
        share: this.calculateShare(calc, totalValues),
      };
      result.push(barItem);
    });

    return result.sort((a, b) => a.share.localeCompare(b.share));
  }

  /**
   * calculates the percentage share of the group
   *
   * @param shares calculated StatusBarProperties of group
   * @param totals calculated StatusBarProperties of all quotationDetails
   * @returns the percentage share of netValue considering netValue of all quotationItems
   */
  private calculateShare(
    shares: StatusBarProperties,
    totals: StatusBarProperties
  ): string {
    return this.transformationService.transformPercentage(
      (shares.netValue * 100) / totals.netValue
    );
  }
}
