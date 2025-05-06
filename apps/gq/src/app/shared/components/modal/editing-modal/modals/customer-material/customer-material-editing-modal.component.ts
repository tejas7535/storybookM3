import { CommonModule } from '@angular/common';
import {
  Component,
  DestroyRef,
  inject,
  input,
  InputSignal,
  OnInit,
} from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { FormControl, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatDialogRef } from '@angular/material/dialog';

import { map, Observable, take } from 'rxjs';

import { ActiveCaseFacade } from '@gq/core/store/active-case/active-case.facade';
import { UpdateQuotationDetail } from '@gq/core/store/active-case/models';
import { AutoCompleteFacade } from '@gq/core/store/facades';
import { AutocompleteRequestDialog } from '@gq/shared/components/autocomplete-input/autocomplete-request-dialog.enum';
import { FilterNames } from '@gq/shared/components/autocomplete-input/filter-names.enum';
import { AutocompleteSelectionComponent } from '@gq/shared/components/autocomplete-selection/autocomplete-selection.component';
import { DialogHeaderModule } from '@gq/shared/components/header/dialog-header/dialog-header.module';
import { EditingModal } from '@gq/shared/components/modal/editing-modal/models/editing-modal.model';
import { AutocompleteSearch } from '@gq/shared/models/search';
import { SelectableValue } from '@gq/shared/models/selectable-value.model';
import { PushPipe } from '@ngrx/component';

import { LoadingSpinnerModule } from '@schaeffler/loading-spinner';
import { SharedTranslocoModule } from '@schaeffler/transloco';

@Component({
  selector: 'gq-customer-material-editing-modal',
  imports: [
    CommonModule,
    DialogHeaderModule,
    ReactiveFormsModule,
    MatButtonModule,
    AutocompleteSelectionComponent,
    SharedTranslocoModule,
    PushPipe,
    LoadingSpinnerModule,
  ],
  standalone: true,
  templateUrl: './customer-material-editing-modal.component.html',
})
export class CustomerMaterialEditingModalComponent implements OnInit {
  private readonly dialogRef = inject(
    MatDialogRef<CustomerMaterialEditingModalComponent>
  );
  private readonly autocompleteFacade = inject(AutoCompleteFacade);
  private readonly activeCaseFacade = inject(ActiveCaseFacade);
  private readonly destroyRef = inject(DestroyRef);

  readonly customerMaterialsAreLoading$ =
    this.autocompleteFacade.materialNumberAutocompleteLoading$;
  readonly updateLoading$ = this.activeCaseFacade.quotationDetailUpdating$;

  // customer material specific logic to filter out empty values and set default selection to the current customer material
  readonly materialNumberForEditMaterial$: Observable<SelectableValue[]> =
    this.autocompleteFacade.materialNumberForEditMaterial$.pipe(
      map((caseFilterItem) =>
        caseFilterItem.options
          .filter((opt) => opt.value2 !== null)
          .map(
            ({ id, value, value2 }) =>
              ({
                id,
                value,
                value2,
                defaultSelection:
                  this.modalData().quotationDetail.customerMaterial === value2,
              }) as SelectableValue
          )
      )
    );

  modalData: InputSignal<EditingModal> = input.required<EditingModal>();
  MAX_LENGTH = 35;
  confirmButtonDisabled = true;
  customerMaterialForm: FormGroup;

  ngOnInit(): void {
    this.customerMaterialForm = new FormGroup({
      customerMaterialNumber: new FormControl({}),
    });
    this.requestCustomerMaterials();
    this.addButtonDisabledSubscription();
  }

  addButtonDisabledSubscription(): void {
    this.customerMaterialForm
      .get('customerMaterialNumber')
      .valueChanges.pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe((value) => {
        const formValue = this.getFormControlValue(value) ?? '';
        const currentCustomerMaterial =
          this.modalData().quotationDetail.customerMaterial ?? '';
        this.confirmButtonDisabled = formValue === currentCustomerMaterial;
      });
  }

  requestCustomerMaterials(): void {
    const autocompleteSearch: AutocompleteSearch = {
      filter: FilterNames.MATERIAL_NUMBER,
      searchFor: this.modalData().quotationDetail.material.materialNumber15,
    };
    this.autocompleteFacade.setRequestDialog(
      AutocompleteRequestDialog.EDIT_MATERIAL
    );
    this.autocompleteFacade.autocomplete(
      autocompleteSearch,
      this.modalData().customerId
    );
  }

  customerMaterialDisplay(value: SelectableValue): string {
    return value?.value2;
  }

  getFormControlValue(value: string | SelectableValue): string {
    return typeof value === 'string'
      ? value
      : this.customerMaterialDisplay(value);
  }

  confirmCustomerMaterialNumber(): void {
    const value = this.customerMaterialForm.get('customerMaterialNumber').value;
    const formValue = this.getFormControlValue(value);
    const update: UpdateQuotationDetail = {
      gqPositionId: this.modalData().quotationDetail.gqPositionId,
      // send null to backend if the input is empty to reset the customer material
      customerMaterial: formValue === '' ? null : formValue,
    };
    this.activeCaseFacade.updateQuotationDetails([update]);

    this.activeCaseFacade.quotationDetailUpdateSuccess$
      .pipe(take(1))
      .subscribe(() => this.closeDialog());
  }

  closeDialog(): void {
    this.autocompleteFacade.resetAutocompleteMaterials();
    this.dialogRef.close();
  }
}
