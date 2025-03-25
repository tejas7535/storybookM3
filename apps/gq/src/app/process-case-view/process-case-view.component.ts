import { Component, inject, OnDestroy } from '@angular/core';

import { map, Observable } from 'rxjs';

import { ActiveCaseFacade } from '@gq/core/store/active-case/active-case.facade';
import { ApprovalFacade } from '@gq/core/store/approval/approval.facade';
import { RolesFacade } from '@gq/core/store/facades/roles.facade';
import { Tab } from '@gq/shared/components/tabs-header/tab.model';
import { TagType } from '@gq/shared/models';
import { Quotation } from '@gq/shared/models/quotation/quotation.model';
import { SAP_SYNC_STATUS } from '@gq/shared/models/quotation-detail/sap-sync-status.enum';
import { BreadcrumbsService } from '@gq/shared/services/breadcrumbs/breadcrumbs.service';
import { UpdateQuotationRequest } from '@gq/shared/services/rest/quotation/models/update-quotation-request.model';

import { Breadcrumb } from '@schaeffler/breadcrumbs';

@Component({
  selector: 'gq-case-view',
  templateUrl: './process-case-view.component.html',
  styleUrls: ['./process-case-view.component.scss'],
  standalone: false,
})
export class ProcessCaseViewComponent implements OnDestroy {
  private readonly approvalFacade: ApprovalFacade = inject(ApprovalFacade);
  private readonly breadCrumbsService: BreadcrumbsService =
    inject(BreadcrumbsService);
  private readonly rolesFacade: RolesFacade = inject(RolesFacade);
  private readonly activeCaseFacade: ActiveCaseFacade =
    inject(ActiveCaseFacade);

  showCalcInProgress$ = this.activeCaseFacade.quotationCalculationInProgress$;
  quotation$: Observable<Quotation> = this.activeCaseFacade.quotation$;
  sapStatus$: Observable<SAP_SYNC_STATUS> =
    this.activeCaseFacade.quotationSapSyncStatus$;

  breadcrumbs$: Observable<Breadcrumb[]> =
    this.activeCaseFacade.quotationIdentifier$.pipe(
      map((identifier) =>
        this.breadCrumbsService.getQuotationBreadcrumbsForProcessCaseView(
          identifier.gqId
        )
      )
    );

  tabs$: Observable<Tab[]> = this.activeCaseFacade.tabsForProcessCaseView$;
  tagType$: Observable<TagType> = this.activeCaseFacade.tagType$;

  readonly loggedInUserId$ = this.rolesFacade.loggedInUserId$;

  ngOnDestroy(): void {
    this.approvalFacade.stopApprovalCockpitDataPolling();
  }

  updateQuotation(updateQuotationRequest: UpdateQuotationRequest) {
    this.activeCaseFacade.updateQuotation(updateQuotationRequest);
  }
}
