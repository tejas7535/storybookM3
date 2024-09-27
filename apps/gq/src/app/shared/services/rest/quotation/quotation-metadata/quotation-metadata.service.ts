import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';

import { Observable } from 'rxjs';

import { ApiVersion } from '@gq/shared/models';
import { Quotation, QuotationMetadata } from '@gq/shared/models/quotation';

import { QuotationPaths } from '../models/quotation-paths.enum';

@Injectable({
  providedIn: 'root',
})
export class QuotationMetadataService {
  readonly #http = inject(HttpClient);

  updateQuotationMetadata(
    gqId: number,
    quotationMetadata: QuotationMetadata
  ): Observable<Quotation> {
    return this.#http.put<Quotation>(
      `${ApiVersion.V1}/${QuotationPaths.PATH_QUOTATIONS}/${gqId}/metadata`,
      quotationMetadata
    );
  }
}
