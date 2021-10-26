import { Injectable } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';

import { ColDef, ValueSetterParams } from '@ag-grid-community/all-modules';
import { translate } from '@ngneat/transloco';
import { Store } from '@ngrx/store';

import { updateQuotationDetails } from '../../../core/store';
import { UpdateQuotationDetail } from '../../../core/store/reducers/process-case/models';
import { PriceSource } from '../../models/quotation-detail';
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
      cellRenderer: 'editQuantityComponent',
      editable: true,
      cellEditor: 'editingQuantityComponent',
      valueSetter: (params: ValueSetterParams) => {
        if (params.newValue) {
          this.selectNewQuantity(params.newValue, params.data.gqPositionId);
        }

        return true;
      },
    },
    {
      headerName: translate('shared.quotationDetailsTable.price'),
      field: ColumnFields.PRICE,
      valueFormatter: ColumnUtilityService.numberCurrencyFormatter,
      cellRenderer: 'editPriceComponent',
      editable: true,
      cellEditor: 'editingPriceComponent',
      valueSetter: (params: ValueSetterParams) => {
        if (params.newValue) {
          this.selectManualPrice(
            Number.parseFloat(params.newValue),
            params.data.gqPositionId,
            params.data.material.priceUnit
          );
        }

        return true;
      },
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
    },
    {
      headerName: translate('shared.quotationDetailsTable.gpm'),
      field: ColumnFields.GPM,
      valueFormatter: ColumnUtilityService.percentageFormatter,
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

  constructor(
    private readonly store: Store,
    private readonly snackBar: MatSnackBar
  ) {}

  public selectManualPrice(
    newPrice: number,
    gqPositionId: string,
    priceUnit: number
  ): void {
    if (newPrice === 0) {
      this.snackBar.open(
        translate('shared.snackBarMessages.priceShouldBeHigherThanZero')
      );

      return;
    }
    const price = newPrice / priceUnit;

    const updateQuotationDetailList: UpdateQuotationDetail[] = [
      {
        price,
        gqPositionId,
        priceSource: PriceSource.MANUAL,
      },
    ];
    this.store.dispatch(updateQuotationDetails({ updateQuotationDetailList }));
  }
  public selectNewQuantity(orderQuantity: number, gqPositionId: string): void {
    const updateQuotationDetailList: UpdateQuotationDetail[] = [
      {
        orderQuantity,
        gqPositionId,
      },
    ];
    this.store.dispatch(updateQuotationDetails({ updateQuotationDetailList }));
  }
}
