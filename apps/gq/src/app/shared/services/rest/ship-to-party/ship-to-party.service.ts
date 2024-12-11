import { HttpClient, HttpParams } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';

import { Observable } from 'rxjs';

import { ApiVersion } from '@gq/shared/models';
import { ShipToPartyResponse } from '@gq/shared/models/ship-to-party.model';
import { QuotationPaths } from '@gq/shared/services/rest/quotation/models/quotation-paths.enum';

@Injectable({
  providedIn: 'root',
})
export class ShipToPartyService {
  readonly #http = inject(HttpClient);

  getShipToParties(
    customerId: string,
    salesOrg: string
  ): Observable<ShipToPartyResponse> {
    const params = new HttpParams()
      .set('customer-id', customerId)
      .set('sales-org', salesOrg);

    return this.#http.get<ShipToPartyResponse>(
      `${ApiVersion.V1}/${QuotationPaths.SHIP_TO_PARTY}`,
      { params }
    );
  }
}
