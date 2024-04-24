import { HttpClient, HttpContext } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';

import { map, Observable } from 'rxjs';

import { SHOW_DEFAULT_SNACKBAR_ACTION } from '@gq/shared/http/http-error.interceptor';
import {
  FPricingCalculationsRequest,
  FPricingCalculationsResponse,
  MarketValueDriver,
  UpdateFPricingDataRequest,
  UpdateFPricingDataResponse,
} from '@gq/shared/models/f-pricing';

import { ApiVersion, ProductType } from '../../../models';
import { ComparableKNumbers } from '../../../models/f-pricing/comparable-k-numbers.interface';
import { FPricingData } from '../../../models/f-pricing/f-pricing-data.interface';
import { FPricingPaths } from './f-pricing.paths.enum';

@Injectable({
  providedIn: 'root',
})
export class FPricingService {
  readonly #http = inject(HttpClient);

  /**
   * Get all related F Pricing data for a given gq position id
   *
   * @param gqPositionId uuid of the gq position
   * @returns the complete data set for f-pricing and pricing assistant
   */
  getFPricingData(gqPositionId: string): Observable<FPricingData> {
    return this.#http
      .get<FPricingData>(
        `${ApiVersion.V1}/${FPricingPaths.PATH_QUOTATION_DETAILS}/${gqPositionId}/${FPricingPaths.PATH_F_PRICING}`
      )
      .pipe(
        map((data: FPricingData) => ({
          ...data,
          marketValueDrivers: data.marketValueDrivers.map(
            (mvd: MarketValueDriver) => ({
              ...mvd,
              productType: ProductType[mvd.productType],
            })
          ),
        }))
      );
  }

  getComparableTransactions(
    gqPositionId: string
  ): Observable<ComparableKNumbers> {
    return this.#http.get<ComparableKNumbers>(
      `${ApiVersion.V1}/${FPricingPaths.PATH_QUOTATION_DETAILS}/${gqPositionId}/${FPricingPaths.PATH_F_PRICING}/${FPricingPaths.PATH_COMPARABLE_K_NUMBER_TRANSACTIONS}`
    );
  }

  getFPricingCalculations(
    requestData: FPricingCalculationsRequest
  ): Observable<FPricingCalculationsResponse> {
    return this.#http.post<FPricingCalculationsResponse>(
      `${ApiVersion.V1}/${FPricingPaths.PATH_F_PRICING}/${FPricingPaths.PATH_F_PRICING_CALCULATIONS}`,
      requestData
    );
  }

  updateFPricingData(
    gqPositionId: string,
    data: UpdateFPricingDataRequest
  ): Observable<UpdateFPricingDataResponse> {
    return this.#http.post<UpdateFPricingDataResponse>(
      `${ApiVersion.V1}/${FPricingPaths.PATH_QUOTATION_DETAILS}/${gqPositionId}/${FPricingPaths.PATH_F_PRICING}`,
      data,
      {
        context: new HttpContext().set(SHOW_DEFAULT_SNACKBAR_ACTION, false),
      }
    );
  }
}
