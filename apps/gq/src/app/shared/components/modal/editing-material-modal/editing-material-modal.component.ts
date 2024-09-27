import { CommonModule } from '@angular/common';
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
import {
  FormControl,
  FormGroup,
  FormsModule,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';

import { Subscription } from 'rxjs';

import { AutoCompleteFacade } from '@gq/core/store/facades';
import { SharedPipesModule } from '@gq/shared/pipes/shared-pipes.module';
import { TransformationService } from '@gq/shared/services/transformation/transformation.service';
import {
  parseNullableLocalizedInputValue,
  validateQuantityInputKeyPress,
} from '@gq/shared/utils/misc.utils';
import { TranslocoLocaleService } from '@jsverse/transloco-locale';
import { PushPipe } from '@ngrx/component';

import { SharedTranslocoModule } from '@schaeffler/transloco';

import { MaterialColumnFields } from '../../../ag-grid/constants/column-fields.enum';
import {
  MaterialTableItem,
  ValidationDescription,
} from '../../../models/table';
import { priceValidator } from '../../../validators/price-validator';
import { AutocompleteInputComponent } from '../../autocomplete-input/autocomplete-input.component';
import { AutocompleteRequestDialog } from '../../autocomplete-input/autocomplete-request-dialog.enum';
import { DialogHeaderModule } from '../../header/dialog-header/dialog-header.module';

const QUANTITY_FORM_CONTROL_NAME = 'quantity';
const TARGET_PRICE_FORM_CONTROL_NAME = 'targetPrice';
@Component({
  selector: 'gq-editing-material-modal',
  templateUrl: './editing-material-modal.component.html',
  standalone: true,
  imports: [
    CommonModule,
    AutocompleteInputComponent,
    MatInputModule,
    DialogHeaderModule,
    FormsModule,
    ReactiveFormsModule,
    PushPipe,
    SharedPipesModule,
    MatButtonModule,
    MatIconModule,
    SharedTranslocoModule,
  ],
})
export class EditingMaterialModalComponent
  implements OnInit, AfterViewInit, OnDestroy
{
  public editFormGroup: FormGroup;
  public fields: MaterialColumnFields;

  private readonly materialToEdit: MaterialTableItem;
  private readonly fieldToFocus: MaterialColumnFields;
  private readonly targetPrice: string;

  @ViewChild('materialNumberInput')
  public matNumberInput: AutocompleteInputComponent;
  @ViewChild('materialDescInput')
  public matDescInput: AutocompleteInputComponent;
  @ViewChild('valueInput')
  public valueInput: ElementRef<HTMLInputElement>;
  @ViewChild('targetPriceInput')
  public targetPriceInput: ElementRef<HTMLInputElement>;

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
    private readonly cdref: ChangeDetectorRef,
    private readonly translocoLocaleService: TranslocoLocaleService,
    private readonly transformationService: TransformationService
  ) {
    this.materialToEdit = modalData.material;
    this.fieldToFocus = modalData.field;
    this.targetPrice = this.materialToEdit.targetPrice
      ? this.transformationService.transformNumber(
          this.materialToEdit.targetPrice,
          true
        )
      : undefined;
  }

  ngOnInit() {
    this.autoCompleteFacade.resetView();
    this.autoCompleteFacade.initFacade(AutocompleteRequestDialog.EDIT_MATERIAL);

    this.editFormGroup = new FormGroup({
      quantity: new FormControl(undefined, [
        Validators.required,
        Validators.minLength(1),
      ]),
      targetPrice: new FormControl(undefined, [
        priceValidator(this.translocoLocaleService.getLocale()).bind(this),
      ]),
    });
    this.addSubscriptions();
    this.editFormGroup.markAllAsTouched();
  }
  public ngOnDestroy(): void {
    this.subscription.unsubscribe();
  }
  addSubscriptions(): void {
    this.subscription.add(
      this.editFormGroup
        .get(QUANTITY_FORM_CONTROL_NAME)
        .valueChanges.subscribe(() => {
          this.editFormGroup
            .get(QUANTITY_FORM_CONTROL_NAME)
            .updateValueAndValidity({ emitEvent: false });
          this.rowInputValid();
        })
    );
    this.subscription.add(
      this.editFormGroup
        .get(TARGET_PRICE_FORM_CONTROL_NAME)
        .valueChanges.subscribe(() => {
          this.editFormGroup
            .get(TARGET_PRICE_FORM_CONTROL_NAME)
            .updateValueAndValidity({ emitEvent: false });
          this.rowInputValid();
        })
    );
  }
  ngAfterViewInit(): void {
    this.editFormGroup
      .get(MaterialColumnFields.QUANTITY)
      .setValue(this.materialToEdit.quantity);

    this.editFormGroup
      .get(MaterialColumnFields.TARGET_PRICE)
      .setValue(this.targetPrice);

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
      case MaterialColumnFields.MATERIAL: {
        this.matNumberInput.focus();
        break;
      }
      case MaterialColumnFields.MATERIAL_DESCRIPTION: {
        this.matDescInput.focus();
        break;
      }
      case MaterialColumnFields.QUANTITY: {
        this.valueInput.nativeElement.focus();
        break;
      }
      case MaterialColumnFields.TARGET_PRICE: {
        this.targetPriceInput.nativeElement.focus();
        break;
      }
      default: {
        break;
      }
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
      this.materialToEdit.materialDescription !==
      this.matDescInput.valueInput.nativeElement.value;

    const materialNumberChanged =
      this.materialToEdit.materialNumber !==
      this.matNumberInput.valueInput.nativeElement.value;

    const quantityChanged =
      this.materialToEdit.quantity !==
      this.editFormGroup.get(QUANTITY_FORM_CONTROL_NAME).value;

    const targetPriceChanged =
      this.targetPrice !==
      this.editFormGroup.get(TARGET_PRICE_FORM_CONTROL_NAME).value;

    return (
      materialDescriptionChanged ||
      materialNumberChanged ||
      quantityChanged ||
      targetPriceChanged
    );
  }

  handleQuantityKeyDown(event: KeyboardEvent): void {
    validateQuantityInputKeyPress(event);
  }

  closeDialog(): void {
    this.autoCompleteFacade.resetView();
    this.dialogRef.close();
  }

  /**
   *  edit the material to update data and return MaterialTableItem as DialogResult
   */
  update(): void {
    this.autoCompleteFacade.resetView();
    const updatedMaterial: MaterialTableItem = {
      materialDescription: this.matDescInput.valueInput.nativeElement.value,
      materialNumber: this.matNumberInput.valueInput.nativeElement.value,
      quantity: this.editFormGroup.get(QUANTITY_FORM_CONTROL_NAME).value,
      targetPrice: parseNullableLocalizedInputValue(
        this.editFormGroup
          .get(TARGET_PRICE_FORM_CONTROL_NAME)
          .value?.toString(),
        this.translocoLocaleService.getLocale()
      ),
      id: this.modalData.material.id,
      info: {
        valid: true,
        description: [ValidationDescription.Valid],
        errorCodes: this.modalData.material.info?.errorCodes,
      },
    };
    this.dialogRef.close(updatedMaterial);
  }
}
