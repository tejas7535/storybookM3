/* eslint-disable max-lines */
import {
  ChangeDetectorRef,
  ElementRef,
  inject,
  Injectable,
} from '@angular/core';

import { take } from 'rxjs';

import { AutoCompleteFacade } from '@gq/core/store/facades';
import { MaterialColumnFields } from '@gq/shared/ag-grid/constants/column-fields.enum';
import { AutocompleteInputComponent } from '@gq/shared/components/autocomplete-input/autocomplete-input.component';
import { FilterNames } from '@gq/shared/components/autocomplete-input/filter-names.enum';
import { TargetPriceSourceSelectComponent } from '@gq/shared/components/target-price-source-select/target-price-source-select.component';
import { IdValue } from '@gq/shared/models/search';
import { MaterialTableItem } from '@gq/shared/models/table';
import { cloneDeep } from 'lodash';

export class EditMaterialInputs {
  matNumberInput: AutocompleteInputComponent;
  matDescInput: AutocompleteInputComponent;
  customerMaterialInput: AutocompleteInputComponent;
  quantityInput: ElementRef<HTMLInputElement>;
  targetPriceInput: ElementRef<HTMLInputElement>;
  targetPriceSourceInput: TargetPriceSourceSelectComponent;
}
@Injectable({
  providedIn: 'root',
})
export class InitializeMaterialControlsServiceService {
  autoCompleteFacade: AutoCompleteFacade = inject(AutoCompleteFacade);

  /**
   * Initializes the material form controls based on UX requirements.
   *
   * Behavior Overview:
   * - An autocomplete is initially performed within the requested field.
   * - If the requested field has no value, the next field is considered:
   *   - `matDesc` when the requested field is `mat15`, followed by `customerMaterial`.
   *   - Non-autocomplete fields will be initialized with autocomplete options for `mat15` followed by `customerMaterial`.
   *
   * When an item is added to the material input table:
   * - The backend (BE) performs validation and provides the corresponding:
   *   - Material Descriptions (MatDescriptions)
   *   - Mat15 Numbers
   *   - Customer Materials
   *
   * Assumptions When Dialog is Opened:
   * - The combination of `Mat15` and `MatDescription` in the table is valid.
   *
   * Autocomplete Behavior:
   * - If an autocomplete call yields a match for `mat15`, `Desc`, and `customerMaterial`, that option will be selected.
   * - If there’s no direct match:
   *    - If both `mat15` and `matDesc` are present:
   *         - Considered as valid option and added to autocomplete.
   *    -  If either `mat15` or `matDesc` is missing:
   *         - An additional autocomplete will be performed based on the requested fields (won’t overwrite previous results).
   *
   * Conditions:
   * - If the requested field is falsy (no value), the form control will not perform autocomplete.
   *
   * @param fieldToFocus The field to initially focus on.
   * @param materialToEdit The material item being edited.
   * @param inputs The user input fields.
   * @param cdref Change detection reference.
   */
  public initializeMaterialFormControls(
    fieldToFocus: MaterialColumnFields,
    materialToEdit: MaterialTableItem,
    inputs: EditMaterialInputs,
    cdref: ChangeDetectorRef
  ): void {
    // Step 1: Set the values of the material controls
    this.setMaterialFormControls(fieldToFocus, materialToEdit, inputs, cdref);
    // Step 2: Focus the requested field
    this.focusRequestedField(fieldToFocus, inputs);
    // Step 3: Mark the fields as touched
    this.markFieldsAsTouched(inputs);
  }

  private markFieldsAsTouched(inputs: EditMaterialInputs): void {
    // MatNumber15 and MatDescription are mandatory fields, those need to be checked and when invalid the errorMsg shall be displayed directly
    if (inputs.matNumberInput.searchFormControl.invalid) {
      inputs.matNumberInput.searchFormControl.markAllAsTouched();
    }
    if (inputs.matDescInput.searchFormControl.invalid) {
      inputs.matDescInput.searchFormControl.markAllAsTouched();
    }
  }

