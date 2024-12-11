/* eslint-disable max-lines */
import { CommonModule } from '@angular/common';
import {
  AfterViewInit,
  ChangeDetectorRef,
  Component,
  DestroyRef,
  ElementRef,
  inject,
  OnDestroy,
  OnInit,
  ViewChild,
} from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
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

import { filter, map, Observable, scan, Subscription, take } from 'rxjs';

import { ActiveCaseFacade } from '@gq/core/store/active-case/active-case.facade';
import { CreateCaseFacade } from '@gq/core/store/create-case/create-case.facade';
import { AutoCompleteFacade } from '@gq/core/store/facades/autocomplete.facade';
import { Customer, CustomerId } from '@gq/shared/models';
import { TargetPriceSource } from '@gq/shared/models/quotation/target-price-source.enum';
import { AutocompleteSearch, IdValue } from '@gq/shared/models/search';
import { SharedPipesModule } from '@gq/shared/pipes/shared-pipes.module';
import { FeatureToggleConfigService } from '@gq/shared/services/feature-toggle/feature-toggle-config.service';
import { TransformationService } from '@gq/shared/services/transformation/transformation.service';
import {
  getNextHigherPossibleMultiple,
  getTargetPriceSourceValue,
  getTargetPriceValue,
  parseNullableLocalizedInputValue,
  validateQuantityInputKeyPress,
} from '@gq/shared/utils/misc.utils';
import { quantityDeliveryUnitValidator } from '@gq/shared/validators/quantity-delivery-unit-validator';
import { TranslocoLocaleService } from '@jsverse/transloco-locale';
import { LetDirective, PushPipe } from '@ngrx/component';

import { SharedTranslocoModule } from '@schaeffler/transloco';

import { MaterialColumnFields } from '../../../ag-grid/constants/column-fields.enum';
import {
  MaterialTableItem,
  ValidationDescription,
} from '../../../models/table';
import { priceValidator } from '../../../validators/price-validator';
import { AutocompleteInputComponent } from '../../autocomplete-input/autocomplete-input.component';
import { AutocompleteRequestDialog } from '../../autocomplete-input/autocomplete-request-dialog.enum';
import { FilterNames } from '../../autocomplete-input/filter-names.enum';
import { DialogHeaderModule } from '../../header/dialog-header/dialog-header.module';
import { TargetPriceSourceSelectComponent } from '../../target-price-source-select/target-price-source-select.component';
import { EditMaterialModalData } from './edit-material-modal-data.model';

