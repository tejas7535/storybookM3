import {
  AfterViewInit,
  ChangeDetectorRef,
  Component,
  ElementRef,
  Inject,
  OnInit,
  ViewChild,
} from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';

import { AutoCompleteFacade } from '../../../../../app/core/store';
import { MaterialColumnFields } from '../../../ag-grid/constants/column-fields.enum';
import { MaterialTableItem } from '../../../models/table';
import { AutocompleteInputComponent } from '../../autocomplete-input/autocomplete-input.component';
import { AutocompleteRequestDialog } from '../../autocomplete-input/autocomplete-request-dialog.enum';
import { FilterNames } from '../../autocomplete-input/filter-names.enum';

@Component({
  selector: 'gq-editing-material-modal',
  templateUrl: './editing-material-modal.component.html',
})
export class EditingMaterialModalComponent implements OnInit, AfterViewInit {
  public editFromGroup: FormGroup;
  public fields: MaterialColumnFields;

  private materialToEdit: MaterialTableItem;
  private readonly fieldToFocus: MaterialColumnFields;

  @ViewChild('materialNumberInput')
  public matNumberInput: AutocompleteInputComponent;
  @ViewChild('materialDescInput')
  public matDescInput: AutocompleteInputComponent;
  @ViewChild('valueInput')
  public valueInput: ElementRef<HTMLInputElement>;

  public materialInputIsValid = false;
  public materialNumberInput: boolean;

  public addRowEnabled = false;

  constructor(
    public readonly autoCompleteFacade: AutoCompleteFacade,
    @Inject(MAT_DIALOG_DATA)
    public modalData: {
      material: MaterialTableItem;
      field: MaterialColumnFields;
    },
    private readonly dialogRef: MatDialogRef<EditingMaterialModalComponent>,
    private readonly cdref: ChangeDetectorRef
  ) {
    this.materialToEdit = modalData.material;
    this.fieldToFocus = modalData.field;
  }

  ngOnInit() {
    this.autoCompleteFacade.resetView();
    this.autoCompleteFacade.initFacade(AutocompleteRequestDialog.EDIT_MATERIAL);

    this.editFromGroup = new FormGroup({
      quantity: new FormControl(undefined, [
        Validators.required,
        Validators.minLength(1),
      ]),
    });
  }

  ngAfterViewInit(): void {
    this.editFromGroup.get('quantity').setValue(this.materialToEdit.quantity);
    this.autoCompleteFacade.autocomplete({
      filter: FilterNames.MATERIAL_NUMBER,
      searchFor: this.materialToEdit.materialNumber,
    });

    if (!this.fieldToFocus) {
      return;
    }

    switch (this.fieldToFocus) {
      case MaterialColumnFields.MATERIAL:
        this.matNumberInput.focus();
        break;
      case MaterialColumnFields.MATERIAL_DESCRIPTION:
        this.matDescInput.focus();
        break;
      case MaterialColumnFields.QUANTITY:
        this.valueInput.nativeElement.focus();
        break;
      default:
        break;
    }
    this.cdref.detectChanges();
  }

  materialInputValid(isValid: boolean): void {
    this.materialInputIsValid = isValid;
    this.rowInputValid();
  }

  materialHasInput(hasInput: boolean): void {
    this.materialNumberInput = hasInput;
    this.rowInputValid();
  }

  rowInputValid(): void {
    this.addRowEnabled =
      this.materialInputIsValid &&
      this.materialNumberInput &&
      this.editFromGroup.valid;
  }

  closeDialog(): void {
    this.autoCompleteFacade.resetView();
    this.dialogRef.close();
  }

  /**
   * edit the material to update data and return MaterialTableItem as DialogResult
   */
  update(): void {
    // get the data from controls
    this.materialToEdit.materialDescription =
      this.matDescInput.valueInput.nativeElement.value;
    this.materialToEdit.materialNumber =
      this.matNumberInput.valueInput.nativeElement.value;
    this.materialToEdit.quantity = this.editFromGroup.get('quantity').value;
    this.autoCompleteFacade.resetView();
    this.dialogRef.close(this.materialToEdit);
  }
}
