/* eslint-disable max-lines */
import { Injectable } from '@angular/core';

import { translate, TranslocoService } from '@ngneat/transloco';
import {
  ColDef,
  ValueFormatterParams,
  ValueGetterParams,
} from 'ag-grid-enterprise';

import { EditCellData } from '../../ag-grid/cell-renderer/models/edit-cell-class-params.model';
import { timestampRegex } from '../../constants';
import { Keyboard } from '../../models';
import { SAP_SYNC_STATUS } from '../../models/quotation-detail';
import { FreeStockCellComponent } from '../cell-renderer/free-stock/free-stock-cell/free-stock-cell.component';
import { FreeStockCellParams } from '../cell-renderer/free-stock/free-stock-cell/model/free-stock-cell-params.model';
import { GqPriceCellComponent } from '../cell-renderer/gq-price-cell/gq-price-cell.component';
import { SapPriceCellComponent } from '../cell-renderer/sap-price-cell/sap-price-cell.component';
import { ColumnFields } from '../constants/column-fields.enum';
import {
  FILTER_PARAMS,
  MULTI_COLUMN_FILTER,
  NUMBER_COLUMN_FILTER,
  SET_COLUMN_FILTER,
  TEXT_COLUMN_FILTER,
} from '../constants/filters';
import { ColumnUtilityService } from './column-utility.service';
import { ComparatorService } from './comparator.service';

@Injectable({
  providedIn: 'root',
})
export class ColumnDefService {
  constructor(
    private readonly columnUtilityService: ColumnUtilityService,
    private readonly translocoService: TranslocoService,
    private readonly comparatorService: ComparatorService
  ) {}

  DATE_FILTER_PARAMS = {
    filters: [
      {
        filter: TEXT_COLUMN_FILTER,
        filterParams: {
          defaultOption: 'startsWith',
          suppressAndOrCondition: true,
          buttons: ['reset'],
          textFormatter: (val: string) => {
            if (timestampRegex.test(val)) {
              return this.columnUtilityService.dateFormatter(val);
            }

            return val;
          },
        },
      },
      {
        filter: SET_COLUMN_FILTER,
        filterParams: {
          comparator: this.comparatorService.compareTranslocoDateDesc,
        },
      },
    ],
  };

