import { Component, ElementRef, ViewChild } from '@angular/core';
import { FormControl, Validators } from '@angular/forms';

import { IHeaderParams } from '@ag-grid-community/all-modules';
import { IHeaderAngularComp } from '@ag-grid-community/angular';

import { ColumnFields } from '../../ag-grid/constants/column-fields.enum';
import { QuotationDetail } from '../../models/quotation-detail';
import { HelperService } from '../../services/helper-service/helper-service.service';

@Component({
  selector: 'gq-editable-column-header',
  templateUrl: './editable-column-header.component.html',
  styleUrls: ['./editable-column-header.component.scss'],
})
export class EditableColumnHeaderComponent implements IHeaderAngularComp {
  public params!: IHeaderParams;

  public sort: 'asc' | 'desc';

  editMode = false;
  value = '';

  showEditIcon = false;

  editFormControl: FormControl;

  @ViewChild('menuButton', { read: ElementRef }) public menuButton!: ElementRef;
  @ViewChild('inputField', { static: false }) public inputField!: ElementRef;

  agInit(params: IHeaderParams): void {
    this.value = '';

    this.editFormControl = new FormControl('', [
      Validators.max(100),
      Validators.min(-100),
      Validators.required,
    ]);

    this.params = params;

    params.column.addEventListener(
      'sortChanged',
      this.onSortChanged.bind(this)
    );

    this.onSortChanged();

    params.api.addEventListener(
      'rowSelected',
      this.updateShowEditIcon.bind(this)
    );

    this.updateShowEditIcon();
  }

  updateShowEditIcon() {
    this.showEditIcon =
      this.params.api.getSelectedRows()?.length > 0 &&
      this.isDataAvailable(this.params.column.getId());

    if (!this.showEditIcon) {
      this.editMode = false;
      this.value = '';
    }
  }

  private isDataAvailable(columName: string): boolean {
    return this.params.api.getSelectedRows().some((detail: QuotationDetail) => {
      switch (columName) {
        case ColumnFields.PRICE: {
          return detail.price;
        }
        case ColumnFields.DISCOUNT: {
          return detail.sapGrossPrice;
        }
        case ColumnFields.GPI: {
          return detail.gpc;
        }
        case ColumnFields.GPM: {
          return detail.sqv;
        }
        default:
          return false;
      }
    });
  }

  onSortChanged() {
    if (this.params.column.isSortAscending()) {
      this.sort = 'asc';
    } else if (this.params.column.isSortDescending()) {
      this.sort = 'desc';
    } else {
      this.sort = undefined;
    }
  }

  onMenuClicked(e: Event) {
    e.stopPropagation();
    e.preventDefault();

    this.params.showColumnMenu(this.menuButton.nativeElement);
  }

  onSortRequested(event: MouseEvent) {
    let newSort: 'asc' | 'desc';
    if (!this.sort) {
      newSort = 'asc';
    }

    if (this.sort === 'asc') {
      newSort = 'desc';
    }

    this.params.setSort(newSort, event.shiftKey);
  }

  onKeyPress(event: KeyboardEvent): void {
    HelperService.validateNumberInputKeyPress(
      event,
      this.inputField?.nativeElement
    );
  }

  onPaste(event: ClipboardEvent): void {
    HelperService.validateNumberInputPaste(event, this.editFormControl);
  }

  refresh() {
    return false;
  }

  enableEditMode(e: Event) {
    e.stopPropagation();
    e.preventDefault();

    this.editMode = true;

    // Since we can't use ChangeDetectorRef in this component, we need to use
    // setTimeout here as a work around to force the change detection cycle to run.
    setTimeout(() => {
      this.inputField?.nativeElement.focus();
    });
  }

  disableEditMode() {
    if (!this.value) {
      this.editMode = false;
    }
  }

  submitValue(e: Event) {
    e.stopPropagation();

    if (!this.editFormControl.valid) {
      return;
    }

    this.value = this.editFormControl.value;

    this.params.context.onMultipleMaterialSimulation(
      this.params.column.getId(),
      this.editFormControl.value
    );
  }
}
