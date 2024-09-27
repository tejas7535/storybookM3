import { Component, inject } from '@angular/core';

import { distinctUntilChanged, Observable, of, take } from 'rxjs';

import { ActiveCaseFacade } from '@gq/core/store/active-case/active-case.facade';
import { RolesFacade } from '@gq/core/store/facades/roles.facade';
import { QuotationDetailsTableValidationService } from '@gq/process-case-view/quotation-details-table/services/validation/quotation-details-table-validation.service';
import { ColumnFields } from '@gq/shared/ag-grid/constants/column-fields.enum';
import { EditingModalService } from '@gq/shared/components/modal/editing-modal/editing-modal.service';
import { PRICE_VALIDITY_MARGIN_THRESHOLD } from '@gq/shared/constants';
import { ICellRendererAngularComp } from 'ag-grid-angular';

import { QuotationStatus } from '../../../../models';
import { QuotationDetail } from '../../../../models/quotation-detail';
import { ExtendedEditCellClassParams } from '../../models/extended-cell-class-params.model';

@Component({
  selector: 'gq-edit-cell',
  templateUrl: './edit-cell.component.html',
})
export class EditCellComponent implements ICellRendererAngularComp {
  private readonly editingModalService: EditingModalService =
    inject(EditingModalService);
  private readonly rolesFacade: RolesFacade = inject(RolesFacade);
  private readonly activeCaseFacade: ActiveCaseFacade =
    inject(ActiveCaseFacade);

  params: ExtendedEditCellClassParams;
  isCellEditingAllowed: boolean;
  isWarningEnabled: boolean;
  isInvalidPriceError: boolean;
  warningTooltip = '';

  simulatedQuotation$: Observable<QuotationDetail>;
  quotationStatus = QuotationStatus;
  simulatedField$: Observable<ColumnFields> =
    this.activeCaseFacade.simulatedField$;
  simulatedField: ColumnFields;
  simulatedColumns = [
    ColumnFields.PRICE,
    ColumnFields.DISCOUNT,
    ColumnFields.GPI,
    ColumnFields.GPM,
    ColumnFields.PRICE_DIFF,
    ColumnFields.RLM,
    ColumnFields.NET_VALUE,
    ColumnFields.PRICE_SOURCE,
  ];

  agInit(params: ExtendedEditCellClassParams): void {
    this.params = params;

    // check if cell editing should be possible
    this.handleCellEditing(params);

    // check if cell value is invalid and show info
    this.handleInvalidStates(params);

    // handle simulation for every change in simulated field
    this.simulatedField$.subscribe((simulatedField: ColumnFields) => {
      this.simulatedField = simulatedField;
      this.handleQuotationSimulation(params);
    });
  }

  handleQuotationSimulation(params: ExtendedEditCellClassParams): void {
    // if target price column is simulated, only show simulated quotation for target price
    if (params.field === ColumnFields.TARGET_PRICE) {
      this.simulatedQuotation$ =
        this.simulatedField === ColumnFields.TARGET_PRICE
          ? this.activeCaseFacade
              .getSimulatedQuotationDetailByItemId$(params.data.quotationItemId)
              .pipe(distinctUntilChanged())
          : of(null);
    }

    // if any other column is simulated, show simulated quotation for all columns in the simulatedColumns array
    if (this.simulatedColumns.includes(params.field as ColumnFields)) {
      this.simulatedQuotation$ =
        this.simulatedField === ColumnFields.TARGET_PRICE
          ? of(null)
          : this.activeCaseFacade
              .getSimulatedQuotationDetailByItemId$(params.data.quotationItemId)
              .pipe(distinctUntilChanged());
    }
  }

  handleCellEditing(params: ExtendedEditCellClassParams): void {
    if (params.role) {
      this.rolesFacade
        .userHasRole$(params.role)
        .pipe(take(1))
        .subscribe((userHasNeededRole: boolean) =>
          this.setCellEditingAllowed(params, userHasNeededRole)
        );
    } else {
      this.setCellEditingAllowed(params, true);
    }
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
    this.editingModalService.openEditingModal({
      quotationDetail: this.params.data as QuotationDetail,
      field: this.params.field as ColumnFields,
    });
  }

  refresh() {
    return true;
  }

  private setCellEditingAllowed(
    params: ExtendedEditCellClassParams,
    userHasNeededRole: boolean
  ): void {
    this.isCellEditingAllowed =
      // editing is enabled
      (!params.condition.enabled ||
        params.data[params.condition.conditionField]) &&
      userHasNeededRole &&
      params.field !== ColumnFields.PRICE_DIFF &&
      params.field !== ColumnFields.RLM &&
      params.field !== ColumnFields.NET_VALUE &&
      params.field !== ColumnFields.PRICE_SOURCE;
  }
}
