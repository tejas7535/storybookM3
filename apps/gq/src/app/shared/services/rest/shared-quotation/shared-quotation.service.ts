import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';

import { ApiVersion, SharedQuotation } from '@gq/shared/models';
import { SharedQuotationPaths } from '@gq/shared/services/rest/shared-quotation/models/shared-quotation-paths.enum';

@Injectable({
  providedIn: 'root',
})
export class SharedQuotationService {
  readonly #http = inject(HttpClient);

  getSharedQuotation(gqId: number) {
    return this.#http.get<SharedQuotation | null>(
      `${ApiVersion.V1}/${SharedQuotationPaths.PATH_SHARED_QUOTATION}/${gqId}`
    );
  }

  saveSharedQuotation(gqId: number) {
    return this.#http.post<SharedQuotation>(
      `${ApiVersion.V1}/${SharedQuotationPaths.PATH_SHARED_QUOTATION}/${gqId}`,
      {}
    );
  }

  deleteSharedQuotation(sharedQuotationId: string) {
    return this.#http.delete(
      `${ApiVersion.V1}/${SharedQuotationPaths.PATH_SHARED_QUOTATION}/${sharedQuotationId}`
    );
  }
}
