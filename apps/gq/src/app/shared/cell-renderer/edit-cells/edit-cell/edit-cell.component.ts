import { Component } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';

import { EditingModalComponent } from '../../../components/editing-modal/editing-modal.component';
import { QuotationDetail } from '../../../models/quotation-detail';
import { ExtendedEditCellClassParams } from '../../models/extended-cell-class-params.model';

@Component({
  selector: 'gq-edit-cell',
  templateUrl: './edit-cell.component.html',
})
export class EditCellComponent {
  public params: ExtendedEditCellClassParams;
  public conditionMet: boolean;

  constructor(private readonly dialog: MatDialog) {}
  agInit(params: ExtendedEditCellClassParams): void {
    this.params = params;
    this.conditionMet =
      (params.data as QuotationDetail)[params.condition.conditionField] !==
      null;
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