  private setMaterialFormControls(
    fieldToFocus: MaterialColumnFields,
    materialToEdit: MaterialTableItem,
    inputs: EditMaterialInputs,
    cdref: ChangeDetectorRef
  ): void {
    switch (fieldToFocus) {
      case MaterialColumnFields.MATERIAL: {
        if (materialToEdit.materialNumber) {
          inputs.matNumberInput.searchFormControl.setValue(
            materialToEdit.materialNumber
          );

          this.validateAutocompleteResult(
            FilterNames.MATERIAL_NUMBER,
            inputs,
            materialToEdit,
            cdref
          );
        } else {
          // when mat15 has no value (matDesc than will also not have), try autoComplete for customerMaterial
          inputs.customerMaterialInput.searchFormControl.setValue(
            materialToEdit.customerMaterialNumber
          );
        }

        break;
      }
      case MaterialColumnFields.MATERIAL_DESCRIPTION: {
        if (materialToEdit.materialDescription) {
          inputs.matDescInput.searchFormControl.setValue(
            materialToEdit.materialDescription
          );
          this.validateAutocompleteResult(
            FilterNames.MATERIAL_DESCRIPTION,
            inputs,
            materialToEdit,
            cdref
          );
        } else {
          // when MatDesc has no Value than try to autoComplete via MatNumber
          if (materialToEdit.materialNumber) {
            inputs.matNumberInput.searchFormControl.setValue(
              materialToEdit.materialNumber
            );

            this.validateAutocompleteResult(
              FilterNames.MATERIAL_NUMBER,
              inputs,
              materialToEdit,
              cdref
            );
          }
          // when matDesc and Mat15 have no value try autocomplete for customerMaterial
          else if (materialToEdit.customerMaterialNumber) {
            inputs.customerMaterialInput.searchFormControl.setValue(
              materialToEdit.customerMaterialNumber
            );
            this.validateAutocompleteResult(
              FilterNames.CUSTOMER_MATERIAL,
              inputs,
              materialToEdit,
              cdref
            );
          }
        }

        break;
      }
      case MaterialColumnFields.CUSTOMER_MATERIAL_NUMBER: {
        if (materialToEdit.customerMaterialNumber) {
          inputs.customerMaterialInput.searchFormControl.setValue(
            materialToEdit.customerMaterialNumber
          );
          this.validateAutocompleteResult(
            FilterNames.CUSTOMER_MATERIAL,
            inputs,
            materialToEdit,
            cdref
          );
        } else {
          // try a autoComplete for Mat15 Number
          // autocomplete for Mat15 can be performed, no special Case for customerMaterial needed so the default process can be performed (will be handled within the autocomplete component)
          if (materialToEdit.materialNumber) {
            inputs.matNumberInput.searchFormControl.setValue(
              materialToEdit.materialNumber
            );
          }
        }

        break;
      }
      default: {
        // when requested Field is other than the autocomplete fields
        // autocomplete either for mat15 or customerMaterial will be performed
        // the results must be validated by subscribing to the getAutocompleteOptionsSuccess Action
        if (materialToEdit.materialNumber) {
          inputs.matNumberInput.searchFormControl.setValue(
            materialToEdit.materialNumber
          );
          this.validateAutocompleteResult(
            FilterNames.MATERIAL_NUMBER,
            inputs,
            materialToEdit,
            cdref
          );
        } else {
          inputs.customerMaterialInput.searchFormControl.setValue(
            materialToEdit.customerMaterialNumber
          );
          this.validateAutocompleteResult(
            FilterNames.CUSTOMER_MATERIAL,
            inputs,
            materialToEdit,
            cdref
          );
        }
        break;
      }
    }
  }

