import { Component, ElementRef, ViewChild } from '@angular/core';
import { FormControl, Validators } from '@angular/forms';

import { IHeaderParams } from '@ag-grid-community/all-modules';
import { IHeaderAngularComp } from '@ag-grid-community/angular';

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

  editFormControl: FormControl;

  @ViewChild('menuButton', { read: ElementRef }) public menuButton!: ElementRef;
  @ViewChild('inputField', { static: false }) public inputField!: ElementRef;

  agInit(params: IHeaderParams): void {
    this.editFormControl = new FormControl('', [
      Validators.max(100),
      Validators.min(0),
      Validators.required,
    ]);

    this.params = params;

    params.column.addEventListener(
      'sortChanged',
      this.onSortChanged.bind(this)
    );

    this.onSortChanged();
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
