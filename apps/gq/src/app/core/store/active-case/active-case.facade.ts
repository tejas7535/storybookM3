/* eslint-disable max-lines */
import { inject, Injectable } from '@angular/core';

import { combineLatest, map, Observable } from 'rxjs';

import { Tab } from '@gq/shared/components/tabs-header/tab.model';
import {
  Coefficients,
  Customer,
  DetailViewQueryParams,
  PlantMaterialDetail,
  Quotation,
  QuotationAttachment,
  QuotationDetail,
  QuotationStatus,
  SAP_SYNC_STATUS,
} from '@gq/shared/models';
import { MaterialComparableCost } from '@gq/shared/models/quotation-detail/material-comparable-cost.model';
import { MaterialSalesOrg } from '@gq/shared/models/quotation-detail/material-sales-org.model';
import { UpdateQuotationRequest } from '@gq/shared/services/rest/quotation/models/update-quotation-request.model';
import { getTagTypeByStatus, TagType } from '@gq/shared/utils/misc.utils';
import { Actions, ofType } from '@ngrx/effects';
import { Store } from '@ngrx/store';

import {
  clearOfferType,
  clearPurchaseOrderType,
  clearSectorGpsd,
  clearShipToParty,
  resetAllAutocompleteOptions,
} from '../actions/create-case/create-case.actions';
import { MaterialComparableCostsFacade } from '../facades/material-comparable-costs.facade';
import { MaterialCostDetailsFacade } from '../facades/material-cost-details.facade';
import { MaterialSalesOrgFacade } from '../facades/material-sales-org.facade';
import { MaterialStockFacade } from '../facades/material-stock.facade';
import { PlantMaterialDetailsFacade } from '../facades/plant-material-details.facade';
import { SapPriceDetailsFacade } from '../facades/sap-price-details.facade';
import { TransactionsFacade } from '../facades/transactions.facade';
import {
  ComparableLinkedTransaction,
  MaterialStock,
  SalesOrg,
  SapPriceConditionDetail,
} from '../reducers/models';
import { SectorGpsdFacade } from '../sector-gpsd/sector-gpsd.facade';
import { getSalesOrgsOfShipToParty } from '../selectors/create-case/create-case.selector';
import { ActiveCaseActions } from './active-case.action';
import { activeCaseFeature } from './active-case.reducer';
import {
  getCoefficients,
  getIsQuotationStatusActive,
  getQuotationCurrency,
  getQuotationDetailIsFNumber,
  getQuotationHasFNumberMaterials,
  getQuotationHasRfqMaterials,
  getQuotationSapSyncStatus,
  getQuotationStatus,
  getSapId,
  getSimulatedQuotationDetailByItemId,
  getSimulationModeEnabled,
  getTabsForProcessCaseView,
} from './active-case.selectors';
import { QuotationIdentifier, UpdateQuotationDetail } from './models';

@Injectable({
  providedIn: 'root',
})
export class ActiveCaseFacade {
  private readonly store: Store = inject(Store);
  private readonly actions$: Actions = inject(Actions);
  private readonly materialComparableCostsFacade = inject(
    MaterialComparableCostsFacade
  );
  private readonly materialSalesOrgFacade = inject(MaterialSalesOrgFacade);
  private readonly plantMaterialDetailsFacade = inject(
    PlantMaterialDetailsFacade
  );
  private readonly materialCostDetailsFacade: MaterialCostDetailsFacade =
    inject(MaterialCostDetailsFacade);
  private readonly materialStockFacade: MaterialStockFacade =
    inject(MaterialStockFacade);

  private readonly sapPriceDetailsFacade = inject(SapPriceDetailsFacade);
  private readonly transactionsFacade = inject(TransactionsFacade);
  private readonly sectorGpsdFacade: SectorGpsdFacade =
    inject(SectorGpsdFacade);

  quotation$: Observable<Quotation> = this.store.select(
    activeCaseFeature.selectQuotation
  );

  quotationIdentifier$: Observable<QuotationIdentifier> = this.store.select(
    activeCaseFeature.selectQuotationIdentifier
  );

  quotationCustomer$: Observable<Customer> = this.store.select(
    activeCaseFeature.selectCustomer
  );

  selectedQuotationDetail$: Observable<QuotationDetail> = this.store.select(
    activeCaseFeature.getSelectedQuotationDetail
  );

  selectedQuotationDetailIds$: Observable<string[]> = this.store.select(
    activeCaseFeature.selectSelectedQuotationDetails
  );

  quotationSapId$: Observable<string> = this.store.select(getSapId);

  isQuotationStatusActive$: Observable<boolean> = this.store.select(
    getIsQuotationStatusActive
  );

  simulationModeEnabled$: Observable<boolean> = this.store.select(
    getSimulationModeEnabled
  );

  getSimulatedQuotationDetailByItemId$(
    itemId: number
  ): Observable<QuotationDetail> {
    return this.store.select(getSimulatedQuotationDetailByItemId(itemId));
  }

