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
import { ApprovalWorkflowInformation } from '@gq/shared/models';
import { Customer } from '@gq/shared/models/customer';
import {
  Quotation,
  QuotationPricingOverview,
  QuotationStatus,
} from '@gq/shared/models/quotation';
import { calculateDuration } from '@gq/shared/utils/misc.utils';
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
  dataLoadingComplete$: Observable<boolean>;

  readonly quotationStatus = QuotationStatus;

  private readonly shutDown$$: Subject<void> = new Subject();

  constructor(
    readonly approvalFacade: ApprovalFacade,
    private readonly store: Store
  ) {}

  ngOnInit(): void {
    this.requestApprovalData();
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

    this.dataLoadingComplete$ = combineLatest([
      this.approvalFacade.allApproversLoading$,
      this.approvalFacade.approvalCockpitLoading$,
    ]).pipe(
      takeUntil(this.shutDown$$),
      map(
        ([allApproversLoading, approvalInformationLoading]: [
          boolean,
          boolean
        ]) => !allApproversLoading && !approvalInformationLoading
      )
    );
  }

  /**
   * request ApprovalStatus
   */
  private requestApprovalData(): void {
    this.store
      .select(activeCaseFeature.selectQuotation)
      .pipe(
        takeUntil(this.shutDown$$),
        filter((quotation: Quotation) => !!quotation),
        map((quotation: Quotation) =>
          this.approvalFacade.getAllApprovalData(quotation.sapId)
        )
      )
      .subscribe();
  }

  /**
   * maps the general Information
   *
   * @returns Observable<{@link GeneralInformation}>
   */
  private mapGeneralInformation(): Observable<GeneralInformation> {
    return combineLatest([
      this.store.select(activeCaseFeature.selectQuotation),
      this.store.select(activeCaseFeature.selectCustomer),
      this.approvalFacade.requiredApprovalLevelsForQuotation$,
      this.approvalFacade.approvalCockpitInformation$,
    ]).pipe(
      takeUntil(this.shutDown$$),
      map(
        ([quotation, customer, approvalLevel, approvalGeneralInformation]: [
          Quotation,
          Customer,
          string,
          ApprovalWorkflowInformation
        ]) => ({
          approvalLevel,
          validityFrom: quotation.sapCreated,
          validityTo: quotation.validTo,
          duration: calculateDuration(quotation.sapCreated, quotation.validTo),
          projectInformation: approvalGeneralInformation.projectInformation,
          customer,
          requestedQuotationDate: quotation.sapQuotationToDate,
          comment: approvalGeneralInformation.comment,
        })
      )
    );
  }

  /**
   * retrieve pricing Information
   *
   * @returns Observable<{@link QuotationPricingOverview}>
   */
  private mapPricingInformation(): Observable<QuotationPricingOverview> {
    return combineLatest([
      this.approvalFacade.approvalCockpitInformation$,
      this.store.select(getQuotationOverviewInformation),
    ]).pipe(
      takeUntil(this.shutDown$$),
      map(
        ([approvalInformation, gqPricing]: [
          ApprovalWorkflowInformation,
          QuotationPricingOverview
        ]) => ({
          netValue: {
            value:
              approvalInformation.totalNetValue ?? gqPricing.netValue.value,
            warning:
              approvalInformation.totalNetValue &&
              approvalInformation.totalNetValue !== gqPricing.netValue.value,
          },
          avgGqRating: gqPricing.avgGqRating,
          gpi: gqPricing.gpi,
          gpm: {
            value: approvalInformation.gpm ?? gqPricing.gpm.value,
            warning:
              approvalInformation.gpm &&
              approvalInformation.gpm !== gqPricing.gpm.value,
          },
        })
      )
    );
  }
}
