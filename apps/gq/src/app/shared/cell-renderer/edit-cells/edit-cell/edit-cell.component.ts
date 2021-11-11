import { Component } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';

import { TableContext } from '../../../../../app/process-case-view/quotation-details-table/config/tablecontext.model';
import { EditingModalComponent } from '../../../components/editing-modal/editing-modal.component';
import { QuotationDetail } from '../../../models/quotation-detail';
import { ColumnFields } from '../../../services/column-utility-service/column-fields.enum';
import { ExtendedEditCellClassParams } from '../../models/extended-cell-class-params.model';

@Component({
  selector: 'gq-edit-cell',
  templateUrl: './edit-cell.component.html',
})
export class EditCellComponent {
  public params: ExtendedEditCellClassParams;
  public isCellEditingAllowed: boolean;
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
      );
  }

  onIconClick(): void {
    this.dialog.open(EditingModalComponent, {
      width: '50%',
      height: '200px',
      data: {
        quotationDetail: this.params.data as QuotationDetail,
        field: this.params.field,
      },
      disableClose: true,
    });
  }
}
