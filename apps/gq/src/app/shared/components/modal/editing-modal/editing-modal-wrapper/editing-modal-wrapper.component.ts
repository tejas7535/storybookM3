import { Component, inject } from '@angular/core';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';

import { ColumnFields } from '@gq/shared/ag-grid/constants/column-fields.enum';

import { EditingModal } from '../models/editing-modal.model';

@Component({
  selector: 'gq-editing-modal-wrapper',
  templateUrl: './editing-modal-wrapper.component.html',
})
export class EditingModalWrapperComponent {
  modalData: EditingModal = inject(MAT_DIALOG_DATA);
  readonly columnFields = ColumnFields;
}
