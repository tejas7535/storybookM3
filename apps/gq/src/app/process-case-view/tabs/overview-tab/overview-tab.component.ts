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
import {
  getQuotationCurrency,
  getQuotationOverviewInformation,
} from '@gq/core/store/active-case/active-case.selectors';
import { ApprovalFacade } from '@gq/core/store/approval/approval.facade';
import { RolesFacade } from '@gq/core/store/facades';
import { ApprovalWorkflowInformation } from '@gq/shared/models';
import { Customer } from '@gq/shared/models/customer';
import {
  Quotation,
  QuotationPricingOverview,
  QuotationStatus,
} from '@gq/shared/models/quotation';
import { Rating } from '@gq/shared/models/rating.enum';
import { calculateDuration } from '@gq/shared/utils/misc.utils';
import { TranslocoLocaleService } from '@ngneat/transloco-locale';
import { Store } from '@ngrx/store';

import { GeneralInformation } from './models';

@Component({
  selector: 'gq-overview-tab',
  templateUrl: './overview-tab.component.html',
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

  allApproversLoading$ = this.approvalFacade.allApproversLoading$;
  workflowInProgress$ = this.approvalFacade.workflowInProgress$;
  quotationFullyApproved$ = this.approvalFacade.quotationFullyApproved$;
  hasAnyApprovalEvent$ = this.approvalFacade.hasAnyApprovalEvent$;
  quotationAttachments$ = this.activeCaseFacade.quotationAttachments$;
  hasGpcRole$ = this.rolesFacade.userHasGPCRole$;
  hasSqvRole$ = this.rolesFacade.userHasSQVRole$;

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
          duration: calculateDuration(
            quotation.sapCreated,
            quotation.validTo,
            this.translocoLocaleService.getLocale()
          ),
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
          deviation: {
            value:
              // TODO: adjust as soon as SAP sends null for not existing priceDeviation, by now they send 0 instead of null
              approvalInformation.priceDeviation &&
              approvalInformation.priceDeviation > 0
                ? approvalInformation.priceDeviation
                : gqPricing.deviation.value,
            warning:
              gqPricing.deviation.value && !approvalInformation.priceDeviation,
          },
        })
      )
    );
  }
}
