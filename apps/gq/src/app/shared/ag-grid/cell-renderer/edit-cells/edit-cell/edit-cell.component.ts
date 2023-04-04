import { Component } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';

import { distinctUntilChanged, Observable } from 'rxjs';

import { getSimulatedQuotationDetailByItemId } from '@gq/core/store/selectors';
import { QuotationDetailsTableValidationService } from '@gq/process-case-view/quotation-details-table/services/quotation-details-table-validation.service';
import { PRICE_VALIDITY_MARGIN_THRESHOLD } from '@gq/shared/constants';
import { Store } from '@ngrx/store';
import { ICellRendererAngularComp } from 'ag-grid-angular';

import { EditingModalComponent } from '../../../../components/modal/editing-modal/editing-modal.component';
import { QuotationStatus } from '../../../../models';
import { QuotationDetail } from '../../../../models/quotation-detail';
import { ColumnFields } from '../../../constants/column-fields.enum';
import { ExtendedEditCellClassParams } from '../../models/extended-cell-class-params.model';

@Component({
  selector: 'gq-edit-cell',
  templateUrl: './edit-cell.component.html',
})
export class EditCellComponent implements ICellRendererAngularComp {
  params: ExtendedEditCellClassParams;
  isCellEditingAllowed: boolean;

  isWarningEnabled: boolean;
  isInvalidPriceError: boolean;
  warningTooltip = '';

  simulatedQuotation$: Observable<QuotationDetail>;
  quotationStatus = QuotationStatus;

  constructor(
    private readonly dialog: MatDialog,
    private readonly store: Store
  ) {}

  agInit(params: ExtendedEditCellClassParams): void {
    this.params = params;

    // check if cell editing should be possible
    this.handleCellEditing(params);

    // check if cell value is invalid and show info
    this.handleInvalidStates(params);

    // check if quotation simulation is possible
    this.handleQuotationSimulation(params);
  }

  handleQuotationSimulation(params: ExtendedEditCellClassParams): void {
    if (
      [
        ColumnFields.PRICE,
        ColumnFields.DISCOUNT,
        ColumnFields.GPI,
        ColumnFields.GPM,
        ColumnFields.PRICE_DIFF,
        ColumnFields.RLM,
        ColumnFields.NET_VALUE,
        ColumnFields.PRICE_SOURCE,
      ].includes(params.field as ColumnFields)
    ) {
      this.simulatedQuotation$ = this.store
        .select(
          getSimulatedQuotationDetailByItemId(params.data.quotationItemId)
        )
        .pipe(distinctUntilChanged());
    }
  }

  handleCellEditing(params: ExtendedEditCellClassParams): void {
    this.isCellEditingAllowed =
      // editing is enabled
      (!params.condition.enabled ||
        params.data[params.condition.conditionField]) &&
      params.field !== ColumnFields.PRICE_DIFF &&
      params.field !== ColumnFields.RLM &&
      params.field !== ColumnFields.NET_VALUE &&
      params.field !== ColumnFields.PRICE_SOURCE;
  }

  handleInvalidStates(params: ExtendedEditCellClassParams): void {
    if (params.field === ColumnFields.PRICE) {
      this.checkPriceValidity(
        params.value,
        params.data.msp,
        params.data.gpi,
        params.data.gpm
      );
    } else if (params.field === ColumnFields.ORDER_QUANTITY) {
      this.checkQuantityValidity(params.value, params.data.deliveryUnit);
    }
  }

  checkPriceValidity(
    price: number,
    msp: number,
    gpi: number,
    gpm: number
  ): void {
    this.isInvalidPriceError = price < msp;
    const isInvalidMargin =
      gpi < PRICE_VALIDITY_MARGIN_THRESHOLD ||
      gpm < PRICE_VALIDITY_MARGIN_THRESHOLD;

    if (this.isInvalidPriceError) {
      this.warningTooltip = 'priceLowerThanMsp';
    } else if (isInvalidMargin) {
      this.warningTooltip = 'gpmOrGpiTooLow';
    }

    this.isWarningEnabled = this.isInvalidPriceError || isInvalidMargin;
  }

  checkQuantityValidity(quantity: number, deliveryUnit: number): void {
    const isOrderQuantityInvalid =
      QuotationDetailsTableValidationService.isOrderQuantityInvalid(
        quantity,
        deliveryUnit
      );

    if (isOrderQuantityInvalid) {
      this.warningTooltip = 'orderQuantityMustBeMultipleOf';
      this.isWarningEnabled = true;
    }
  }

  onIconClick(): void {
    this.dialog.open(EditingModalComponent, {
      width: '684px',
      data: {
        quotationDetail: this.params.data as QuotationDetail,
        field: this.params.field,
      },
    });
  }

  refresh() {
    return true;
  }
}
