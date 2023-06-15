import { Component, OnDestroy, OnInit } from '@angular/core';

import {
  combineLatest,
  filter,
  map,
  NEVER,
  Observable,
  Subject,
  takeUntil,
} from 'rxjs';

import {
  activeCaseFeature,
  getQuotationCurrency,
  getQuotationOverviewInformation,
} from '@gq/core/store/active-case';
import { ApprovalFacade } from '@gq/core/store/approval/approval.facade';
import { Rating } from '@gq/shared/components/kpi-status-card/models/rating.enum';
import { Customer } from '@gq/shared/models/customer';
import {
  ApprovalStatus,
  Quotation,
  QuotationPricingOverview,
} from '@gq/shared/models/quotation';
import { Store } from '@ngrx/store';

import { GeneralInformation } from './models';

@Component({
  selector: 'gq-overview-tab',
  templateUrl: './overview-tab.component.html',
})
export class OverviewTabComponent implements OnInit, OnDestroy {
  generalInformation$: Observable<GeneralInformation> = NEVER;
  pricingInformation$: Observable<QuotationPricingOverview> = NEVER;
  quotationCurrency$: Observable<string> = NEVER;

  private readonly shutDown$$: Subject<void> = new Subject();

  constructor(
    readonly approvalFacade: ApprovalFacade,
    private readonly store: Store
  ) {}

  ngOnInit(): void {
    this.requestApprovalStatus();
    this.initializeObservables();
  }

  ngOnDestroy(): void {
    this.shutDown$$.next();
    this.shutDown$$.unsubscribe();
  }

  getRating(value: number): Rating {
    if (!value) {
      return undefined;
    }

    if (value < 25) {
      return Rating.LOW;
    }

    if (value < 40) {
      return Rating.MEDIUM;
    }

    if (value >= 40) {
      return Rating.GOOD;
    }

    return undefined;
  }

  private initializeObservables(): void {
    this.quotationCurrency$ = this.store.select(getQuotationCurrency);
    this.generalInformation$ = this.mapGeneralInformation();
    this.pricingInformation$ = this.mapPricingInformation();
  }

  /**
   * request ApprovalStatus
   */
  private requestApprovalStatus(): void {
    this.store
      .select(activeCaseFeature.selectQuotation)
      .pipe(
        takeUntil(this.shutDown$$),
        filter((quotation: Quotation) => !!quotation),
        map((quotation: Quotation) =>
          this.approvalFacade.getApprovalStatus(quotation.sapId)
        )
      )
      .subscribe();
  }

  /**
   *
   * @returns Observable<{@link GeneralInformation}>
   */
  private mapGeneralInformation(): Observable<GeneralInformation> {
    return combineLatest([
      this.store.select(activeCaseFeature.selectCustomer),
      this.approvalFacade.requiredApprovalLevelsForQuotation$,
    ]).pipe(
      takeUntil(this.shutDown$$),
      map(([customer, approvalLevel]: [Customer, string]) => {
        const info: GeneralInformation = {
          approvalLevel,
          validityFrom: '01/01/2023',
          validityTo: '12/31/2023',
          duration: '10 months',
          project: 'GSIM Project',
          projectInformation:
            'lorem ipsum lorem ipsum lorem ipsum lorem ipsum lorem ipsum lorem ipsum.',
          customer,
          requestedQuotationDate: '01/01/2024',
          comment:
            'lorem ipsum lorem ipsum lorem ipsum lorem ipsum lorem ipsum lorem ipsum.',
        };

        return info;
      })
    );
  }

  /**
   * retrieve pricing Information
   *
   * @returns Observable<{@link QuotationPricingOverview}>
   */
  private mapPricingInformation(): Observable<QuotationPricingOverview> {
    return combineLatest([
      this.approvalFacade.approvalStatus$,
      this.store.select(getQuotationOverviewInformation),
    ]).pipe(
      takeUntil(this.shutDown$$),
      map(
        ([approvalStatus, gqPricing]: [
          ApprovalStatus,
          QuotationPricingOverview
        ]) => ({
          netValue: {
            value: approvalStatus.totalNetValue ?? gqPricing.netValue.value,
            warning:
              approvalStatus.totalNetValue &&
              approvalStatus.totalNetValue !== gqPricing.netValue.value,
          },
          avgGqRating: gqPricing.avgGqRating,
          gpi: gqPricing.gpi,
          gpm: {
            value: approvalStatus.gpm ?? gqPricing.gpm.value,
            warning:
              approvalStatus.gpm && approvalStatus.gpm !== gqPricing.gpm.value,
          },
        })
      )
    );
  }
}