  detailViewQueryParams$: Observable<{
    queryParams: DetailViewQueryParams;
    id: number;
  }> = this.store.select(activeCaseFeature.getDetailViewQueryParams);

  quotationCurrency$: Observable<string> =
    this.store.select(getQuotationCurrency);

  quotationDetailUpdating$ = this.store.select(
    activeCaseFeature.selectUpdateLoading
  );

  quotationDetailUpdateSuccess$: Observable<void> = this.actions$.pipe(
    ofType(ActiveCaseActions.updateQuotationDetailsSuccess)
  );

  costsUpdating$ = this.store.select(
    activeCaseFeature.selectUpdateCostsLoading
  );

  updateCostsSuccess$: Observable<void> = this.actions$.pipe(
    ofType(ActiveCaseActions.updateCostsSuccess)
  );

  rfqInformationUpdating$ = this.store.select(
    activeCaseFeature.selectUpdateRfqInformationLoading
  );

  updateRfqInformationSuccess$: Observable<void> = this.actions$.pipe(
    ofType(ActiveCaseActions.updateRFQInformationSuccess)
  );

  attachmentsUploading$ = this.store.select(
    activeCaseFeature.selectAttachmentsUploading
  );

  uploadAttachmentsSuccess$: Observable<void> = this.actions$.pipe(
    ofType(ActiveCaseActions.uploadAttachmentsSuccess)
  );

  quotationAttachments$: Observable<QuotationAttachment[]> = this.store.select(
    activeCaseFeature.selectAttachments
  );

  attachmentsGetting$: Observable<boolean> = this.store.select(
    activeCaseFeature.selectAttachmentsGetting
  );

  attachmentsGettingSuccess$: Observable<void> = this.actions$.pipe(
    ofType(ActiveCaseActions.getAllAttachmentsSuccess)
  );

  quotationHasRfqMaterials$: Observable<boolean> = this.store.select(
    getQuotationHasRfqMaterials
  );

  quotationHasFNumberMaterials$: Observable<boolean> = this.store.select(
    getQuotationHasFNumberMaterials
  );

  quotationDetailIsFNumber$: Observable<boolean> = this.store.select(
    getQuotationDetailIsFNumber
  );

  deleteAttachmentSuccess$: Observable<void> = this.actions$.pipe(
    ofType(ActiveCaseActions.deleteAttachmentSuccess)
  );

  deletionAttachmentInProgress$ = this.store.select(
    activeCaseFeature.selectAttachmentDeletionInProgress
  );

  loadingErrorMessage$: Observable<string> = this.store.select(
    activeCaseFeature.selectQuotationLoadingErrorMessage
  );

  quotationLoading$: Observable<boolean> = this.store.select(
    activeCaseFeature.selectQuotationLoading
  );

  customerLoading$: Observable<boolean> = this.store.select(
    activeCaseFeature.selectCustomerLoading
  );

  quotationStatus$: Observable<QuotationStatus> =
    this.store.select(getQuotationStatus);

  quotationSapSyncStatus$: Observable<SAP_SYNC_STATUS> = this.store.select(
    getQuotationSapSyncStatus
  );

  canEditQuotation$: Observable<boolean> = combineLatest([
    this.quotationStatus$,
    this.quotationSapSyncStatus$,
  ]).pipe(
    map(
      ([status, sapSyncStatus]) =>
        status === QuotationStatus.ACTIVE &&
        sapSyncStatus !== SAP_SYNC_STATUS.SYNC_PENDING
    )
  );

  isSapSyncPending$: Observable<boolean> = this.quotationSapSyncStatus$.pipe(
    map((status) => status === SAP_SYNC_STATUS.SYNC_PENDING)
  );
  coefficients$: Observable<Coefficients> = this.store.select(getCoefficients);

  shipToPartySalesOrgs$: Observable<SalesOrg[]> = this.store.select(
    getSalesOrgsOfShipToParty
  );

  tabsForProcessCaseView$: Observable<Tab[]> = this.store.select(
    getTabsForProcessCaseView()
  );

  tagType$: Observable<TagType> = combineLatest([
    this.quotation$,
    this.quotationSapSyncStatus$,
  ]).pipe(
    map(([quotation, sapSyncStatus]: [Quotation, SAP_SYNC_STATUS]) =>
      quotation.status !== QuotationStatus.ACTIVE &&
      quotation.status !== QuotationStatus.DELETED &&
      quotation.status !== QuotationStatus.ARCHIVED
        ? getTagTypeByStatus(quotation.status)
        : getTagTypeByStatus(sapSyncStatus)
    )
  );

  materialStock$: Observable<MaterialStock> =
    this.materialStockFacade.materialStock$;
  materialStockLoading$: Observable<boolean> =
    this.materialStockFacade.materialStockLoading$;

  materialCostUpdateAvl$: Observable<boolean> =
    this.materialCostDetailsFacade.materialCostUpdateAvl$;

