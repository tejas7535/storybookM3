import { inject, Injectable } from '@angular/core';

import { Keyboard } from '@gq/shared/models';
import { ViewQuotation } from '@gq/shared/models/quotation';
import { QuotationSearchResultByCases } from '@gq/shared/models/quotation/quotation-search-result-by-cases.interface';
import { TransformationService } from '@gq/shared/services/transformation/transformation.service';
import { ValueFormatterParams, ValueGetterParams } from 'ag-grid-community';

@Injectable({
  providedIn: 'root',
})
export class ColumnUtilityService {
  private readonly transformationService: TransformationService = inject(
    TransformationService
  );

  createdByGetter(data: QuotationSearchResultByCases): string {
    if (!data || !data.gqCreatedByUser?.name || !data.gqCreatedByUser?.id) {
      return Keyboard.DASH;
    }
    const { name, id } = data.gqCreatedByUser;

    return `${name} (${id})`;
  }

  viewQuotationGetter(params: ValueGetterParams): ViewQuotation {
    const result = params.data as QuotationSearchResultByCases;
    const returning = {
      customerIdentifiers: {
        customerId: result.customerId,
        salesOrg: result.salesOrg,
      },
      enabledForApprovalWorkflow: result.enabledForApprovalWorkflow,
      quotationStatus: result.status,
    } as unknown as ViewQuotation;

    return returning;
  }

  totalNetValueFormatter(params: ValueFormatterParams): string {
    return this.transformationService.transformNumberCurrency(
      params.value,
      params.data.currency
    );
  }
}
