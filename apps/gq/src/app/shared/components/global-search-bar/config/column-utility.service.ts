import { inject, Injectable } from '@angular/core';

import { Keyboard } from '@gq/shared/models';
import { ViewQuotation } from '@gq/shared/models/quotation';
import { QuotationSearchResultByCases } from '@gq/shared/models/quotation/quotation-search-result-by-cases.interface';
import { MaterialNumberService } from '@gq/shared/services/material-number/material-number.service';
import { TransformationService } from '@gq/shared/services/transformation/transformation.service';
import { ValueFormatterParams, ValueGetterParams } from 'ag-grid-enterprise';
@Injectable({
  providedIn: 'root',
})
export class ColumnUtilityService {
  private readonly transformationService: TransformationService = inject(
    TransformationService
  );
  private readonly materialNumberService: MaterialNumberService = inject(
    MaterialNumberService
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

  materialGetter(params: ValueGetterParams): string {
    const data = params.data;

    return this.materialNumberService.formatStringAsMaterialNumber(
      data?.materialNumber15
    );
  }

  gpiGetter(params: ValueGetterParams): string {
    const data = params.data;

    return `${data?.gpi * 100}`;
  }

  netValueFormatter(params: ValueFormatterParams): string {
    return this.transformationService.transformNumberCurrency(
      params.value,
      params.data.currency
    );
  }
}
