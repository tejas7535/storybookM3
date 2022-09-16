/* eslint-disable max-lines */
import { Injectable } from '@angular/core';

import { translate, TranslocoService } from '@ngneat/transloco';
import { ColDef, ValueGetterParams } from 'ag-grid-enterprise';

import { EditCellData } from '../../ag-grid/cell-renderer/models/edit-cell-class-params.model';
import { GqPriceCellComponent } from '../cell-renderer/gq-price-cell/gq-price-cell.component';
import { SapPriceCellComponent } from '../cell-renderer/sap-price-cell/sap-price-cell.component';
import { EditableColumnHeaderComponent } from '../column-headers/editable-column-header/editable-column-header.component';
import { HeaderInfoIconComponent } from '../column-headers/header-info-icon/header-info-icon.component';
import { ColumnFields } from '../constants/column-fields.enum';
import {
  FILTER_PARAMS,
  MULTI_COLUMN_FILTER,
  MULTI_COLUMN_FILTER_PARAMS,
  NUMBER_COLUMN_FILTER,
  TEXT_COLUMN_FILTER,
} from '../constants/filters';
import { ColumnUtilityService } from './column-utility.service';
@Injectable({
  providedIn: 'root',
})
export class ColumnDefService {
  constructor(
    private readonly columnUtilityService: ColumnUtilityService,
    private readonly translocoService: TranslocoService
  ) {}

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
      valueFormatter: (params) =>
        this.columnUtilityService.numberDashFormatter(params),
      cellRenderer: 'EditCellComponent',
      cellRendererParams: {
        condition: { enabled: false },
        field: ColumnFields.ORDER_QUANTITY,
      } as EditCellData,
      filter: NUMBER_COLUMN_FILTER,
      filterParams: ColumnUtilityService.integerFilterParams,
    },
    {
      headerName: translate('shared.quotationDetailsTable.price'),
      field: ColumnFields.PRICE,
      valueFormatter: (params) =>
        this.columnUtilityService.numberCurrencyFormatter(params),
      cellRenderer: 'EditCellComponent',
      cellRendererParams: {
        condition: { enabled: false },
        field: ColumnFields.PRICE,
      } as EditCellData,
      filter: NUMBER_COLUMN_FILTER,
      filterParams: this.columnUtilityService.numberFilterParams,
      headerComponentFramework: EditableColumnHeaderComponent,
      headerComponent: EditableColumnHeaderComponent,
      headerComponentParams: {
        tooltipText: this.translocoService.translate(
          'shared.quotationDetailsTable.priceInfoText'
        ),
      },
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
      headerComponentParams: {
        tooltipText: this.translocoService.translate(
          'shared.quotationDetailsTable.priceSourceInfoText'
        ),
      },
    },
    {
      headerName: translate('shared.quotationDetailsTable.priceUnit'),
      field: 'material.priceUnit',
      valueFormatter: (params) =>
        this.columnUtilityService.numberDashFormatter(params),
      filterParams: FILTER_PARAMS,
      headerComponent: HeaderInfoIconComponent,
      headerComponentParams: {
        tooltipText: this.translocoService.translate(
          'shared.quotationDetailsTable.priceUnitInfoText'
        ),
      },
    },
    {
      headerName: translate('shared.quotationDetailsTable.uom'),
      field: ColumnFields.UOM,
      filterParams: FILTER_PARAMS,
      valueFormatter: ColumnUtilityService.transformConditionUnit,
      headerComponent: HeaderInfoIconComponent,
      headerComponentParams: {
        tooltipText: this.translocoService.translate(
          'shared.quotationDetailsTable.uomInfoText'
        ),
      },
    },
    {
      headerName: translate('shared.quotationDetailsTable.netValue'),
      field: ColumnFields.NET_VALUE,
      valueFormatter: (params) =>
        this.columnUtilityService.numberCurrencyFormatter(params),
      filter: NUMBER_COLUMN_FILTER,
      filterParams: this.columnUtilityService.numberFilterParams,
      cellRenderer: 'EditCellComponent',
      cellRendererParams: {
        condition: { enabled: false },
        field: ColumnFields.NET_VALUE,
      } as EditCellData,
      headerComponent: HeaderInfoIconComponent,
      headerComponentParams: {
        tooltipText: this.translocoService.translate(
          'shared.quotationDetailsTable.netValueInfoText'
        ),
      },
    },
    {
      headerName: translate('shared.quotationDetailsTable.gqPrice'),
      field: ColumnFields.RECOMMENDED_PRICE,
      valueFormatter: (params) =>
        this.columnUtilityService.numberCurrencyFormatter(params),
      filter: NUMBER_COLUMN_FILTER,
      filterParams: this.columnUtilityService.numberFilterParams,
      cellRenderer: GqPriceCellComponent,
      headerComponent: HeaderInfoIconComponent,
      headerComponentParams: {
        tooltipText: this.translocoService.translate(
          'shared.quotationDetailsTable.gqPriceInfoText'
        ),
      },
      width: 185,
    },
    {
      headerName: translate('shared.quotationDetailsTable.gqRating'),
      cellRenderer: 'GqRatingComponent',
      field: 'gqRating',
      filterParams: FILTER_PARAMS,
      headerComponent: HeaderInfoIconComponent,
      headerComponentParams: {
        tooltipText: this.translocoService.translate(
          'shared.quotationDetailsTable.gqRatingInfoText'
        ),
      },
    },
    {
      headerName: translate('shared.quotationDetailsTable.sapPrice'),
      field: ColumnFields.SAP_PRICE,
      valueFormatter: (params) =>
        this.columnUtilityService.numberCurrencyFormatter(params),
      filter: NUMBER_COLUMN_FILTER,
      filterParams: this.columnUtilityService.numberFilterParams,
      cellRenderer: SapPriceCellComponent,
      headerComponent: HeaderInfoIconComponent,
      headerComponentParams: {
        tooltipText: this.translocoService.translate(
          'shared.quotationDetailsTable.sapPriceInfoText'
        ),
      },
      width: 190,
    },
    {
      headerName: translate('shared.quotationDetailsTable.rsp'),
      field: ColumnFields.RSP,
      valueFormatter: (params) =>
        this.columnUtilityService.numberCurrencyFormatter(params),
      filter: NUMBER_COLUMN_FILTER,
      filterParams: this.columnUtilityService.numberFilterParams,
      headerComponent: HeaderInfoIconComponent,
      headerComponentParams: {
        tooltipText: this.translocoService.translate(
          'shared.quotationDetailsTable.rspInfoText'
        ),
      },
    },
    {
      headerName: translate('shared.quotationDetailsTable.msp'),
      field: ColumnFields.MSP,
      valueFormatter: (params) =>
        this.columnUtilityService.numberCurrencyFormatter(params),
      filter: NUMBER_COLUMN_FILTER,
      filterParams: this.columnUtilityService.numberFilterParams,
      headerComponent: HeaderInfoIconComponent,
      headerComponentParams: {
        tooltipText: this.translocoService.translate(
          'shared.quotationDetailsTable.mspInfoText'
        ),
      },
    },
    {
      headerName: translate('shared.quotationDetailsTable.sapGrossPrice'),
      field: ColumnFields.SAP_GROSS_PRICE,
      valueFormatter: (params) =>
        this.columnUtilityService.numberCurrencyFormatter(params),
      filter: NUMBER_COLUMN_FILTER,
      filterParams: this.columnUtilityService.numberFilterParams,
    },
    {
      headerName: translate('shared.quotationDetailsTable.discount'),
      field: ColumnFields.DISCOUNT,
      valueFormatter: (params) =>
        this.columnUtilityService.percentageFormatter(params),
      editable: true,
      cellRenderer: 'EditCellComponent',
      cellRendererParams: {
        condition: { enabled: true, conditionField: 'sapGrossPrice' },
        field: ColumnFields.DISCOUNT,
      } as EditCellData,
      filter: NUMBER_COLUMN_FILTER,
      filterParams: this.columnUtilityService.numberFilterParams,
      headerComponentFramework: EditableColumnHeaderComponent,
      headerComponent: EditableColumnHeaderComponent,
      headerComponentParams: {
        tooltipText: this.translocoService.translate(
          'shared.quotationDetailsTable.discountInfoText'
        ),
      },
    },
    {
      headerName: translate('shared.quotationDetailsTable.gpc'),
      field: ColumnFields.GPC,
      valueFormatter: (params) =>
        this.columnUtilityService.numberCurrencyFormatter(params),
      filter: NUMBER_COLUMN_FILTER,
      filterParams: this.columnUtilityService.numberFilterParams,
      headerComponent: HeaderInfoIconComponent,
      headerComponentParams: {
        tooltipText: this.translocoService.translate(
          'shared.quotationDetailsTable.gpcInfoText'
        ),
      },
    },
    {
      headerName: translate('shared.quotationDetailsTable.sqv'),
      field: ColumnFields.SQV,
      valueFormatter: (params) =>
        this.columnUtilityService.numberCurrencyFormatter(params),
      filter: NUMBER_COLUMN_FILTER,
      filterParams: this.columnUtilityService.numberFilterParams,
      headerComponent: HeaderInfoIconComponent,
      headerComponentParams: {
        tooltipText: this.translocoService.translate(
          'shared.quotationDetailsTable.sqvInfoText'
        ),
      },
    },
    {
      headerName: translate('shared.quotationDetailsTable.relocCost'),
      field: ColumnFields.RELOCATION_COST,
      valueFormatter: (params) =>
        this.columnUtilityService.numberCurrencyFormatter(params),
      filter: NUMBER_COLUMN_FILTER,
      filterParams: this.columnUtilityService.numberFilterParams,
      headerComponent: HeaderInfoIconComponent,
      headerComponentParams: {
        tooltipText: this.translocoService.translate(
          'shared.quotationDetailsTable.relocCostInfoText'
        ),
      },
    },
    {
      headerName: translate('shared.quotationDetailsTable.gpi'),
      field: ColumnFields.GPI,
      valueFormatter: (params) =>
        this.columnUtilityService.percentageFormatter(params),
      cellRenderer: 'EditCellComponent',
      cellRendererParams: {
        condition: { enabled: true, conditionField: ColumnFields.GPC },
        field: ColumnFields.GPI,
      } as EditCellData,
      filter: NUMBER_COLUMN_FILTER,
      filterParams: this.columnUtilityService.numberFilterParams,
      headerComponentFramework: EditableColumnHeaderComponent,
      headerComponent: EditableColumnHeaderComponent,
      headerComponentParams: {
        tooltipText: this.translocoService.translate(
          'shared.quotationDetailsTable.gpiInfoText'
        ),
      },
    },
    {
      headerName: translate('shared.quotationDetailsTable.gpm'),
      field: ColumnFields.GPM,
      valueFormatter: (params) =>
        this.columnUtilityService.percentageFormatter(params),
      cellRenderer: 'EditCellComponent',
      cellRendererParams: {
        condition: { enabled: true, conditionField: ColumnFields.SQV },
        field: ColumnFields.GPM,
      } as EditCellData,
      filter: NUMBER_COLUMN_FILTER,
      filterParams: this.columnUtilityService.numberFilterParams,
      headerComponentFramework: EditableColumnHeaderComponent,
      headerComponent: EditableColumnHeaderComponent,
      headerComponentParams: {
        tooltipText: this.translocoService.translate(
          'shared.quotationDetailsTable.gpmInfoText'
        ),
      },
    },
    {
      headerName: translate('shared.quotationDetailsTable.rlm'),
      field: ColumnFields.RLM,
      valueFormatter: (params) =>
        this.columnUtilityService.percentageFormatter(params),
      filter: NUMBER_COLUMN_FILTER,
      filterParams: this.columnUtilityService.numberFilterParams,
      cellRenderer: 'EditCellComponent',
      cellRendererParams: {
        condition: { enabled: false },
        field: ColumnFields.RLM,
      } as EditCellData,
      headerComponent: HeaderInfoIconComponent,
      headerComponentParams: {
        tooltipText: this.translocoService.translate(
          'shared.quotationDetailsTable.rlmInfoText'
        ),
      },
    },
    {
      headerName: translate('shared.quotationDetailsTable.lastCustomerPrice'),
      field: ColumnFields.LAST_CUSTOMER_PRICE,
      valueFormatter: (params) =>
        this.columnUtilityService.numberCurrencyFormatter(params),
      filter: NUMBER_COLUMN_FILTER,
      filterParams: this.columnUtilityService.numberFilterParams,
      headerComponent: HeaderInfoIconComponent,
      headerComponentParams: {
        tooltipText: this.translocoService.translate(
          'shared.quotationDetailsTable.lastCustomerPriceInfoText'
        ),
      },
    },
    {
      headerName: translate(
        'shared.quotationDetailsTable.lastCustomerPriceQuantity'
      ),
      field: ColumnFields.LAST_CUSTOMER_PRICE_QUANTITY,
      valueFormatter: (params) =>
        this.columnUtilityService.numberDashFormatter(params),
      filter: NUMBER_COLUMN_FILTER,
      filterParams: ColumnUtilityService.integerFilterParams,
      headerComponent: HeaderInfoIconComponent,
      headerComponentParams: {
        tooltipText: this.translocoService.translate(
          'shared.quotationDetailsTable.lastCustomerPriceQuantityInfoText'
        ),
      },
    },
    {
      headerName: translate(
        'shared.quotationDetailsTable.lastCustomerPriceGpi'
      ),
      field: ColumnFields.LAST_CUSTOMER_PRICE_GPI,
      valueFormatter: (params) =>
        this.columnUtilityService.percentageFormatter(params),
      filter: NUMBER_COLUMN_FILTER,
      filterParams: this.columnUtilityService.numberFilterParams,
      headerComponent: HeaderInfoIconComponent,
      headerComponentParams: {
        tooltipText: this.translocoService.translate(
          'shared.quotationDetailsTable.lastCustomerPriceGpiInfoText'
        ),
      },
    },
    {
      headerName: translate(
        'shared.quotationDetailsTable.lastCustomerPriceGpm'
      ),
      field: ColumnFields.LAST_CUSTOMER_PRICE_GPM,
      valueFormatter: (params) =>
        this.columnUtilityService.percentageFormatter(params),
      filter: NUMBER_COLUMN_FILTER,
      filterParams: this.columnUtilityService.numberFilterParams,
      headerComponent: HeaderInfoIconComponent,
      headerComponentParams: {
        tooltipText: this.translocoService.translate(
          'shared.quotationDetailsTable.lastCustomerPriceGpmInfoText'
        ),
      },
    },
    {
      headerName: translate(
        'shared.quotationDetailsTable.lastCustomerPriceDate'
      ),
      field: ColumnFields.LAST_CUSTOMER_PRICE_DATE,
      valueGetter: (data) =>
        this.columnUtilityService.dateFormatter(
          data.data[ColumnFields.LAST_CUSTOMER_PRICE_DATE]
        ),
      filter: MULTI_COLUMN_FILTER,
      filterParams: MULTI_COLUMN_FILTER_PARAMS,
      headerComponent: HeaderInfoIconComponent,
      headerComponentParams: {
        tooltipText: this.translocoService.translate(
          'shared.quotationDetailsTable.lastCustomerPriceDateInfoText'
        ),
      },
    },
    {
      headerName: translate(
        'shared.quotationDetailsTable.lastCustomerPriceCondition'
      ),
      field: ColumnFields.LAST_CUSTOMER_PRICE_CONDITION,
      valueFormatter: ColumnUtilityService.transformLastCustomerPriceCondition,
      filterParams: FILTER_PARAMS,
    },
    {
      headerName: translate('shared.quotationDetailsTable.priceDiff'),
      field: ColumnFields.PRICE_DIFF,
      headerComponent: HeaderInfoIconComponent,
      headerComponentParams: {
        tooltipText: this.translocoService.translate(
          'shared.quotationDetailsTable.priceDiffInfoText'
        ),
      },
      valueFormatter: (params) =>
        this.columnUtilityService.percentageFormatter(params),
      filter: NUMBER_COLUMN_FILTER,
      filterParams: this.columnUtilityService.numberFilterParams,
      cellRenderer: 'EditCellComponent',
      cellRendererParams: {
        condition: { enabled: false },
        field: ColumnFields.PRICE_DIFF,
      } as EditCellData,
      width: 225,
    },
    {
      headerName: translate('shared.quotationDetailsTable.lastOfferPrice'),
      field: ColumnFields.LAST_OFFER_PRICE,
      filterParams: this.columnUtilityService.numberFilterParams,
      valueFormatter: (params) =>
        this.columnUtilityService.numberCurrencyFormatter(params),
      filter: NUMBER_COLUMN_FILTER,
      headerComponent: HeaderInfoIconComponent,
      headerComponentParams: {
        tooltipText: this.translocoService.translate(
          'shared.quotationDetailsTable.lastOfferPriceInfoText'
        ),
      },
    },
    {
      headerName: translate('shared.quotationDetailsTable.lastOfferQuantity'),
      field: ColumnFields.LAST_OFFER_QUANTITY,
      valueFormatter: (params) =>
        this.columnUtilityService.numberDashFormatter(params),
      filter: NUMBER_COLUMN_FILTER,
      filterParams: ColumnUtilityService.integerFilterParams,
      headerComponent: HeaderInfoIconComponent,
      headerComponentParams: {
        tooltipText: this.translocoService.translate(
          'shared.quotationDetailsTable.lastOfferQuantityInfoText'
        ),
      },
    },
    {
      headerName: translate('shared.quotationDetailsTable.lastOfferDate'),
      field: ColumnFields.LAST_OFFER_PRICE_DATE,
      valueGetter: (data) =>
        this.columnUtilityService.dateFormatter(
          data.data[ColumnFields.LAST_OFFER_PRICE_DATE]
        ),
      filter: MULTI_COLUMN_FILTER,
      filterParams: MULTI_COLUMN_FILTER_PARAMS,
      headerComponent: HeaderInfoIconComponent,
      headerComponentParams: {
        tooltipText: this.translocoService.translate(
          'shared.quotationDetailsTable.lastOfferDateInfoText'
        ),
      },
    },
    {
      headerName: translate('shared.quotationDetailsTable.reasonForRejection'),
      field: 'lastOfferDetail.reasonForRejection',
      valueFormatter: ColumnUtilityService.basicTransform,
      filterParams: FILTER_PARAMS,
      headerComponent: HeaderInfoIconComponent,
      headerComponentParams: {
        tooltipText: this.translocoService.translate(
          'shared.quotationDetailsTable.reasonForRejectionInfoText'
        ),
      },
    },
    {
      headerName: translate(
        'shared.quotationDetailsTable.detailReasonForRejection'
      ),
      field: 'lastOfferDetail.detailReasonForRejection',
      valueFormatter: ColumnUtilityService.basicTransform,
      filterParams: FILTER_PARAMS,
      headerComponent: HeaderInfoIconComponent,
      headerComponentParams: {
        tooltipText: this.translocoService.translate(
          'shared.quotationDetailsTable.detailReasonForRejectionInfoText'
        ),
      },
    },
    {
      headerName: translate('shared.quotationDetailsTable.freeStock'),
      field: 'materialStockByPlant.freeStock',
      valueFormatter: (params) =>
        this.columnUtilityService.numberDashFormatter(params),
      filterParams: NUMBER_COLUMN_FILTER,
      headerComponent: HeaderInfoIconComponent,
      headerComponentParams: {
        tooltipText: this.translocoService.translate(
          'shared.quotationDetailsTable.freeStockInfoText'
        ),
      },
    },
    {
      headerName: translate('shared.quotationDetailsTable.dateNextFreeAtp'),
      field: ColumnFields.DATE_NEXT_FREE_ATP,
      valueGetter: (data) =>
        this.columnUtilityService.dateFormatter(
          data.data[ColumnFields.DATE_NEXT_FREE_ATP]
        ),
      filter: MULTI_COLUMN_FILTER,
      filterParams: MULTI_COLUMN_FILTER_PARAMS,
      headerComponent: HeaderInfoIconComponent,
      headerComponentParams: {
        tooltipText: this.translocoService.translate(
          'shared.quotationDetailsTable.dateNextFreeAtpInfoText'
        ),
      },
    },
    {
      headerName: translate(
        'shared.quotationDetailsTable.materialClassificationSOP'
      ),
      field: 'materialClassificationSOP',
      valueGetter: (params: ValueGetterParams) =>
        ColumnUtilityService.transformMaterialClassificationSOP(
          params.data.materialClassificationSOP
        ),
      filterParams: FILTER_PARAMS,
      headerComponent: HeaderInfoIconComponent,
      headerComponentParams: {
        tooltipText: this.translocoService.translate(
          'shared.quotationDetailsTable.materialClassificationSOPInfoText'
        ),
      },
    },
    {
      headerName: translate('shared.quotationDetailsTable.rlt'),
      field: 'rlt',
      valueFormatter: ColumnUtilityService.basicTransform,
      filterParams: FILTER_PARAMS,
      headerComponent: HeaderInfoIconComponent,
      headerComponentParams: {
        tooltipText: this.translocoService.translate(
          'shared.quotationDetailsTable.rltInfoText'
        ),
      },
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
      headerComponent: HeaderInfoIconComponent,
      headerComponentParams: {
        tooltipText: this.translocoService.translate(
          'shared.quotationDetailsTable.relocPlantInfoText'
        ),
      },
    },
    {
      headerName: translate('shared.quotationDetailsTable.relocCity'),
      field: 'relocatedProductionPlant.city',
      valueFormatter: ColumnUtilityService.basicTransform,
      filterParams: FILTER_PARAMS,
      headerComponent: HeaderInfoIconComponent,
      headerComponentParams: {
        tooltipText: this.translocoService.translate(
          'shared.quotationDetailsTable.relocCityInfoText'
        ),
      },
    },
    {
      headerName: translate('shared.quotationDetailsTable.relocCountry'),
      field: 'relocatedProductionPlant.country',
      valueFormatter: ColumnUtilityService.basicTransform,
      filterParams: FILTER_PARAMS,
      headerComponent: HeaderInfoIconComponent,
      headerComponentParams: {
        tooltipText: this.translocoService.translate(
          'shared.quotationDetailsTable.relocCountryInfoText'
        ),
      },
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
      headerComponent: HeaderInfoIconComponent,
      headerComponentParams: {
        tooltipText: this.translocoService.translate(
          'shared.quotationDetailsTable.productLineInfoText'
        ),
      },
    },
    {
      headerName: translate('shared.quotationDetailsTable.gpsd'),
      field: 'material.gpsdGroupId',
      valueFormatter: ColumnUtilityService.basicTransform,
      filterParams: FILTER_PARAMS,
      headerComponent: HeaderInfoIconComponent,
      headerComponentParams: {
        tooltipText: this.translocoService.translate(
          'shared.quotationDetailsTable.gpsdInfoText'
        ),
      },
    },
    {
      headerName: translate('shared.quotationDetailsTable.materialStatus'),
      field: 'material.materialStatus',
      valueFormatter: ColumnUtilityService.basicTransform,
      filterParams: FILTER_PARAMS,
    },
    {
      headerName: translate('shared.quotationDetailsTable.strategicMaterial'),
      field: ColumnFields.STRATEGIC_MATERIAL,
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