const QUANTITY_FORM_CONTROL_NAME = 'quantity';
const TARGET_PRICE_FORM_CONTROL_NAME = 'targetPrice';
const TARGET_PRICE_SOURCE_FORM_CONTROL_NAME = 'targetPriceSource';
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
    LetDirective,
    TargetPriceSourceSelectComponent,
  ],
})
export class EditingMaterialModalComponent
  implements OnInit, AfterViewInit, OnDestroy
{
  private readonly dialogRef: MatDialogRef<EditingMaterialModalComponent> =
    inject(MatDialogRef);
  private readonly cdref: ChangeDetectorRef = inject(ChangeDetectorRef);
  private readonly translocoLocaleService: TranslocoLocaleService = inject(
    TranslocoLocaleService
  );
  private readonly transformationService: TransformationService = inject(
    TransformationService
  );
  private readonly autoCompleteFacade: AutoCompleteFacade =
    inject(AutoCompleteFacade);

  modalData: EditMaterialModalData = inject(
    MAT_DIALOG_DATA
  ) as EditMaterialModalData;

  private readonly featureToggleConfigService: FeatureToggleConfigService =
    inject(FeatureToggleConfigService);

  private readonly createCaseFacade = inject(CreateCaseFacade);
  private readonly activeCaseFacade = inject(ActiveCaseFacade);
  private readonly destroyRef = inject(DestroyRef);

  isNewCaseCreation = this.featureToggleConfigService.isEnabled(
    'createManualCaseAsView'
  );
  materialDescForEditMaterial$ =
    this.autoCompleteFacade.materialDescForEditMaterial$;
  materialDescAutocompleteLoading$ =
    this.autoCompleteFacade.materialDescAutocompleteLoading$;
  materialNumberForEditMaterial$ =
    this.autoCompleteFacade.materialNumberForEditMaterial$;
  materialNumberAutocompleteLoading$ =
    this.autoCompleteFacade.materialNumberAutocompleteLoading$;
  customerIdentifierForCaseCreation$: Observable<CustomerId> =
    this.createCaseFacade.customerIdentifier$;
  customerIdentifierForActiveCase$: Observable<CustomerId> =
    this.activeCaseFacade.quotationCustomer$.pipe(
      map((customer: Customer) => customer.identifier)
    );

  customerMaterialForEditMaterial$ =
    this.autoCompleteFacade.customerMaterialNumberForEditMaterial$;
  customerMaterialAutocompleteLoading$ =
    this.autoCompleteFacade.customerMaterialNumberLoading$;
  editFormGroup: FormGroup;
  fields: MaterialColumnFields;
  isCaseView: boolean;
  CUSTOMER_MATERIAL_MAX_LENGTH = 35;

  private materialToEdit: MaterialTableItem;
  private fieldToFocus: MaterialColumnFields;
  private targetPrice: string;

  @ViewChild('materialNumberInput')
  public matNumberInput: AutocompleteInputComponent;
  @ViewChild('materialDescInput')
  public matDescInput: AutocompleteInputComponent;
  @ViewChild('customerMaterialInput')
  public customerMaterialInput: AutocompleteInputComponent;
  @ViewChild('valueInput')
  public valueInput: ElementRef<HTMLInputElement>;
  @ViewChild('targetPriceInput')
  public targetPriceInput: ElementRef<HTMLInputElement>;
  @ViewChild('targetPriceSourceInput')
  public targetPriceSourceInput: TargetPriceSourceSelectComponent;

  public materialInputIsValid = false;
  public materialNumberInput: boolean;

  public updateRowEnabled = false;
  private readonly subscription: Subscription = new Subscription();

  selectedMaterialAutocomplete$: Observable<IdValue> =
    this.autoCompleteFacade
      .getSelectedAutocompleteMaterialNumberForEditMaterial$;

  ngOnInit() {
    this.isCaseView = this.modalData.isCaseView;
    this.materialToEdit = this.modalData.material;
    this.fieldToFocus = this.modalData.field;
    this.targetPrice = this.materialToEdit.targetPrice
      ? this.transformationService.transformNumber(
          this.materialToEdit.targetPrice,
          true
        )
      : undefined;

    this.autoCompleteFacade.resetView();
    this.autoCompleteFacade.initFacade(AutocompleteRequestDialog.EDIT_MATERIAL);

    this.editFormGroup = new FormGroup({
      quantity: new FormControl(
        undefined,
        [Validators.required],
        this.isNewCaseCreation
          ? [quantityDeliveryUnitValidator(this.selectedMaterialAutocomplete$)]
          : []
      ),
      targetPrice: new FormControl(undefined, [
        priceValidator(this.translocoLocaleService.getLocale()).bind(this),
      ]),
      targetPriceSource: new FormControl(TargetPriceSource.NO_ENTRY),
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
        .valueChanges.subscribe((data) => {
          this.editFormGroup
            .get(TARGET_PRICE_FORM_CONTROL_NAME)
            .updateValueAndValidity({ emitEvent: false });
          this.rowInputValid();

          this.editFormGroup
            .get(TARGET_PRICE_SOURCE_FORM_CONTROL_NAME)
            .setValue(
              getTargetPriceSourceValue(
                data,
                this.editFormGroup.get(TARGET_PRICE_FORM_CONTROL_NAME).valid,
                this.editFormGroup.get(TARGET_PRICE_SOURCE_FORM_CONTROL_NAME)
                  .value
              ),
              { emitEvent: false }
            );
        })
    );

    this.subscription.add(
      this.editFormGroup
        .get(TARGET_PRICE_SOURCE_FORM_CONTROL_NAME)
        .valueChanges.subscribe((data) => {
          this.editFormGroup
            .get(TARGET_PRICE_FORM_CONTROL_NAME)
            .setValue(
              getTargetPriceValue(
                data,
                this.editFormGroup.get(TARGET_PRICE_FORM_CONTROL_NAME).value
              ),
              { emitEvent: false }
            );

          this.rowInputValid();
        })
    );

    if (this.isNewCaseCreation) {
      this.selectedMaterialAutocomplete$
        .pipe(
          takeUntilDestroyed(this.destroyRef),
          filter((material) => !!material)
        )
        .subscribe(({ deliveryUnit }) => {
          this.adjustQuantityFormFieldToDeliveryUnit(deliveryUnit);
        });
    }
  }

  ngAfterViewInit(): void {
    this.matDescInput.searchFormControl.setValue(
      this.materialToEdit.materialDescription
    );

    this.matNumberInput.searchFormControl.setValue(
      this.materialToEdit.materialNumber
    );

    if (this.materialToEdit.customerMaterialNumber) {
      // when a customerMaterial is set within the materialToEdit object, it must be assigned last
      // customerMaterial may initially be a manual input, but it will be overwritten by materialNumber or materialDescription after calling formControl's setValue()
      // the customerMaterial field will be initialized after autocomplete options for MatNumber and MatDescription have been selected
      // it will be set only once; if another material is selected, the customerMaterial can be overwritten.

      this.subscription.add(
        this.autoCompleteFacade.optionSelectedForAutoCompleteFilter$
          .pipe(
            scan(
              (acc, val) => {
                if (val.filter === FilterNames.MATERIAL_NUMBER) {
                  acc.hasNumberInit = true;
                } else if (val.filter === FilterNames.MATERIAL_DESCRIPTION) {
                  acc.hasDescriptionInit = true;
                }

                return acc;
              },
              { hasNumberInit: false, hasDescriptionInit: false }
            ),
            filter((state) => state.hasNumberInit && state.hasDescriptionInit),
            take(1)
          )
          .subscribe(() => {
            this.customerMaterialInput.searchFormControl.setValue(
              this.materialToEdit.customerMaterialNumber
            );
          })
      );
    }

    this.editFormGroup
      .get(MaterialColumnFields.QUANTITY)
      .setValue(this.materialToEdit.quantity);

    this.editFormGroup
      .get(MaterialColumnFields.TARGET_PRICE)
      .setValue(this.targetPrice);

    this.editFormGroup
      .get(MaterialColumnFields.TARGET_PRICE_SOURCE)
      .setValue(
        this.materialToEdit?.targetPriceSource ?? TargetPriceSource.NO_ENTRY
      );

    switch (this.fieldToFocus) {
      case MaterialColumnFields.MATERIAL_DESCRIPTION: {
        this.matDescInput.focus();

        break;
      }
      case MaterialColumnFields.MATERIAL: {
        this.matNumberInput.focus();

        break;
      }
      case MaterialColumnFields.CUSTOMER_MATERIAL_NUMBER: {
        this.customerMaterialInput.focus();
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
      case MaterialColumnFields.TARGET_PRICE_SOURCE: {
        this.targetPriceSourceInput.focus();
        break;
      }
      // no default
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

  customerMaterialHasInput(): void {
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

    const customerMaterial = this.getCustomerMaterialNumber();
    const customerMaterialChanged =
      this.materialToEdit.customerMaterialNumber !== customerMaterial;

    const targetPriceSourceChanged =
      this.materialToEdit.targetPriceSource !==
      this.editFormGroup.get('targetPriceSource')?.value;

    const quantityChanged =
      this.materialToEdit.quantity !==
      this.editFormGroup.get(QUANTITY_FORM_CONTROL_NAME).value;

    const targetPriceFormValue = this.editFormGroup.get(
      TARGET_PRICE_FORM_CONTROL_NAME
    ).value;
    const targetPriceChanged =
      this.targetPrice !==
      (targetPriceFormValue === '' ? undefined : targetPriceFormValue);

    return this.isNewCaseCreation
      ? materialDescriptionChanged ||
          materialNumberChanged ||
          customerMaterialChanged ||
          quantityChanged ||
          targetPriceChanged ||
          targetPriceSourceChanged
      : materialDescriptionChanged ||
          materialNumberChanged ||
          quantityChanged ||
          targetPriceChanged;
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
      customerMaterialNumber: this.isNewCaseCreation
        ? this.getCustomerMaterialNumber()
        : undefined,
      quantity: this.editFormGroup.get(QUANTITY_FORM_CONTROL_NAME).value,
      targetPrice: parseNullableLocalizedInputValue(
        this.editFormGroup
          .get(TARGET_PRICE_FORM_CONTROL_NAME)
          .value?.toString(),
        this.translocoLocaleService.getLocale()
      ),
      targetPriceSource: this.isNewCaseCreation
        ? this.editFormGroup.get('targetPriceSource')?.value
        : undefined,
      id: this.modalData.material.id,
      info: {
        valid: true,
        description: [ValidationDescription.Valid],
        codes: this.modalData.material.info?.codes,
      },
    };
    this.dialogRef.close(updatedMaterial);
  }

  autocomplete(
    autocompleteSearch: AutocompleteSearch,
    customerId: CustomerId
  ): void {
    this.autoCompleteFacade.autocomplete(autocompleteSearch, customerId);
  }

  autocompleteUnselectOptions(autocompleteFilter: string): void {
    this.autoCompleteFacade.unselectOptions(autocompleteFilter);
  }

  autocompleteSelectMaterialNumberDescriptionOrCustomerMaterial(
    option: IdValue,
    autocompleteFilter: string
  ): void {
    this.autoCompleteFacade.selectMaterialNumberOrDescription(
      option,
      autocompleteFilter
    );
  }

  /**
   * The quantity form Field will have a value that is a multiple of the delivery unit
   * when the next possible multiple is higher than the current quantity Value, the next higher multiple will be taken
   * the amount of delivery is the minimum quantity Value
   * @param deliveryUnit deliveryUnit of the selected material
   */
  private adjustQuantityFormFieldToDeliveryUnit(deliveryUnit: number): void {
    // find the next multiple of delivery unit starting from the quantity value
    const quantityFormControl = this.editFormGroup.get(
      QUANTITY_FORM_CONTROL_NAME
    );
    const nextMultiple = getNextHigherPossibleMultiple(
      quantityFormControl.value,
      deliveryUnit
    );

    if (nextMultiple > quantityFormControl.value) {
      quantityFormControl.setValue(nextMultiple);
      quantityFormControl.updateValueAndValidity();
    }
  }

  private getCustomerMaterialNumber() {
    return this.customerMaterialInput?.valueInput.nativeElement.value === ''
      ? null
      : this.customerMaterialInput.valueInput.nativeElement.value;
  }
}
