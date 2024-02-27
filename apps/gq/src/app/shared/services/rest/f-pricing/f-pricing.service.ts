import { HttpClient, HttpContext } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';

import { map, Observable } from 'rxjs';

import { BYPASS_DEFAULT_ERROR_HANDLING } from '@gq/shared/http/http-error.interceptor';
import {
  MarketValueDriver,
  UpdateFPricingDataRequest,
  UpdateFPricingDataResponse,
} from '@gq/shared/models/f-pricing';

import { ApiVersion, ProductType } from '../../../models';
import { ComparableKNumbers } from '../../../models/f-pricing/comparable-k-numbers.interface';
import { FPricingData } from '../../../models/f-pricing/f-pricing-data.interface';

@Injectable({
  providedIn: 'root',
})
export class FPricingService {
  readonly #PATH_QUOTATION_DETAILS = 'quotation-details';
  readonly #Path_F_PRICING = 'f-pricing';
  readonly #PATH_COMPARABLE_K_NUMBER_TRANSACTIONS =
    'comparable-k-number-transactions';

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
        `${ApiVersion.V1}/${this.#PATH_QUOTATION_DETAILS}/${gqPositionId}/${
          this.#Path_F_PRICING
        }`
      )
      .pipe(
        map((data: FPricingData) => ({
          ...data,
          marketValueDrivers: [
            ...data.marketValueDrivers.map((mvd: MarketValueDriver) => ({
              ...mvd,
              productType: ProductType[mvd.productType],
            })),
          ],
        }))
      );
  }

  getComparableTransactions(
    gqPositionId: string
  ): Observable<ComparableKNumbers> {
    return this.#http.get<ComparableKNumbers>(
      `${ApiVersion.V1}/${this.#PATH_QUOTATION_DETAILS}/${gqPositionId}/${
        this.#Path_F_PRICING
      }/${this.#PATH_COMPARABLE_K_NUMBER_TRANSACTIONS}`
    );
  }

  updateFPricingData(
    gqPositionId: string,
    data: UpdateFPricingDataRequest
  ): Observable<UpdateFPricingDataResponse> {
    return this.#http.post<UpdateFPricingDataResponse>(
      `${ApiVersion.V1}/${this.#PATH_QUOTATION_DETAILS}/${gqPositionId}/${
        this.#Path_F_PRICING
      }`,
      data,
      {
        context: new HttpContext().set(BYPASS_DEFAULT_ERROR_HANDLING, true),
      }
    );
  }
}
