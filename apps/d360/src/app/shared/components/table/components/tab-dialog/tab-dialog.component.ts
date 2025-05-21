import { CommonModule } from '@angular/common';
import { Component, inject, OnInit } from '@angular/core';
import {
  FormControl,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import {
  MAT_DIALOG_DATA,
  MatDialogModule,
  MatDialogRef,
} from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';

import { translate } from '@jsverse/transloco';

import { SharedTranslocoModule } from '@schaeffler/transloco';

import { ValidateForm } from '../../../../decorators';
import { SelectableValue } from '../../../inputs/autocomplete/selectable-values.utils';
import { DisplayFunctions } from '../../../inputs/display-functions.utils';
import { FilterDropdownComponent } from '../../../inputs/filter-dropdown/filter-dropdown.component';
import { TabAction } from '../../enums';

/**
 * The Tab dialog component.
 *
 * @export
 * @class TabDialogComponent
 * @implements {OnInit}
 */
@Component({
  selector: 'd360-tab-dialog',
  imports: [
    CommonModule,
    SharedTranslocoModule,
    MatDialogModule,
    MatButtonModule,
    ReactiveFormsModule,
    MatFormFieldModule,
    MatInputModule,
    FilterDropdownComponent,
  ],
  templateUrl: './tab-dialog.component.html',
})
export class TabDialogComponent implements OnInit {
  /**
   * The title label for the dialog.
   *
   * @protected
   * @memberof TabDialogComponent
   */
  protected titleLabel = translate('table.dialog.createOrUpdate.titleLabel');

  /**
   * The layout label for the dialog.
   *
   * @protected
   * @memberof TabDialogComponent
   */
  protected layoutLabel = translate('table.dialog.createOrUpdate.layoutLabel');

  /**
   * The DisplayFunctions to use in the HTML template.
   *
   * @protected
   * @memberof TabDialogComponent
   */
  protected DisplayFunctions = DisplayFunctions;

  /**
   * The form group for the dialog.
   *
   * @protected
   * @type {FormGroup}
   * @memberof TabDialogComponent
   */
  protected form: FormGroup = new FormGroup({
    title: new FormControl(null, { validators: Validators.required }),
    layoutId: new FormControl(null, { validators: Validators.required }),
  });

  /**
   * The TabAction enum used in the HTML template.
   *
   * @protected
   * @memberof TabDialogComponent
   */
  protected readonly TabAction = TabAction;

  /**
   * Max count for the tab name.
   *
   * @protected
   * @memberof TabDialogComponent
   */
  protected readonly maxLength = 50;

  /**
   * The data passed to the dialog.
   *
   * @type {({
   *     title?: string;
   *     layouts: NamedColumnDefs[];
   *     action: TabAction.Add | TabAction.Edit;
   *   })}
   * @memberof TabDialogComponent
   */
  public data: {
    title?: string;
    layoutId?: SelectableValue;
    layouts?: SelectableValue[];
    action: TabAction.Add | TabAction.Edit;
  } = inject(MAT_DIALOG_DATA);

  /**
   * The dialog reference for the dialog.
   *
   * @type {MatDialogRef<TabDialogComponent>}
   * @memberof TabDialogComponent
   */
  public dialogRef: MatDialogRef<TabDialogComponent> = inject(MatDialogRef);

  /** @inheritdoc */
  public ngOnInit(): void {
    if (this.data?.title) {
      this.form.get('title')?.setValue(this.data?.title);
    }

    if (this.data?.layouts) {
      if (this.data.action === TabAction.Add) {
        this.form.get('layoutId')?.setValue(this.data?.layouts?.[0]);
      } else {
        this.form.get('layoutId')?.setValue(this.data?.layoutId);
        this.form.get('layoutId').disable();
      }
    }
  }

  /**
   * The method to save and close the dialog.
   *
   * @protected
   * @memberof TabDialogComponent
   */
  @ValidateForm('form')
  protected onSave(): void {
    if (this.form.valid) {
      this.dialogRef.close({
        title: this.form.get('title')?.value,
        layoutId: this.form.get('layoutId')?.value?.id,
      });
    }
  }
}
