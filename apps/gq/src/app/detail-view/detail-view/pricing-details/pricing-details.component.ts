import { Component, inject, Input } from '@angular/core';

import { Observable } from 'rxjs';

import { ActiveCaseFacade } from '@gq/core/store/active-case/active-case.facade';
import { RolesFacade } from '@gq/core/store/facades/roles.facade';
import { QuotationStatus } from '@gq/shared/models';
import {
  PlantMaterialDetail,
  QuotationDetail,
  SAP_SYNC_STATUS,
} from '@gq/shared/models/quotation-detail';
import { MaterialSalesOrg } from '@gq/shared/models/quotation-detail/material-sales-org.model';

@Component({
  selector: 'gq-pricing-details',
  templateUrl: './pricing-details.component.html',
  standalone: false,
})
export class PricingDetailsComponent {
  @Input() quotationDetail: QuotationDetail;
  @Input() materialCostUpdateAvl: boolean;
  @Input() rfqDataUpdateAvl: boolean;

  @Input() set plantMaterialDetails(
    plantMaterialDetails: PlantMaterialDetail[]
  ) {
    this.productionPlantStochasticType =
      plantMaterialDetails?.find(
        (plant) =>
          plant.plantId === this.quotationDetail.productionPlant.plantNumber
      )?.stochasticType || undefined;

    this.supplyPlantStochasticType =
      plantMaterialDetails?.find(
        (plant) => plant.plantId === this.quotationDetail.plant.plantNumber
      )?.stochasticType || undefined;
  }

  private readonly activeCaseFacade = inject(ActiveCaseFacade);
  private readonly rolesFacade = inject(RolesFacade);

  productionPlantStochasticType: string;
  supplyPlantStochasticType: string;

  quotationCurrency$: Observable<string> =
    this.activeCaseFacade.quotationCurrency$;
  sapSyncStatus$: Observable<SAP_SYNC_STATUS> =
    this.activeCaseFacade.quotationSapSyncStatus$;
  isQuotationEditable$: Observable<boolean> =
    this.activeCaseFacade.canEditQuotation$;
  quotationStatus$: Observable<QuotationStatus> =
    this.activeCaseFacade.quotationStatus$;

  materialComparableCostsLoading$: Observable<boolean> =
    this.activeCaseFacade.materialComparableCostsLoading$;
  materialSalesOrgLoading$: Observable<boolean> =
    this.activeCaseFacade.materialSalesOrgLoading$;
  materialSalesOrg$: Observable<MaterialSalesOrg> =
    this.activeCaseFacade.materialSalesOrg$;
  materialSalesOrgDataAvailable$: Observable<boolean> =
    this.activeCaseFacade.materialSalesOrgDataAvailable$;

  plantMaterialDetailsLoading$: Observable<boolean> =
    this.activeCaseFacade.plantMaterialDetailsLoading$;

  userHasGPCRole$: Observable<boolean> = this.rolesFacade.userHasGPCRole$;
  userHasSQVRole$: Observable<boolean> = this.rolesFacade.userHasSQVRole$;

  sapSyncStatusEnum = SAP_SYNC_STATUS;
}
