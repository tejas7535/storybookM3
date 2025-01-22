import { HttpClient, HttpParams } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';

import { map, mergeMap, Observable, of } from 'rxjs';

import { MaterialStock } from '@gq/core/store/reducers/models';
import { AutocompleteSearch } from '@gq/shared/models/search';
import { IdValue } from '@gq/shared/models/search/id-value.model';
import { MaterialTableItem, MaterialValidation } from '@gq/shared/models/table';
import { mapMaterialAutocompleteToIdValue } from '@gq/shared/utils/misc.utils';
import { isEmpty } from 'lodash';

import { ApiVersion, CustomerId } from '../../../models';
import { PlantMaterialDetail } from '../../../models/quotation-detail';
import { MaterialAutoCompleteResponse } from './models';
import {
  AddDetailsValidationRequest,
  ValidationDetail,
  ValidationDetailData,
} from './models/add-details-validation-request.interface';
import {
  AddDetailsValidationResponse,
  ValidatedDetail,
} from './models/add-details-validation-response.interface';

@Injectable({
  providedIn: 'root',
})
export class MaterialService {
  private readonly PATH_MATERIAL_STOCK = 'materials/material-stock-status';
  private readonly PRODUCTION_PLANT_PARAM_KEY = 'production_plant_id';
  private readonly PLANT_ID_PARAM_KEY = 'plant_id';
  private readonly CURRENCY_PARAM_KEY = 'currency';
  private readonly PRICE_UNIT_PARAM_KEY = 'priceUnit';
  private readonly MATERIAL_NUMBER_PARAM_KEY = 'material_number_15';

  private readonly PATH_AUTOCOMPLETE = 'materials/auto-complete';
  private readonly PARAM_SEARCH_FOR = 'search_for';
  private readonly PARAM_LIMIT = 'limit';
  private readonly PARAM_CUSTOMER_ID = 'customer_id';
  private readonly PARAM_SALES_ORG = 'sales_org';
  private readonly PATH_ADD_DETAILS_VALIDATION = 'validation/add-details';

  private readonly http: HttpClient = inject(HttpClient);

  validateDetailsToAdd(
    addDetailsValidationData: AddDetailsValidationRequest
  ): Observable<AddDetailsValidationResponse> {
    return this.http.post<AddDetailsValidationResponse>(
      `${ApiVersion.V1}/${this.PATH_ADD_DETAILS_VALIDATION}`,
      addDetailsValidationData
    );
  }

  getMaterialStock(
    productionPlantId: string,
    materialNumber15: string
  ): Observable<MaterialStock> {
    const params = new HttpParams()
      .set(this.PRODUCTION_PLANT_PARAM_KEY, productionPlantId)
      .set(this.MATERIAL_NUMBER_PARAM_KEY, materialNumber15);

    return this.http.get<MaterialStock>(
      `${ApiVersion.V1}/${this.PATH_MATERIAL_STOCK}`,
      { params }
    );
  }

  getPlantMaterialDetails(
    materialNumber15: string,
    plantIds: string[]
  ): Observable<PlantMaterialDetail[]> {
    return this.http
      .post(
        `${ApiVersion.V1}/materials/${materialNumber15}/plant-material-details`,
        {
          plantIds,
        }
      )
      .pipe(mergeMap((result: any) => of([...result.plantMaterialDetailDtos])));
  }

  getMaterialCostDetails(
    productionPlantId: string,
    plantId: string,
    materialNumber15: string,
    currency: string,
    priceUnit: number
  ): Observable<any> {
    const params = new HttpParams()
      .set(this.PRODUCTION_PLANT_PARAM_KEY, productionPlantId)
      .append(this.PLANT_ID_PARAM_KEY, plantId)
      .append(this.CURRENCY_PARAM_KEY, currency)
      .append(this.PRICE_UNIT_PARAM_KEY, priceUnit);

    return this.http.get(
      `${ApiVersion.V1}/materials/${materialNumber15}/material-cost-details`,
      { params }
    );
  }

  autocompleteMaterial(
    autocompleteSearch: AutocompleteSearch
  ): Observable<IdValue[]> {
    let httpParams = new HttpParams()
      .set(this.PARAM_SEARCH_FOR, autocompleteSearch.searchFor)
      .append(this.PARAM_LIMIT, autocompleteSearch?.limit || 100);

    if (
      autocompleteSearch?.customerIdentifier?.customerId &&
      autocompleteSearch?.customerIdentifier?.salesOrg
    ) {
      httpParams = httpParams
        .append(
          this.PARAM_CUSTOMER_ID,
          autocompleteSearch.customerIdentifier.customerId
        )
        .append(
          this.PARAM_SALES_ORG,
          autocompleteSearch.customerIdentifier.salesOrg
        );
    }

    return this.http
      .get<MaterialAutoCompleteResponse>(
        `${ApiVersion.V1}/${this.PATH_AUTOCOMPLETE}/${autocompleteSearch.filter}`,
        { params: httpParams }
      )
      .pipe(
        map((response: MaterialAutoCompleteResponse) =>
          response.results.map((value) =>
            mapMaterialAutocompleteToIdValue(value, autocompleteSearch.filter)
          )
        )
      );
  }

  mapToAddDetailsValidationRequest = (
    customerId: CustomerId,
    tableData: MaterialTableItem[]
  ): AddDetailsValidationRequest => ({
    customerId,
    details: tableData.map(
      (el) =>
        ({
          id: el.id,
          data: {
            materialNumber15: isEmpty(el.materialNumber)
              ? undefined
              : el.materialNumber,
            quantity: el.quantity,
            customerMaterial: isEmpty(el.customerMaterialNumber)
              ? undefined
              : el.customerMaterialNumber,
            targetPrice: el.targetPrice,
            targetPriceSource: el.targetPriceSource,
          } as ValidationDetailData,
        }) as ValidationDetail
    ),
  });

  mapValidatedDetailToMaterialValidation = (detail: ValidatedDetail) => {
    const validatedMaterial: MaterialValidation = {
      id: detail.id,
      valid: detail.valid,
      materialNumber15: detail.materialData.materialNumber15,
      materialDescription: detail.materialData.materialDescription,
      materialPriceUnit: detail.materialData.materialPriceUnit,
      materialUoM: detail.materialData.materialUoM,
      customerMaterial: detail.customerData?.customerMaterial,
      correctedQuantity:
        detail.customerData?.correctedQuantity > 0
          ? detail.customerData?.correctedQuantity
          : null,
      targetPriceSource: detail.customerData?.targetPriceSource,
      deliveryUnit: detail.customerData?.deliveryUnit,
      validationCodes: detail.validationCodes,
    };

    return validatedMaterial;
  };
}