  private focusRequestedField(
    fieldToFocus: MaterialColumnFields,
    inputs: EditMaterialInputs
  ): void {
    switch (fieldToFocus) {
      case MaterialColumnFields.MATERIAL_DESCRIPTION: {
        inputs.matDescInput.focus();

        break;
      }
      case MaterialColumnFields.MATERIAL: {
        inputs.matNumberInput.focus();

        break;
      }
      case MaterialColumnFields.CUSTOMER_MATERIAL_NUMBER: {
        inputs.customerMaterialInput.focus();
        break;
      }

      case MaterialColumnFields.QUANTITY: {
        inputs.quantityInput.nativeElement.focus();
        break;
      }
      case MaterialColumnFields.TARGET_PRICE: {
        inputs.targetPriceInput.nativeElement.focus();
        break;
      }
      case MaterialColumnFields.TARGET_PRICE_SOURCE: {
        inputs.targetPriceSourceInput.focus();
        break;
      }
      // no default
    }
  }

  /**
   * - Subscribes to getAutocompleteOptionsSuccess Action and validates the result.
   * - When NO match of mat15+matDesc+customerMaterial can be found (result of the initially requested field) an other autocomplete will be performed, depending on the requested field and if mat15 AND matDesc are set in the materialInputTables
   * - The additional autocomplete causes the Mat15 to validate (+ display validation message) and additionally provides autocomplete options for
   * - customer material when mat15/matDesc
   * - mat15 when customer material
   * - have been requested initially
   *
   * this behavior is aligned with UX (see Video in workItem GQUOTE-5589)
   * @param filterName requested field for autocomplete
   */
  private validateAutocompleteResult(
    filterName: FilterNames,
    inputs: EditMaterialInputs,
    materialToEdit: MaterialTableItem,
    cdref: ChangeDetectorRef
  ): void {
    // the autocomplete will be requested for the requested field (filterName) and the result will be checked
    // this subscribes to the getAutocompleteOptionsSuccess Action for the REQUESTED FIELD not for the autocomplete requested that have additionally been fired
    this.autoCompleteFacade.getAutocompleteOptionsSuccess$
      .pipe(take(1))
      .subscribe((data: { options: IdValue[]; filter: FilterNames }) => {
        // autocomplete has been performed for the requested field (filterName) and the result has been received
        // best case is that a match over all three properties has been found (matDesc+Mat15+customerMaterial)

        // row from materialInputTable that has already been validated via BE call
        const optionToCheck = this.getOptionByFilterName(
          filterName,
          materialToEdit
        );
        const directMatch = data.options.find(
          (opt) =>
            opt.id === optionToCheck.id &&
            opt.value === optionToCheck.value &&
            opt.value2 === optionToCheck.value2
        );
        if (directMatch) {
          this.autoCompleteFacade.selectMaterialNumberDescriptionOrCustomerMaterial(
            directMatch,
            filterName
          );
        } else {
          this.selectMaterialForNoDirectAutocompleteMatch(
            filterName,
            optionToCheck,
            inputs,
            materialToEdit,
            data.options
          );
        }

        cdref.detectChanges();
      });
  }