  materialComparableCostsLoading$: Observable<boolean> =
    this.materialComparableCostsFacade.materialComparableCostsLoading$;
  materialComparableCosts$: Observable<MaterialComparableCost[]> =
    this.materialComparableCostsFacade.materialComparableCosts$;

  materialSalesOrgLoading$: Observable<boolean> =
    this.materialSalesOrgFacade.materialSalesOrgLoading$;
  materialSalesOrg$: Observable<MaterialSalesOrg> =
    this.materialSalesOrgFacade.materialSalesOrg$;
  materialSalesOrgDataAvailable$: Observable<boolean> =
    this.materialSalesOrgFacade.materialSalesOrgDataAvailable$;

  plantMaterialDetailsLoading$: Observable<boolean> =
    this.plantMaterialDetailsFacade.plantMaterialDetailsLoading$;
  plantMaterialDetails$: Observable<PlantMaterialDetail[]> =
    this.plantMaterialDetailsFacade.plantMaterialDetails$;

  sapPriceDetailsLoading$: Observable<boolean> =
    this.sapPriceDetailsFacade.sapPriceDetailsLoading$;
  sapPriceDetails$: Observable<SapPriceConditionDetail[]> =
    this.sapPriceDetailsFacade.sapPriceDetails$;

  transactions$: Observable<ComparableLinkedTransaction[]> =
    this.transactionsFacade.transactions$;
  transactionsLoading$: Observable<boolean> =
    this.transactionsFacade.transactionsLoading$;
  graphTransactions$: Observable<ComparableLinkedTransaction[]> =
    this.transactionsFacade.graphTransactions$;

  // ##############################################################################################################
  // ############################################# methods ########################################################
  // ##############################################################################################################
  selectQuotationDetail(gqPositionId: string): void {
    this.store.dispatch(
      ActiveCaseActions.selectQuotationDetail({ gqPositionId })
    );
  }

  deselectQuotationDetail(gqPositionId: string): void {
    this.store.dispatch(
      ActiveCaseActions.deselectQuotationDetail({ gqPositionId })
    );
  }

  updateCosts(gqPosId: string): void {
    this.store.dispatch(ActiveCaseActions.updateCosts({ gqPosId }));
  }

  updateRfqInformation(gqPosId: string): void {
    this.store.dispatch(ActiveCaseActions.updateRFQInformation({ gqPosId }));
  }

  uploadAttachments(files: File[]) {
    this.store.dispatch(ActiveCaseActions.uploadAttachments({ files }));
  }

  getAllAttachments(): void {
    this.store.dispatch(ActiveCaseActions.getAllAttachments());
  }

  downloadAttachment(attachment: QuotationAttachment): void {
    this.store.dispatch(ActiveCaseActions.downloadAttachment({ attachment }));
  }

  deleteAttachment(attachment: QuotationAttachment): void {
    this.store.dispatch(ActiveCaseActions.deleteAttachment({ attachment }));
  }

  updateQuotation(updateQuotationRequest: UpdateQuotationRequest) {
    this.store.dispatch(
      ActiveCaseActions.updateQuotation(updateQuotationRequest)
    );
  }

  updateQuotationDetails(
    updateQuotationDetailList: UpdateQuotationDetail[]
  ): void {
    this.store.dispatch(
      ActiveCaseActions.updateQuotationDetails({ updateQuotationDetailList })
    );
  }

  uploadSelectionToSap(gqPositionIds: string[]): void {
    this.store.dispatch(
      ActiveCaseActions.uploadSelectionToSap({ gqPositionIds })
    );
  }

  removePositionsFromQuotation(gqPositionIds: string[]): void {
    this.store.dispatch(
      ActiveCaseActions.removePositionsFromQuotation({ gqPositionIds })
    );
  }

  refreshSapPricing(): void {
    this.store.dispatch(ActiveCaseActions.refreshSapPricing());
  }

  confirmSimulatedQuotation(): void {
    this.store.dispatch(ActiveCaseActions.confirmSimulatedQuotation());
  }

  removeSimulatedQuotationDetail(gqPositionId: string): void {
    this.store.dispatch(
      ActiveCaseActions.removeSimulatedQuotationDetail({ gqPositionId })
    );
  }

  addSimulatedQuotation(
    gqId: number,
    quotationDetails: QuotationDetail[]
  ): void {
    this.store.dispatch(
      ActiveCaseActions.addSimulatedQuotation({ gqId, quotationDetails })
    );
  }
  resetSimulatedQuotation(): void {
    this.store.dispatch(ActiveCaseActions.resetSimulatedQuotation());
  }

  resetEditCaseSettings(): void {
    this.store.dispatch(resetAllAutocompleteOptions());
    this.store.dispatch(clearShipToParty());
    this.store.dispatch(clearSectorGpsd());
    this.store.dispatch(clearOfferType());
    this.store.dispatch(clearPurchaseOrderType());
    this.sectorGpsdFacade.resetAllSectorGpsds();
  }
}
