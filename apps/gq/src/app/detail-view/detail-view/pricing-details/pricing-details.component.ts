import { Component, Input, OnInit } from '@angular/core';

import { Observable } from 'rxjs';

import { getQuotationCurrency } from '@gq/core/store/active-case/active-case.selectors';
import {
  getMaterialComparableCostsLoading,
  getMaterialSalesOrg,
  getMaterialSalesOrgDataAvailable,
  getMaterialSalesOrgLoading,
  getPlantMaterialDetailsLoading,
  userHasGPCRole,
  userHasSQVRole,
} from '@gq/core/store/selectors';
import {
  PlantMaterialDetail,
  QuotationDetail,
} from '@gq/shared/models/quotation-detail';
import { MaterialSalesOrg } from '@gq/shared/models/quotation-detail/material-sales-org.model';
import { Store } from '@ngrx/store';

@Component({
  selector: 'gq-pricing-details',
  templateUrl: './pricing-details.component.html',
})
export class PricingDetailsComponent implements OnInit {
  @Input() quotationDetail: QuotationDetail;
  @Input() materialCostUpdateAvl: boolean;
  @Input() rfqDataUpdateAvl: boolean;

  quotationCurrency$: Observable<string>;
  materialComparableCostsLoading$: Observable<boolean>;
  materialSalesOrgLoading$: Observable<boolean>;
  plantMaterialDetailsLoading$: Observable<boolean>;
  productionPlantStochasticType: string;
  supplyPlantStochasticType: string;
  userHasGPCRole$: Observable<boolean>;
  userHasSQVRole$: Observable<boolean>;

  materialSalesOrg$: Observable<MaterialSalesOrg>;
  materialSalesOrgDataAvailable$: Observable<boolean>;

  constructor(private readonly store: Store) {}

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

  ngOnInit(): void {
    this.quotationCurrency$ = this.store.select(getQuotationCurrency);
    this.materialComparableCostsLoading$ = this.store.select(
      getMaterialComparableCostsLoading
    );
    this.materialSalesOrgLoading$ = this.store.select(
      getMaterialSalesOrgLoading
    );
    this.plantMaterialDetailsLoading$ = this.store.select(
      getPlantMaterialDetailsLoading
    );

    this.userHasGPCRole$ = this.store.pipe(userHasGPCRole);
    this.userHasSQVRole$ = this.store.pipe(userHasSQVRole);

    this.materialSalesOrg$ = this.store.select(getMaterialSalesOrg);
    this.materialSalesOrgDataAvailable$ = this.store.select(
      getMaterialSalesOrgDataAvailable
    );
  }
}