  private selectMaterialForNoDirectAutocompleteMatch(
    filterName: FilterNames,
    optionToCheck: IdValue,
    inputs: EditMaterialInputs,
    materialToEdit: MaterialTableItem,
    options: IdValue[]
  ): void {
    // autocomplete does not have a direct match
    // depending on the requested field an other autocomplete will be performed
    switch (filterName) {
      case FilterNames.MATERIAL_NUMBER:
      case FilterNames.MATERIAL_DESCRIPTION: {
        // when mat15 and MatDesc are present in optionToCheck the set of mat15+matDesc+customerMaterial will be handled as valid option (customerMaterial can be either manualInput or autocomplete value)
        if (optionToCheck.id && optionToCheck.value) {
          this.autoCompleteFacade.selectMaterialNumberDescriptionOrCustomerMaterial(
            this.getOptionByFilterName(filterName, materialToEdit),
            filterName,
            options.length === 1
          );
        } else {
          // mat15 or matDesc are invalid, so both fields will be preset with the values from the row of materialInputTable
          inputs.matNumberInput.searchFormControl.setValue(
            materialToEdit.materialNumber,
            { emitEvent: false } // to not trigger autocomplete
          );
          inputs.matDescInput.searchFormControl.setValue(
            materialToEdit.materialDescription,
            { emitEvent: false } // to not trigger autocomplete
          );
          // when customerMaterial has a value perform an additional autocomplete for customerMaterial as fallback
          // autocomplete will not have a direct match , what is valid so no field will be overwritten
          if (materialToEdit.customerMaterialNumber) {
            inputs.customerMaterialInput.searchFormControl.setValue(
              materialToEdit.customerMaterialNumber
            );
          }
        }
        break;
      }
      case FilterNames.CUSTOMER_MATERIAL: {
        // that is a useCase where the customerMaterial is a manualInput
        // matDesc+Mat15 are present in optionToCheck, so the set of mat15+matDesc+customerMaterial will be handled as valid option
        if (optionToCheck.value && optionToCheck.value2) {
          this.autoCompleteFacade.selectMaterialNumberDescriptionOrCustomerMaterial(
            this.getOptionByFilterName(filterName, materialToEdit),
            filterName,
            options.length === 1
          );
        } else {
          // this is a useCase where mat15 or matDesc is invalid but customerMaterial has a value, additionally try autoComplete for Mat15
          // autocomplete will not have a direct match (mat15/matDesc) is invalid so no field will be overwritten
          // the user will see possible options for mat15 (e.g. when Mat15 is incomplete)
          inputs.matNumberInput.searchFormControl.setValue(
            materialToEdit.materialNumber
          );
          // mat15 field is invalid the errorMsg shall be displayed directly
          inputs.matNumberInput.searchFormControl.markAllAsTouched();
        }
        break;
      }
      // no default
    }
  }

  private getOptionByFilterName(
    filterName: FilterNames,
    materialToEdit: MaterialTableItem
  ): IdValue {
    switch (filterName) {
      case FilterNames.MATERIAL_NUMBER: {
        return this.getOptionForMaterialNumber(materialToEdit);
      }
      case FilterNames.MATERIAL_DESCRIPTION: {
        return this.getOptionForMaterialDescription(materialToEdit);
      }
      case FilterNames.CUSTOMER_MATERIAL: {
        return this.getOptionForCustomerMaterial(materialToEdit);
      }
      default: {
        return this.getOptionForMaterialNumber(materialToEdit);
      }
    }
  }

  private getOptionForCustomerMaterial(materialToEdit: MaterialTableItem) {
    const materialCopy = cloneDeep(materialToEdit);

    return {
      value: materialCopy.materialNumber,
      value2: materialCopy.materialDescription,
      id: materialCopy.customerMaterialNumber,
      deliveryUnit: materialCopy.deliveryUnit,
      uom: materialCopy.UoM,
      selected: false,
    };
  }

  private getOptionForMaterialDescription(materialToEdit: MaterialTableItem) {
    const materialCopy = cloneDeep(materialToEdit);

    return {
      value: materialCopy.materialNumber,
      id: materialCopy.materialDescription,
      value2: materialCopy.customerMaterialNumber,
      deliveryUnit: materialCopy.deliveryUnit,
      uom: materialCopy.UoM,
      selected: false,
    };
  }

  private getOptionForMaterialNumber(materialToEdit: MaterialTableItem) {
    const materialCopy = cloneDeep(materialToEdit);

    return {
      id: materialCopy.materialNumber,
      value: materialCopy.materialDescription,
      value2: materialCopy.customerMaterialNumber,
      deliveryUnit: materialCopy.deliveryUnit,
      uom: materialCopy.UoM,
      selected: false,
    };
  }
}
