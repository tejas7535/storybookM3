import { Component } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';

import { translate } from '@ngneat/transloco';

import { TableContext } from '../../../../../app/process-case-view/quotation-details-table/config/tablecontext.model';
import { ColumnFields } from '../../../ag-grid/constants/column-fields.enum';
import { EditingModalComponent } from '../../../components/editing-modal/editing-modal.component';
import { QuotationDetail } from '../../../models/quotation-detail';
import { ExtendedEditCellClassParams } from '../../models/extended-cell-class-params.model';

@Component({
  selector: 'gq-edit-cell',
  templateUrl: './edit-cell.component.html',
})
export class EditCellComponent {
  public params: ExtendedEditCellClassParams;
  public isCellEditingAllowed: boolean;
  public priceWarningEnabled = false;
  public text = translate(
    'shared.quotationDetailsTable.toolTip.priceLowerThanMsp'
  );
  constructor(private readonly dialog: MatDialog) {}

  agInit(params: ExtendedEditCellClassParams): void {
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
      !(params.field === ColumnFields.PRICE && params.data.price === undefined);

    this.priceWarningEnabled =
      params.field === ColumnFields.PRICE && params.value < params.data.msp;
  }

  onIconClick(): void {
    this.dialog.open(EditingModalComponent, {
      width: '634px',
      data: {
        quotationDetail: this.params.data as QuotationDetail,
        field: this.params.field,
      },
      disableClose: true,
    });
  }
}
