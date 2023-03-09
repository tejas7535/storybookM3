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
} from '@gq/core/store/selectors';
import { StatusBarProperties } from '@gq/shared/models';
import { QuotationDetail } from '@gq/shared/models/quotation-detail';
import { HelperService } from '@gq/shared/services/helper-service/helper-service.service';
import { PriceService } from '@gq/shared/services/price-service/price.service';
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
  public readonly chartType = ChartType;
  public type = ChartType.GPSD;
  public selectedChartType: ChartType = ChartType.PL;

  public gpsdBarChartData$: Observable<BarChartData[]> = NEVER;
  public plBarChartData$: Observable<BarChartData[]> = NEVER;

  private readonly shutdown$$: Subject<void> = new Subject<void>();
  constructor(
    private readonly store: Store,
    private readonly helperService: HelperService
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
        this.calculateBarChartData(pl, all)
      )
    );
  }

  /**
   * calculate the BarChartData of grouped QuotationDetails
   * @param list all quotationDetails grouped by GPSD or product Line
   * @param all all quotationDetails
   * @returns the calculated barChartData for displaying
   */
  private calculateBarChartData(
    list: Map<string, QuotationDetail[]>,
    all: QuotationDetail[]
  ): BarChartData[] {
    const result: BarChartData[] = [];
    const totalValues = PriceService.calculateStatusBarValues(all);
    list.forEach((groupedDetails, key) => {
      const calc = PriceService.calculateStatusBarValues(groupedDetails);
      const barItem: BarChartData = {
        name: key,
        gpm: this.helperService.transformPercentage(calc.gpm),
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
    return this.helperService.transformPercentage(
      (shares.netValue * 100) / totals.netValue
    );
  }
}
