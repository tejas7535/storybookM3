import { Injectable } from '@angular/core';

import { ReferenceMaterialGroupCellComponent } from '@gq/shared/ag-grid/cell-renderer/reference-material-group-cell/reference-material-group-cell.component';
import { ReferencePricingColumnFields } from '@gq/shared/ag-grid/constants/column-fields.enum';
import { FILTER_PARAMS } from '@gq/shared/ag-grid/constants/filters';
import { translate } from '@ngneat/transloco';
import { ColDef } from 'ag-grid-community';

@Injectable({
  providedIn: 'root',
})
export class ColumnDefinitionService {
  COLUMN_DEFS: ColDef[] = [
    {
      headerName: 'Group',
      hide: true,
      suppressColumnsToolPanel: true,
    },
    {
      headerName: ReferencePricingColumnFields.PARENT_MATERIAL_DESCRIPTION,
      field: ReferencePricingColumnFields.PARENT_MATERIAL_DESCRIPTION,
      rowGroup: true,
      hide: true,
      suppressColumnsToolPanel: true,
    },
    {
      headerName: translate(
        'fPricing.pricingAssistantModal.referencePricingTable.customerName'
      ),
      field: ReferencePricingColumnFields.CUSTOMER_NAME,
      filterParams: FILTER_PARAMS,
      cellRendererSelector: (params: any) => {
        if (!params.data) {
          return { component: ReferenceMaterialGroupCellComponent };
        }

        return {
          component: 'agCellRenderer',
        };
      },
      minWidth: 300,
      resizable: true,
      showRowGroup: true,
    },
    {
      headerName: translate(
        'fPricing.pricingAssistantModal.referencePricingTable.materialDescription'
      ),
      field: ReferencePricingColumnFields.MATERIAL_DESCRIPTION,
      filterParams: FILTER_PARAMS,
      sort: 'asc',
      resizable: true,
    },
    {
      headerName: translate(
        'fPricing.pricingAssistantModal.referencePricingTable.quantity'
      ),
      field: ReferencePricingColumnFields.QUANTITY,
      filterParams: FILTER_PARAMS,
      resizable: true,
    },
    {
      headerName: translate(
        'fPricing.pricingAssistantModal.referencePricingTable.price'
      ),
      field: ReferencePricingColumnFields.PRICE,
      filterParams: FILTER_PARAMS,
      resizable: true,
    },
    {
      headerName: translate(
        'fPricing.pricingAssistantModal.referencePricingTable.year'
      ),
      field: ReferencePricingColumnFields.YEAR,
      filterParams: FILTER_PARAMS,
      resizable: true,
    },
  ];
}
