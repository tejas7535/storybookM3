import { Injectable } from '@angular/core';

import { ColDef } from '@ag-grid-community/all-modules';
import { translate } from '@ngneat/transloco';

import { EditCellData } from '../../ag-grid/cell-renderer/models/edit-cell-class-params.model';
import { EditableColumnHeaderComponent } from '../column-headers/editable-column-header/editable-column-header.component';
import { ColumnFields } from '../constants/column-fields.enum';
import {
  DATE_COLUMN_FILTER,
  FILTER_PARAMS,
  NUMBER_COLUMN_FILTER,
  TEXT_COLUMN_FILTER,
} from '../constants/filters';
import { ColumnUtilityService } from './column-utility.service';

@Injectable({
  providedIn: 'root',
})
export class ColumnDefService {
  COLUMN_DEFS: ColDef[] = [
    {
      headerCheckboxSelection: true,
      headerCheckboxSelectionFilteredOnly: true,
      checkboxSelection: true,
      headerName: translate('shared.quotationDetailsTable.item'),
      field: 'quotationItemId',
      cellRenderer: 'PositionIdComponent',
      sort: 'asc',
      pinned: 'left',
      filterParams: FILTER_PARAMS,
    },
    {
      headerName: translate('shared.quotationDetailsTable.materialNumber'),
      field: ColumnFields.MATERIAL_NUMBER_15,
      valueFormatter: ColumnUtilityService.materialTransform,
      valueGetter: (params) => ColumnUtilityService.materialGetter(params),
      filterParams: FILTER_PARAMS,
    },
    {
      headerName: translate('shared.quotationDetailsTable.materialDescription'),
      field: 'material.materialDescription',
      filterParams: FILTER_PARAMS,
    },
    {
      headerName: translate('shared.quotationDetailsTable.orderQuantity'),
      field: ColumnFields.ORDER_QUANTITY,
      valueFormatter: ColumnUtilityService.numberFormatter,
      cellRenderer: 'EditCellComponent',
      cellRendererParams: {
        condition: { enabled: false },
        field: ColumnFields.ORDER_QUANTITY,
      } as EditCellData,
      filter: NUMBER_COLUMN_FILTER,
    },
    {
      headerName: translate('shared.quotationDetailsTable.price'),
      field: ColumnFields.PRICE,
      valueFormatter: ColumnUtilityService.numberCurrencyFormatter,
      cellRenderer: 'EditCellComponent',
      cellRendererParams: {
        condition: { enabled: false },
        field: ColumnFields.PRICE,
      } as EditCellData,
      filter: NUMBER_COLUMN_FILTER,
      headerComponentFramework: EditableColumnHeaderComponent,
      headerComponent: EditableColumnHeaderComponent,
    },
    {
      headerName: translate('shared.quotationDetailsTable.priceSource'),
      field: ColumnFields.PRICE_SOURCE,
      valueFormatter: ColumnUtilityService.transformPriceSource,
      filterParams: FILTER_PARAMS,
      cellRenderer: 'EditCellComponent',
      cellRendererParams: {
        condition: { enabled: false },
        field: ColumnFields.PRICE_SOURCE,
      },
      headerComponentFramework: EditableColumnHeaderComponent,
      headerComponent: EditableColumnHeaderComponent,
    },
    {
      headerName: translate('shared.quotationDetailsTable.priceUnit'),
      field: 'material.priceUnit',
      valueFormatter: ColumnUtilityService.numberFormatter,
      filterParams: FILTER_PARAMS,
    },
    {
      headerName: translate('shared.quotationDetailsTable.uom'),
      field: 'material.baseUoM',
      filterParams: FILTER_PARAMS,
    },
    {
      headerName: translate('shared.quotationDetailsTable.netValue'),
      field: ColumnFields.NET_VALUE,
      valueFormatter: ColumnUtilityService.numberCurrencyFormatter,
      filter: NUMBER_COLUMN_FILTER,
      cellRenderer: 'EditCellComponent',
      cellRendererParams: {
        condition: { enabled: false },
        field: ColumnFields.NET_VALUE,
      } as EditCellData,
    },

    {
      headerName: translate('shared.quotationDetailsTable.gqPrice'),
      field: ColumnFields.RECOMMENDED_PRICE,
      valueFormatter: ColumnUtilityService.numberCurrencyFormatter,
      filter: NUMBER_COLUMN_FILTER,
    },
    {
      headerName: translate('shared.quotationDetailsTable.gqRating'),
      cellRenderer: 'GqRatingComponent',
      field: 'gqRating',
      filterParams: FILTER_PARAMS,
    },
    {
      headerName: translate('shared.quotationDetailsTable.sapPrice'),
      field: ColumnFields.SAP_PRICE,
      valueFormatter: ColumnUtilityService.numberCurrencyFormatter,
      filter: NUMBER_COLUMN_FILTER,
    },
    {
      headerName: translate('shared.quotationDetailsTable.rsp'),
      field: ColumnFields.RSP,
      valueFormatter: ColumnUtilityService.numberCurrencyFormatter,
      filter: NUMBER_COLUMN_FILTER,
    },
    {
      headerName: translate('shared.quotationDetailsTable.msp'),
      field: ColumnFields.MSP,
      valueFormatter: ColumnUtilityService.numberCurrencyFormatter,
      filter: NUMBER_COLUMN_FILTER,
    },
    {
      headerName: translate('shared.quotationDetailsTable.sapGrossPrice'),
      field: ColumnFields.SAP_GROSS_PRICE,
      valueFormatter: ColumnUtilityService.numberCurrencyFormatter,
      filter: NUMBER_COLUMN_FILTER,
    },
    {
      headerName: translate('shared.quotationDetailsTable.discount'),
      field: ColumnFields.DISCOUNT,
      valueFormatter: ColumnUtilityService.percentageFormatter,
      editable: true,
      cellRenderer: 'EditCellComponent',
      cellRendererParams: {
        condition: { enabled: true, conditionField: 'sapGrossPrice' },
        field: ColumnFields.DISCOUNT,
      } as EditCellData,
      filter: NUMBER_COLUMN_FILTER,
      headerComponentFramework: EditableColumnHeaderComponent,
      headerComponent: EditableColumnHeaderComponent,
    },
    {
      headerName: translate('shared.quotationDetailsTable.targetPrice'),
      field: ColumnFields.TARGET_PRICE,
      valueFormatter: ColumnUtilityService.numberCurrencyFormatter,
      filter: NUMBER_COLUMN_FILTER,
    },
    {
      headerName: translate('shared.quotationDetailsTable.gpc'),
      field: ColumnFields.GPC,
      valueFormatter: ColumnUtilityService.numberCurrencyFormatter,
      filter: NUMBER_COLUMN_FILTER,
    },
    {
      headerName: translate('shared.quotationDetailsTable.sqv'),
      field: ColumnFields.SQV,
      valueFormatter: ColumnUtilityService.numberCurrencyFormatter,
      filter: NUMBER_COLUMN_FILTER,
    },
    {
      headerName: translate('shared.quotationDetailsTable.relocCost'),
      field: ColumnFields.RELOCATION_COST,
      valueFormatter: ColumnUtilityService.numberCurrencyFormatter,
      filter: NUMBER_COLUMN_FILTER,
    },
    {
      headerName: translate('shared.quotationDetailsTable.gpi'),
      field: ColumnFields.GPI,
      valueFormatter: ColumnUtilityService.percentageFormatter,
      cellRenderer: 'EditCellComponent',
      cellRendererParams: {
        condition: { enabled: true, conditionField: ColumnFields.GPC },
        field: ColumnFields.GPI,
      } as EditCellData,
      filter: NUMBER_COLUMN_FILTER,
      headerComponentFramework: EditableColumnHeaderComponent,
      headerComponent: EditableColumnHeaderComponent,
    },
    {
      headerName: translate('shared.quotationDetailsTable.gpm'),
      field: ColumnFields.GPM,
      valueFormatter: ColumnUtilityService.percentageFormatter,
      cellRenderer: 'EditCellComponent',
      cellRendererParams: {
        condition: { enabled: true, conditionField: ColumnFields.SQV },
        field: ColumnFields.GPM,
      } as EditCellData,
      filter: NUMBER_COLUMN_FILTER,
      headerComponentFramework: EditableColumnHeaderComponent,
      headerComponent: EditableColumnHeaderComponent,
    },
    {
      headerName: translate('shared.quotationDetailsTable.rlm'),
      field: ColumnFields.RLM,
      valueFormatter: ColumnUtilityService.percentageFormatter,
      filter: NUMBER_COLUMN_FILTER,
      cellRenderer: 'EditCellComponent',
      cellRendererParams: {
        condition: { enabled: false },
        field: ColumnFields.RLM,
      } as EditCellData,
    },
    {
      headerName: translate('shared.quotationDetailsTable.lastCustomerPrice'),
      field: ColumnFields.LAST_CUSTOMER_PRICE,
      valueFormatter: ColumnUtilityService.numberCurrencyFormatter,
      filter: NUMBER_COLUMN_FILTER,
    },
    {
      headerName: translate(
        'shared.quotationDetailsTable.lastCustomerPriceGpi'
      ),
      field: ColumnFields.LAST_CUSTOMER_PRICE_GPI,
      valueFormatter: ColumnUtilityService.percentageFormatter,
      filter: NUMBER_COLUMN_FILTER,
    },
    {
      headerName: translate(
        'shared.quotationDetailsTable.lastCustomerPriceGpm'
      ),
      field: ColumnFields.LAST_CUSTOMER_PRICE_GPM,
      valueFormatter: ColumnUtilityService.percentageFormatter,
      filter: NUMBER_COLUMN_FILTER,
    },
    {
      headerName: translate(
        'shared.quotationDetailsTable.lastCustomerPriceDate'
      ),
      field: ColumnFields.LAST_CUSTOMER_PRICE_DATE,
      filter: DATE_COLUMN_FILTER,
      valueFormatter: ColumnUtilityService.dateFormatter,
      filterParams: ColumnUtilityService.dateFilterParams,
    },
    {
      headerName: translate('shared.quotationDetailsTable.priceDiff'),
      field: ColumnFields.PRICE_DIFF,
      valueFormatter: ColumnUtilityService.percentageFormatter,
      filter: NUMBER_COLUMN_FILTER,
      cellRenderer: 'EditCellComponent',
      cellRendererParams: {
        condition: { enabled: false },
        field: ColumnFields.PRICE_DIFF,
      } as EditCellData,
    },
    {
      headerName: translate('shared.quotationDetailsTable.lastOfferPrice'),
      field: ColumnFields.LAST_OFFER_PRICE,
      valueFormatter: ColumnUtilityService.numberCurrencyFormatter,
      filter: NUMBER_COLUMN_FILTER,
    },
    {
      headerName: translate('shared.quotationDetailsTable.lastOfferDate'),
      field: ColumnFields.LAST_OFFER_PRICE_DATE,
      filter: DATE_COLUMN_FILTER,
      valueFormatter: ColumnUtilityService.dateFormatter,
      filterParams: ColumnUtilityService.dateFilterParams,
    },
    {
      headerName: translate('shared.quotationDetailsTable.reasonForRejection'),
      field: 'lastOfferDetail.reasonForRejection',
      valueFormatter: ColumnUtilityService.basicTransform,
      filterParams: FILTER_PARAMS,
    },
    {
      headerName: translate(
        'shared.quotationDetailsTable.detailReasonForRejection'
      ),
      field: 'lastOfferDetail.detailReasonForRejection',
      valueFormatter: ColumnUtilityService.basicTransform,
      filterParams: FILTER_PARAMS,
    },
    {
      headerName: translate('shared.quotationDetailsTable.freeStock'),
      field: 'materialStockByPlant.freeStock',
      valueFormatter: ColumnUtilityService.numberDashFormatter,
      filterParams: FILTER_PARAMS,
    },
    {
      headerName: translate('shared.quotationDetailsTable.dateNextFreeAtp'),
      field: 'materialStockByPlant.dateNextFree',
      valueFormatter: ColumnUtilityService.dateFormatter,
      filter: DATE_COLUMN_FILTER,
    },
    {
      headerName: translate('shared.quotationDetailsTable.rlt'),
      field: 'rlt',
      valueFormatter: ColumnUtilityService.basicTransform,
      filterParams: FILTER_PARAMS,
    },
    {
      headerName: translate('shared.quotationDetailsTable.productionPlant'),
      field: 'productionPlant.plantNumber',
      valueFormatter: ColumnUtilityService.basicTransform,
      cellClass: 'keepLeadingZero',
      filterParams: FILTER_PARAMS,
    },
    {
      headerName: translate('shared.quotationDetailsTable.productionCity'),
      field: 'productionPlant.city',
      valueFormatter: ColumnUtilityService.basicTransform,
      filterParams: FILTER_PARAMS,
    },
    {
      headerName: translate('shared.quotationDetailsTable.productionCountry'),
      field: 'productionPlant.country',
      valueFormatter: ColumnUtilityService.basicTransform,
      filterParams: FILTER_PARAMS,
    },
    {
      headerName: translate('shared.quotationDetailsTable.relocPlant'),
      field: 'relocatedProductionPlant.plantNumber',
      valueFormatter: ColumnUtilityService.basicTransform,
      filterParams: FILTER_PARAMS,
    },
    {
      headerName: translate('shared.quotationDetailsTable.relocCity'),
      field: 'relocatedProductionPlant.city',
      valueFormatter: ColumnUtilityService.basicTransform,
      filterParams: FILTER_PARAMS,
    },
    {
      headerName: translate('shared.quotationDetailsTable.relocCountry'),
      field: 'relocatedProductionPlant.country',
      valueFormatter: ColumnUtilityService.basicTransform,
      filterParams: FILTER_PARAMS,
    },
    {
      headerName: translate('shared.quotationDetailsTable.customerMaterial'),
      field: 'customerMaterial',
      valueFormatter: ColumnUtilityService.basicTransform,
      filterParams: FILTER_PARAMS,
    },
    {
      headerName: translate('shared.quotationDetailsTable.productLine'),
      field: 'material.productLineId',
      valueFormatter: ColumnUtilityService.basicTransform,
      cellClass: 'keepLeadingZero',
      filterParams: FILTER_PARAMS,
    },
    {
      headerName: translate('shared.quotationDetailsTable.gpsd'),
      field: 'material.gpsdGroupId',
      valueFormatter: ColumnUtilityService.basicTransform,
      filterParams: FILTER_PARAMS,
    },
    {
      headerName: translate('shared.quotationDetailsTable.materialStatus'),
      field: 'material.materialStatus',
      valueFormatter: ColumnUtilityService.basicTransform,
      filterParams: FILTER_PARAMS,
    },
    {
      headerName: translate('shared.quotationDetailsTable.followingType'),
      field: ColumnFields.FOLLOWING_TYPE,
      valueFormatter: ColumnUtilityService.materialTransform,
      filterParams: FILTER_PARAMS,
    },
    {
      headerName: translate('shared.quotationDetailsTable.itemComment'),
      field: 'comment',
      valueFormatter: ColumnUtilityService.basicTransform,
      cellRenderer: 'EditCommentComponent',
      filter: TEXT_COLUMN_FILTER,
    },
  ];
}
