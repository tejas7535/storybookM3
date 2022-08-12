import { Component, Input, OnInit } from '@angular/core';

import { Observable } from 'rxjs';

import { Store } from '@ngrx/store';

import {
  getMaterialComparableCostsLoading,
  getMaterialSalesOrgLoading,
  getPlantMaterialDetailsLoading,
  getQuotationCurrency,
} from '../../../core/store';
import {
  PlantMaterialDetail,
  QuotationDetail,
} from '../../../shared/models/quotation-detail';

@Component({
  selector: 'gq-pricing-details',
  templateUrl: './pricing-details.component.html',
})
export class PricingDetailsComponent implements OnInit {
  @Input() quotationDetail: QuotationDetail;
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

  quotationCurrency$: Observable<string>;
  materialComparableCostsLoading$: Observable<boolean>;
  materialSalesOrgLoading$: Observable<boolean>;
  plantMaterialDetailsLoading$: Observable<boolean>;
  productionPlantStochasticType: string;
  supplyPlantStochasticType: string;

  public constructor(private readonly store: Store) {}

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
  }
}
