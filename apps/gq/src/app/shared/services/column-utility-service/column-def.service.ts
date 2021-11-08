import { Injectable } from '@angular/core';

import { ColDef } from '@ag-grid-community/all-modules';
import { translate } from '@ngneat/transloco';

import { EditCellData } from '../../cell-renderer/models/edit-cell-class-params.model';
import { ColumnFields } from './column-fields.enum';
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
      cellRenderer: 'positionIdComponent',
      sort: 'asc',
      pinned: 'left',
    },
    {
      headerName: translate('shared.quotationDetailsTable.materialNumber'),
      field: ColumnFields.MATERIAL_NUMBER_15,
      valueFormatter: ColumnUtilityService.transformMaterial,
    },
    {
      headerName: translate('shared.quotationDetailsTable.materialDescription'),
      field: 'material.materialDescription',
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
    },
    {
      headerName: translate('shared.quotationDetailsTable.priceUnit'),
      field: 'material.priceUnit',
      valueFormatter: ColumnUtilityService.numberFormatter,
    },
    {
      headerName: translate('shared.quotationDetailsTable.uom'),
      field: 'material.baseUoM',
    },
    {
      headerName: translate('shared.quotationDetailsTable.netValue'),
      field: ColumnFields.NET_VALUE,
      valueFormatter: ColumnUtilityService.numberCurrencyFormatter,
    },
    {
      headerName: translate('shared.quotationDetailsTable.priceSource'),
      field: 'priceSource',
      valueFormatter: ColumnUtilityService.basicTransform,
    },
    {
      headerName: translate('shared.quotationDetailsTable.gqRating'),
      cellRenderer: 'gqRatingComponent',
      field: 'gqRating',
    },
    {
      headerName: translate('shared.quotationDetailsTable.sapGrossPrice'),
      field: 'sapGrossPrice',
      valueFormatter: ColumnUtilityService.numberCurrencyFormatter,
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
    },
    {
      headerName: translate('shared.quotationDetailsTable.gpc'),
      field: ColumnFields.GPC,
      valueFormatter: ColumnUtilityService.numberCurrencyFormatter,
    },
    {
      headerName: translate('shared.quotationDetailsTable.sqv'),
      field: ColumnFields.SQV,
      valueFormatter: ColumnUtilityService.numberCurrencyFormatter,
    },
    {
      headerName: translate('shared.quotationDetailsTable.relocCost'),
      field: ColumnFields.RELOCATION_COST,
      valueFormatter: ColumnUtilityService.numberCurrencyFormatter,
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
    },
    {
      headerName: translate('shared.quotationDetailsTable.rlm'),
      field: ColumnFields.RLM,
      valueFormatter: ColumnUtilityService.percentageFormatter,
    },
    {
      headerName: translate('shared.quotationDetailsTable.lastCustomerPrice'),
      field: ColumnFields.LAST_CUSTOMER_PRICE,
      valueFormatter: ColumnUtilityService.numberCurrencyFormatter,
    },
    {
      headerName: translate(
        'shared.quotationDetailsTable.lastCustomerPriceDate'
      ),
      field: ColumnFields.LAST_CUSTOMER_PRICE_DATE,
      filter: 'agDateColumnFilter',
      valueFormatter: ColumnUtilityService.dateFormatter,
      filterParams: ColumnUtilityService.dateFilterParams,
    },
    {
      headerName: translate('shared.quotationDetailsTable.percentDifference'),
      field: 'percentDifference',
      valueFormatter: ColumnUtilityService.percentageFormatter,
    },
    {
      headerName: translate('shared.quotationDetailsTable.lastOfferPrice'),
      field: ColumnFields.LAST_OFFER_PRICE,
      valueFormatter: ColumnUtilityService.numberCurrencyFormatter,
    },
    {
      headerName: translate('shared.quotationDetailsTable.lastOfferDate'),
      field: ColumnFields.LAST_OFFER_PRICE_DATE,
      filter: 'agDateColumnFilter',
      valueFormatter: ColumnUtilityService.dateFormatter,
      filterParams: ColumnUtilityService.dateFilterParams,
    },
    {
      headerName: translate('shared.quotationDetailsTable.reasonForRejection'),
      field: 'lastOfferDetail.reasonForRejection',
      valueFormatter: ColumnUtilityService.basicTransform,
    },
    {
      headerName: translate('shared.quotationDetailsTable.rlt'),
      field: 'rlt',
      valueFormatter: ColumnUtilityService.basicTransform,
    },
    {
      headerName: translate('shared.quotationDetailsTable.productionPlant'),
      field: 'productionPlant.plantNumber',
      valueFormatter: ColumnUtilityService.basicTransform,
    },
    {
      headerName: translate('shared.quotationDetailsTable.productionCity'),
      field: 'productionPlant.city',
      valueFormatter: ColumnUtilityService.basicTransform,
    },
    {
      headerName: translate('shared.quotationDetailsTable.productionCountry'),
      field: 'productionPlant.country',
      valueFormatter: ColumnUtilityService.basicTransform,
    },
    {
      headerName: translate('shared.quotationDetailsTable.relocPlant'),
      field: 'relocatedProductionPlant.plantNumber',
      valueFormatter: ColumnUtilityService.basicTransform,
    },
    {
      headerName: translate('shared.quotationDetailsTable.relocCity'),
      field: 'relocatedProductionPlant.city',
      valueFormatter: ColumnUtilityService.basicTransform,
    },
    {
      headerName: translate('shared.quotationDetailsTable.relocCountry'),
      field: 'relocatedProductionPlant.country',
      valueFormatter: ColumnUtilityService.basicTransform,
    },
    {
      headerName: translate('shared.quotationDetailsTable.customerMaterial'),
      field: 'customerMaterial',
      valueFormatter: ColumnUtilityService.basicTransform,
    },
    {
      headerName: translate('shared.quotationDetailsTable.productLine'),
      field: 'material.productLineId',
      valueFormatter: ColumnUtilityService.basicTransform,
    },
    {
      headerName: translate('shared.quotationDetailsTable.gpsd'),
      field: 'material.gpsdGroupId',
      valueFormatter: ColumnUtilityService.basicTransform,
    },
    {
      headerName: translate('shared.quotationDetailsTable.materialStatus'),
      field: 'material.materialStatus',
      valueFormatter: ColumnUtilityService.basicTransform,
    },
    {
      headerName: translate('shared.quotationDetailsTable.followingType'),
      field: ColumnFields.FOLLOWING_TYPE,
      valueFormatter: ColumnUtilityService.transformMaterial,
    },
    {
      headerName: translate('shared.quotationDetailsTable.itemComment'),
      field: 'comment',
      valueFormatter: ColumnUtilityService.basicTransform,
      cellRenderer: 'editCommentComponent',
    },
  ];
}