  COLUMN_DEFS: ColDef[] = [
    {
      headerCheckboxSelection: true,
      headerCheckboxSelectionFilteredOnly: true,
      checkboxSelection: true,
      headerName: translate('shared.quotationDetailsTable.item'),
      field: ColumnFields.QUOTATION_ITEM_ID,
      cellRenderer: 'PositionIdComponent',
      sort: 'asc',
      pinned: 'left',
      filterParams: {
        ...FILTER_PARAMS,
        comparator: (a: string, b: string) =>
          Number.parseInt(a, 10) - Number.parseInt(b, 10),
      },
    },
    {
      headerName: translate('shared.quotationDetailsTable.materialNumber'),
      field: ColumnFields.MATERIAL_NUMBER_15,
      valueFormatter: (params) =>
        this.columnUtilityService.materialTransform(params),
      valueGetter: (params) => this.columnUtilityService.materialGetter(params),
      filterParams: FILTER_PARAMS,
    },
    {
      headerName: translate('shared.quotationDetailsTable.sapStatus'),
      field: ColumnFields.SAP_STATUS,
      filterParams: {
        ...FILTER_PARAMS,
        valueFormatter: (params: ValueFormatterParams) => {
          switch (params.value) {
            case SAP_SYNC_STATUS.SYNCED.toString(): {
              return translate('shared.sapStatusLabels.synced');
            }
            case SAP_SYNC_STATUS.NOT_SYNCED.toString(): {
              return translate('shared.sapStatusLabels.notSynced');
            }
            case SAP_SYNC_STATUS.SYNC_FAILED.toString(): {
              return translate('shared.sapStatusLabels.syncFailed');
            }
            default: {
              return params.value;
            }
          }
        },
      },
      valueFormatter: (params: ValueFormatterParams) => {
        if (!params.data.syncInSap && params.data.sapSyncErrorCode) {
          return translate('shared.sapStatusLabels.syncFailed');
        }

        return params.data.syncInSap
          ? translate('shared.sapStatusLabels.synced')
          : translate('shared.sapStatusLabels.notSynced');
      },
      valueGetter: (params: ValueGetterParams) => {
        // We need to use valueGetter here to keep the correct value formatter for excel
        // If the quotation detail is not synced and there is
        // an error message available it means the sync failed (GQUOTE-1886)
        if (!params.data.syncInSap && params.data.sapSyncErrorCode) {
          return SAP_SYNC_STATUS.SYNC_FAILED.toString();
        }

        return params.data.syncInSap
          ? SAP_SYNC_STATUS.SYNCED.toString()
          : SAP_SYNC_STATUS.NOT_SYNCED.toString();
      },
      cellRenderer: 'SapStatusCellComponent',
    },
    {
      headerName: translate('shared.quotationDetailsTable.materialDescription'),
      field: ColumnFields.MATERIAL_DESCRIPTION,
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
      headerComponentParams: {
        tooltipText: this.translocoService.translate(
          'shared.quotationDetailsTable.priceInfoText'
        ),
        editableColumn: true,
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
      headerComponentParams: {
        tooltipText: this.translocoService.translate(
          'shared.quotationDetailsTable.priceSourceInfoText'
        ),
        editableColumn: true,
      },
    },
    {
      headerName: translate('shared.quotationDetailsTable.priceUnit'),
      field: ColumnFields.SAP_PRICE_UNIT,
      valueFormatter: (params) =>
        this.columnUtilityService.numberDashFormatter(params),
      valueGetter: (params) =>
        params.data.sapPriceUnit || params.data.material.priceUnit,
      filterParams: FILTER_PARAMS,
      headerComponentParams: {
        tooltipText: this.translocoService.translate(
          'shared.quotationDetailsTable.priceUnitInfoText'
        ),
      },
    },
    {
      headerName: translate('shared.quotationDetailsTable.uom'),
      field: ColumnFields.UOM,
      filterParams: {
        ...FILTER_PARAMS,
        valueGetter: (params: ValueGetterParams) =>
          this.columnUtilityService.transformConditionUnit({
            value: params.data.material.baseUoM,
          } as ValueFormatterParams),
      },
      valueFormatter: (params: ValueFormatterParams) =>
        this.columnUtilityService.transformConditionUnit(params),
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
      headerComponentParams: {
        tooltipText: this.translocoService.translate(
          'shared.quotationDetailsTable.discountInfoText'
        ),
        editableColumn: true,
      },
    },
    {
      headerName: translate('shared.quotationDetailsTable.sapVolumeScale'),
      field: ColumnFields.SAP_VOLUME_SCALE,
      valueFormatter: (params) =>
        this.columnUtilityService.percentageFormatter(params),
      filter: NUMBER_COLUMN_FILTER,
      filterParams: this.columnUtilityService.numberFilterParams,
    },
    {
      headerName: translate('shared.quotationDetailsTable.gpc'),
      field: ColumnFields.GPC,
      valueFormatter: (params) =>
        this.columnUtilityService.numberCurrencyFormatter(params),
      filter: NUMBER_COLUMN_FILTER,
      filterParams: this.columnUtilityService.numberFilterParams,
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
      headerComponentParams: {
        tooltipText: this.translocoService.translate(
          'shared.quotationDetailsTable.gpiInfoText'
        ),
        editableColumn: true,
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
      headerComponentParams: {
        tooltipText: this.translocoService.translate(
          'shared.quotationDetailsTable.gpmInfoText'
        ),
        editableColumn: true,
      },
    },
    {
      headerName: translate(
        `shared.quotationDetailsTable.abcxClassification.title`
      ),
      field: ColumnFields.ABCX_CLASSIFICATION,
      filterParams: FILTER_PARAMS,
      valueGetter: (params: ValueGetterParams) =>
        params?.data?.abcxClassification
          ? translate(
              `shared.quotationDetailsTable.abcxClassification.${params.data.abcxClassification}`
            )
          : Keyboard.DASH,
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
      comparator: this.comparatorService.compareTranslocoDateAsc,
      valueGetter: (data) =>
        this.columnUtilityService.dateFormatter(
          data.data[ColumnFields.LAST_CUSTOMER_PRICE_DATE]
        ),
      filter: MULTI_COLUMN_FILTER,
      filterParams: this.DATE_FILTER_PARAMS,
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
      headerComponentParams: {
        tooltipText: this.translocoService.translate(
          'shared.quotationDetailsTable.lastOfferQuantityInfoText'
        ),
      },
    },
    {
      headerName: translate('shared.quotationDetailsTable.lastOfferDate'),
      field: ColumnFields.LAST_OFFER_PRICE_DATE,
      comparator: this.comparatorService.compareTranslocoDateAsc,
      valueGetter: (data) =>
        this.columnUtilityService.dateFormatter(
          data.data.lastOfferDetail?.lastOfferDate
        ),
      filter: MULTI_COLUMN_FILTER,
      filterParams: this.DATE_FILTER_PARAMS,
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
      headerComponentParams: {
        tooltipText: this.translocoService.translate(
          'shared.quotationDetailsTable.detailReasonForRejectionInfoText'
        ),
      },
    },
    {
      headerName: translate('shared.quotationDetailsTable.freeStock'),
      field: 'materialStockByPlant.freeStock',
      filterParams: NUMBER_COLUMN_FILTER,
      headerComponentParams: {
        tooltipText: this.translocoService.translate(
          'shared.quotationDetailsTable.freeStockInfoText'
        ),
      },
      cellRenderer: FreeStockCellComponent,
      cellRendererParams: (params: FreeStockCellParams) => ({
        uom: params.data.material.baseUoM,
      }),
    },
    {
      headerName: translate('shared.quotationDetailsTable.deliveryUnit'),
      field: ColumnFields.DELIVERY_UNIT,
      filter: NUMBER_COLUMN_FILTER,
      valueFormatter: (params) =>
        this.columnUtilityService.numberDashFormatter(params),
    },
    {
      headerName: translate('shared.quotationDetailsTable.dateNextFreeAtp'),
      field: ColumnFields.DATE_NEXT_FREE_ATP,
      comparator: this.comparatorService.compareTranslocoDateAsc,
      valueGetter: (params) =>
        this.columnUtilityService.dateFormatter(
          params.data.materialStockByPlant?.dateNextFree
        ),
      filter: MULTI_COLUMN_FILTER,
      filterParams: this.DATE_FILTER_PARAMS,
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
      valueFormatter: (params) =>
        this.columnUtilityService.materialTransform(params),
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
