import {
  AfterViewInit,
  ChangeDetectorRef,
  Component,
  ElementRef,
  Inject,
  OnDestroy,
  OnInit,
  ViewChild,
} from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';

import { Subscription } from 'rxjs';

import { AutoCompleteFacade } from '@gq/core/store/facades';

import { MaterialColumnFields } from '../../../ag-grid/constants/column-fields.enum';
import {
  MaterialTableItem,
  ValidationDescription,
} from '../../../models/table';
import { AutocompleteInputComponent } from '../../autocomplete-input/autocomplete-input.component';
import { AutocompleteRequestDialog } from '../../autocomplete-input/autocomplete-request-dialog.enum';

@Component({
  selector: 'gq-editing-material-modal',
  templateUrl: './editing-material-modal.component.html',
})
export class EditingMaterialModalComponent
  implements OnInit, AfterViewInit, OnDestroy
{
  public editFormGroup: FormGroup;
  public fields: MaterialColumnFields;

  private readonly materialToEdit: MaterialTableItem;
  private readonly fieldToFocus: MaterialColumnFields;

  @ViewChild('materialNumberInput')
  public matNumberInput: AutocompleteInputComponent;
  @ViewChild('materialDescInput')
  public matDescInput: AutocompleteInputComponent;
  @ViewChild('valueInput')
  public valueInput: ElementRef<HTMLInputElement>;

  public materialInputIsValid = false;
  public materialNumberInput: boolean;

  public updateRowEnabled = false;
  private readonly subscription: Subscription = new Subscription();

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

    this.editFormGroup = new FormGroup({
      quantity: new FormControl(undefined, [
        Validators.required,
        Validators.minLength(1),
      ]),
    });
    this.addSubscriptions();
  }
  public ngOnDestroy(): void {
    this.subscription.unsubscribe();
  }

  addSubscriptions(): void {
    this.subscription.add(
      this.editFormGroup.get('quantity').valueChanges.subscribe(() => {
        this.editFormGroup
          .get('quantity')
          .updateValueAndValidity({ emitEvent: false });
        this.rowInputValid();
      })
    );
  }
  ngAfterViewInit(): void {
    this.editFormGroup
      .get(MaterialColumnFields.QUANTITY)
      .setValue(this.materialToEdit.quantity);
    this.matDescInput.searchFormControl.setValue(
      this.materialToEdit.materialDescription
    );
    this.matNumberInput.searchFormControl.setValue(
      this.materialToEdit.materialNumber
    );

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
    this.updateRowEnabled =
      this.materialInputIsValid &&
      this.materialNumberInput &&
      this.editFormGroup.valid &&
      this.inputHasChanged();
  }

  inputHasChanged(): boolean {
    const materialDescriptionChanged =
      this.modalData.material.materialDescription !==
      this.matDescInput.valueInput.nativeElement.value;

    const materialNumberChanged =
      this.modalData.material.materialNumber !==
      this.matNumberInput.valueInput.nativeElement.value;

    const quantityChanged =
      this.modalData.material.quantity !==
      this.editFormGroup.get('quantity').value;

    return (
      materialDescriptionChanged || materialNumberChanged || quantityChanged
    );
  }

  closeDialog(): void {
    this.autoCompleteFacade.resetView();
    this.dialogRef.close();
  }

  /**
   * edit the material to update data and return MaterialTableItem as DialogResult
   */
  update(): void {
    this.autoCompleteFacade.resetView();

    const updatedMaterial: MaterialTableItem = {
      materialDescription: this.matDescInput.valueInput.nativeElement.value,
      materialNumber: this.matNumberInput.valueInput.nativeElement.value,
      quantity: this.editFormGroup.get('quantity').value,
      id: this.modalData.material.id,
      info: { valid: true, description: [ValidationDescription.Valid] },
    };
    this.dialogRef.close(updatedMaterial);
  }
}
