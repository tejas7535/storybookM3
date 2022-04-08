import { Component } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';

import { distinctUntilChanged, Observable } from 'rxjs';

import { ICellRendererAngularComp } from '@ag-grid-community/angular';
import { ICellRendererParams } from '@ag-grid-community/core';
import { translate } from '@ngneat/transloco';
import { Store } from '@ngrx/store';

import { TableContext } from '../../../../../app/process-case-view/quotation-details-table/config/tablecontext.model';
import { getSimulatedQuotationDetailByItemId } from '../../../../core/store';
import { ColumnFields } from '../../../ag-grid/constants/column-fields.enum';
import { EditingModalComponent } from '../../../components/modal/editing-modal/editing-modal.component';
import { QuotationDetail } from '../../../models/quotation-detail';
import { ExtendedEditCellClassParams } from '../../models/extended-cell-class-params.model';

@Component({
  selector: 'gq-edit-cell',
  templateUrl: './edit-cell.component.html',
})
export class EditCellComponent implements ICellRendererAngularComp {
  public params: ICellRendererParams & ExtendedEditCellClassParams;
  public isCellEditingAllowed: boolean;
  public priceWarningEnabled = false;
  public text = translate(
    'shared.quotationDetailsTable.toolTip.priceLowerThanMsp'
  );
  public simulatedQuotation$: Observable<QuotationDetail>;

  constructor(
    private readonly dialog: MatDialog,
    private readonly store: Store
  ) {}

  agInit(params: ICellRendererParams & ExtendedEditCellClassParams): void {
    this.params = params;

    this.isCellEditingAllowed =
      // editing is enabled
      (!params.condition.enabled ||
        params.data[params.condition.conditionField]) &&
      // exception for quantity
      !(
        params.field === ColumnFields.ORDER_QUANTITY &&
        !!(params.context as TableContext).quotation.sapId
      ) &&
      !(
        params.field === ColumnFields.PRICE && params.data.price === undefined
      ) &&
      params.field !== ColumnFields.PRICE_DIFF &&
      params.field !== ColumnFields.RLM &&
      params.field !== ColumnFields.NET_VALUE;

    this.priceWarningEnabled =
      params.field === ColumnFields.PRICE && params.value < params.data.msp;

    if (
      [
        ColumnFields.PRICE,
        ColumnFields.DISCOUNT,
        ColumnFields.GPI,
        ColumnFields.GPM,
        ColumnFields.PRICE_DIFF,
        ColumnFields.RLM,
        ColumnFields.NET_VALUE,
      ].includes(params.field as ColumnFields)
    ) {
      this.simulatedQuotation$ = this.store
        .select(
          getSimulatedQuotationDetailByItemId(params.data.quotationItemId)
        )
        .pipe(distinctUntilChanged());
    }
  }

  onIconClick(): void {
    this.dialog.open(EditingModalComponent, {
      width: '684px',
      data: {
        quotationDetail: this.params.data as QuotationDetail,
        field: this.params.field,
      },
      disableClose: true,
    });
  }

  refresh() {
    return true;
  }
}
