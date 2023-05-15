import { ComponentType } from '@angular/cdk/portal';
import { Injectable } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';

import { ColumnFields } from '@gq/shared/ag-grid/constants/column-fields.enum';

import { EditingModalComponent } from './editing-modal.component';
import { DiscountEditingModalComponent } from './modals/discount-editing-modal.component';
import { GpiEditingModalComponent } from './modals/gpi-editing-modal.component';
import { GpmEditingModalComponent } from './modals/gpm-editing-modal.component';
import { PriceEditingModalComponent } from './modals/price-editing-modal.component';
import { QuantityEditingModalComponent } from './modals/quantity-editing-modal.component';
import { TargetPriceEditingModalComponent } from './modals/target-price-editing-modal.component';
import { EditingModal } from './models/editing-modal.model';

@Injectable({
  providedIn: 'root',
})
export class EditingModalService {
  private readonly fieldToEditingModalComponent: {
    [field: string]: ComponentType<EditingModalComponent>;
  } = {
    [ColumnFields.GPI]: GpiEditingModalComponent,
    [ColumnFields.GPM]: GpmEditingModalComponent,
    [ColumnFields.DISCOUNT]: DiscountEditingModalComponent,
    [ColumnFields.PRICE]: PriceEditingModalComponent,
    [ColumnFields.TARGET_PRICE]: TargetPriceEditingModalComponent,
    [ColumnFields.ORDER_QUANTITY]: QuantityEditingModalComponent,
  };

  constructor(private readonly dialog: MatDialog) {}

  openEditingModal(modalData: EditingModal): void {
    this.dialog.open(this.fieldToEditingModalComponent[modalData.field], {
      width: '684px',
      data: modalData,
    });
  }
}
