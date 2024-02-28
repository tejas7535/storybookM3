import { Injectable } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';

import { EditingModalWrapperComponent } from './editing-modal-wrapper/editing-modal-wrapper.component';
import { EditingModal } from './models/editing-modal.model';

@Injectable({
  providedIn: 'root',
})
export class EditingModalService {
  constructor(private readonly dialog: MatDialog) {}

  openEditingModal(modalData: EditingModal): void {
    this.dialog.open(EditingModalWrapperComponent, {
      width: '684px',
      data: modalData,
      panelClass: 'editing-modal',
    });
  }
}
