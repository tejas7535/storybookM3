import { Component, inject, OnDestroy, OnInit } from '@angular/core';

import {
  combineLatest,
  map,
  NEVER,
  Observable,
  Subject,
  takeUntil,
} from 'rxjs';

import { ActiveCaseFacade } from '@gq/core/store/active-case/active-case.facade';
import { activeCaseFeature } from '@gq/core/store/active-case/active-case.reducer';
import { getQuotationCurrency } from '@gq/core/store/active-case/active-case.selectors';
import { ApprovalFacade } from '@gq/core/store/approval/approval.facade';
import { RolesFacade } from '@gq/core/store/facades';
import { ApprovalWorkflowInformation } from '@gq/shared/models';
import { Customer } from '@gq/shared/models/customer';
import {
  Quotation,
  QuotationPricingOverview,
  QuotationStatus,
} from '@gq/shared/models/quotation';
import { QuotationDetailsSummaryKpi } from '@gq/shared/models/quotation/quotation-details-summary-kpi.model';
import { Rating } from '@gq/shared/models/rating.enum';
import { calculateDuration } from '@gq/shared/utils/misc.utils';
import { TranslocoLocaleService } from '@jsverse/transloco-locale';
import { Store } from '@ngrx/store';

import { GeneralInformation } from './models';

@Component({
  selector: 'gq-overview-tab',
  templateUrl: './overview-tab.component.html',
  standalone: false,
})
export class OverviewTabComponent implements OnInit, OnDestroy {
  private readonly approvalFacade = inject(ApprovalFacade);
  private readonly activeCaseFacade = inject(ActiveCaseFacade);
  private readonly rolesFacade = inject(RolesFacade);
  private readonly store = inject(Store);
  private readonly shutDown$$: Subject<void> = new Subject();
  protected translocoLocaleService = inject(TranslocoLocaleService);

  generalInformation$: Observable<GeneralInformation> = NEVER;
  pricingInformation$: Observable<QuotationPricingOverview> = NEVER;
  quotationCurrency$: Observable<string> = NEVER;

  dataLoading$ = combineLatest([
    this.approvalFacade.allApproversLoading$,
    this.approvalFacade.approvalCockpitLoading$,
    this.activeCaseFacade.attachmentsLoading$,
  ]).pipe(
    map(
      ([allApproversLoading, approvalCockpitLoading, attachmentsLoading]) =>
        allApproversLoading || approvalCockpitLoading || attachmentsLoading
    )
  );
  workflowInProgress$ = this.approvalFacade.workflowInProgress$;
  quotationFullyApproved$ = this.approvalFacade.quotationFullyApproved$;
  hasAnyApprovalEvent$ = this.approvalFacade.hasAnyApprovalEvent$;
  quotationAttachments$ = this.activeCaseFacade.quotationAttachments$;
  hasGpcRole$ = this.rolesFacade.userHasGPCRole$;
  hasSqvRole$ = this.rolesFacade.userHasSQVRole$;
  hasOfferTypeAccess$ = this.rolesFacade.userHasRegionWorldOrGreaterChinaRole$;

  readonly quotationStatus = QuotationStatus;

  ngOnInit(): void {
    this.approvalFacade.getApprovers();
    this.activeCaseFacade.getAllAttachments();
    this.initializeObservables();
  }

  ngOnDestroy(): void {
    this.shutDown$$.next();
    this.shutDown$$.complete();
  }

  getRating(value: number): Rating {
    if (!value) {
      return undefined;
    }

    if (value < 0.25) {
      return Rating.LOW;
    }

    if (value < 0.4) {
      return Rating.MEDIUM;
    }

    if (value >= 0.4) {
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
          ApprovalWorkflowInformation,
        ]) => ({
          approvalLevel,
          validityFrom: quotation.sapCreated,
          validityTo: quotation.validTo,
          duration: calculateDuration(
            quotation.sapCreated,
            quotation.validTo,
            this.translocoLocaleService.getLocale()
          ),
          projectInformation: approvalGeneralInformation.projectInformation,
          customer,
          requestedQuotationDate: quotation.sapQuotationToDate,
          comment: approvalGeneralInformation.comment,
          offerType: quotation.offerType,
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
      this.store.select(activeCaseFeature.getQuotationDetailsSummaryKpi),
    ]).pipe(
      takeUntil(this.shutDown$$),
      map(
        ([approvalInformation, kpiSummary]: [
          ApprovalWorkflowInformation,
          QuotationDetailsSummaryKpi,
        ]) => ({
          netValue: {
            value:
              approvalInformation.totalNetValue ?? kpiSummary.totalNetValue,
            warning:
              approvalInformation.totalNetValue &&
              approvalInformation.totalNetValue !== kpiSummary.totalNetValue,
          },
          netValueEur: approvalInformation.totalNetValueEur,
          currency: approvalInformation.currency,
          avgGqRating: {
            value: kpiSummary.avgGqRating,
          },
          gpi: {
            value: kpiSummary.totalWeightedAverageGpi,
          },
          gpm: {
            value:
              approvalInformation.gpm ?? kpiSummary.totalWeightedAverageGpm,
            warning:
              approvalInformation.gpm &&
              approvalInformation.gpm !== kpiSummary.totalWeightedAverageGpm,
          },
          deviation: {
            value:
              approvalInformation.priceDeviation ??
              kpiSummary.totalWeightedAveragePriceDiff,
            warning:
              // when zero is SAP Value and returned, it should be displayed and the warning shall be shown
              approvalInformation.priceDeviation !== null &&
              approvalInformation.priceDeviation !== undefined &&
              approvalInformation?.priceDeviation !==
                kpiSummary.totalWeightedAveragePriceDiff,
          },
        })
      )
    );
  }
}
