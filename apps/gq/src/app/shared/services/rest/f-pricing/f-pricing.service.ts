import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';

import { map, Observable } from 'rxjs';

import { MarketValueDriver } from '@gq/shared/models/f-pricing';

import { ApiVersion, ProductType } from '../../../models';
import { FPricingData } from '../../../models/f-pricing/f-pricing-data.interface';

@Injectable({
  providedIn: 'root',
})
export class FPricingService {
  readonly #PATH_QUOTATION_DETAILS = 'quotation-details';
  readonly #Path_F_PRICING = 'f-pricing';

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
}
