import { inject, Injectable } from '@angular/core';

import { Keyboard } from '@gq/shared/models';
import { ViewQuotation } from '@gq/shared/models/quotation';
import { QuotationSearchResultByCases } from '@gq/shared/models/quotation/quotation-search-result-by-cases.interface';
import { MaterialNumberService } from '@gq/shared/services/material-number/material-number.service';
import { TransformationService } from '@gq/shared/services/transformation/transformation.service';
import {
  PostSortRowsParams,
  ValueFormatterParams,
  ValueGetterParams,
} from 'ag-grid-enterprise';
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

  // always moves rows with no gqLastUpdated to the end of the array after sorting
  // ToDo: can be removed after a db cleanup was performed since this is only require because of very old data
  postSortRows(params: PostSortRowsParams): void {
    const nodes = params.nodes;
    // eslint-disable-next-line no-plusplus
    for (let i = nodes.length - 1; i >= 0; i--) {
      const node = nodes[i];
      const gqLastUpdated = node.data.gqLastUpdated;

      // If gqLastUpdated is not defined, move the node to the end of the array
      if (!gqLastUpdated) {
        const [nodeWithoutUpdate] = nodes.splice(i, 1);
        nodes.push(nodeWithoutUpdate);
      }
    }
  }

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

  netValueFormatter(params: ValueFormatterParams): string {
    return this.transformationService.transformNumberCurrency(
      params.value,
      params.data.currency
    );
  }
}
