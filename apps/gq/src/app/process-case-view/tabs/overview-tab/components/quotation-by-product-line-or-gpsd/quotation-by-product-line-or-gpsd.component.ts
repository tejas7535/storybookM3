import { Component, inject, OnDestroy, OnInit } from '@angular/core';

import {
  combineLatest,
  forkJoin,
  map,
  NEVER,
  Observable,
  Subject,
  switchMap,
  takeUntil,
} from 'rxjs';

import {
  getQuotationDetails,
  getQuotationDetailsByGPSD,
  getQuotationDetailsByPL,
} from '@gq/core/store/active-case/active-case.selectors';
import { QuotationDetailsSummaryKpi } from '@gq/shared/models/quotation/quotation-details-summary-kpi.model';
import { QuotationDetail } from '@gq/shared/models/quotation-detail';
import { CalculationService } from '@gq/shared/services/rest/calculation/calculation.service';
import { TransformationService } from '@gq/shared/services/transformation/transformation.service';
import { quotationDetailsToRequestData } from '@gq/shared/utils/pricing.utils';
import { Store } from '@ngrx/store';

import { BarChartData, ChartType } from '../../models';

@Component({
  selector: 'gq-quotation-by-product-line-or-gpsd',
  templateUrl: './quotation-by-product-line-or-gpsd.component.html',
  styleUrls: ['./quotation-by-product-line-or-gpsd.component.scss'],
  standalone: false,
})
export class QuotationByProductLineOrGpsdComponent
  implements OnInit, OnDestroy
{
  private readonly shutdown$$: Subject<void> = new Subject<void>();

  private readonly store = inject(Store);
  private readonly transformationService = inject(TransformationService);
  private readonly calculationService = inject(CalculationService);

  readonly chartType = ChartType;
  type = ChartType.GPSD;

  selectedChartType: ChartType = ChartType.PL;
  gpsdBarChartData$: Observable<BarChartData[]> = NEVER;

  plBarChartData$: Observable<BarChartData[]> = NEVER;

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
      switchMap(
        ([all, gpsd]: [QuotationDetail[], Map<string, QuotationDetail[]>]) =>
          this.calculateBarChartData(gpsd, all)
      )
    );

    this.plBarChartData$ = combineLatest([
      allQuotationDetails$,
      plQuotationDetails$,
    ]).pipe(
      takeUntil(this.shutdown$$),
      switchMap(
        ([all, pl]: [QuotationDetail[], Map<string, QuotationDetail[]>]) =>
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
  ): Observable<BarChartData[]> {
    const all$ = this.calculationService.getQuotationKpiCalculation(
      quotationDetailsToRequestData(all)
    );

    const groupedCalculations$ = [...list.entries()].map(
      ([key, groupedDetails]) =>
        this.calculationService
          .getQuotationKpiCalculation(
            quotationDetailsToRequestData(groupedDetails)
          )
          .pipe(
            map((calc) => ({
              key,
              calc,
            }))
          )
    );

    return forkJoin([all$, ...groupedCalculations$]).pipe(
      map(([totalValues, ...groupedCalculations]) => {
        const result = groupedCalculations.map(({ key, calc }) => {
          const barItem: BarChartData = {
            name: labelPrefix ? `${labelPrefix} ${key}` : key,
            gpm: this.transformationService.transformPercentage(
              calc.totalWeightedAverageGpm
            ),
            value: calc.totalNetValue,
            share: this.calculateShare(calc, totalValues),
            numberOfItems: list.get(key)?.length ?? 0,
          };

          return barItem;
        });

        return result.sort((a, b) => b.share.localeCompare(a.share));
      })
    );
  }

  /**
   * calculates the percentage share of the group
   *
   * @param shares calculated StatusBarProperties of group
   * @param totals calculated StatusBarProperties of all quotationDetails
   * @returns the percentage share of netValue considering netValue of all quotationItems
   */
  private calculateShare(
    shares: QuotationDetailsSummaryKpi,
    totals: QuotationDetailsSummaryKpi
  ): string {
    return this.transformationService.transformPercentage(
      (shares.totalNetValue * 100) / totals.totalNetValue
    );
  }
}
