import { Component, Input, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { AbstractControl, FormControl, ValidationErrors } from '@angular/forms';

import { Observable, Subscription } from 'rxjs';

import { Store } from '@ngrx/store';

import {
  addMaterialRowDataItem,
  addRowDataItem,
  autocomplete,
  getCaseAutocompleteLoading,
  getCaseMaterialDesc,
  getCaseMaterialNumber,
  setSelectedAutocompleteOption,
  unselectAutocompleteOptions,
} from '../../../core/store';
import { CaseFilterItem } from '../../../core/store/reducers/create-case/models';
import { AutocompleteInputComponent } from '../../autocomplete-input/autocomplete-input.component';
import { FilterNames } from '../../autocomplete-input/filter-names.enum';
import { AutocompleteSearch, IdValue } from '../../models/search';
import { MaterialTableItem } from '../../models/table/material-table-item-model';
import { ValidationDescription } from '../../models/table/validation-description.enum';
import { HelperService } from '../../services/helper-service/helper-service.service';
import { PasteMaterialsService } from '../../services/paste-materials-service/paste-materials.service';
import { translate } from '@ngneat/transloco';
import { MatSnackBar } from '@angular/material/snack-bar';

@Component({
  selector: 'gq-add-entry',
  templateUrl: './add-entry.component.html',
})
export class AddEntryComponent implements OnInit, OnDestroy {
  public materialNumber$: Observable<CaseFilterItem>;
  public materialDesc$: Observable<CaseFilterItem>;
  autoSelectMaterial$: Observable<CaseFilterItem>;
  public materialNumberAutocompleteLoading$: Observable<boolean>;
  public materialDescAutocompleteLoading$: Observable<boolean>;

  public materialNumberInput: boolean;
  public quantity: number;
  public materialInputIsValid = false;
  public quantityValid = false;
  public addRowEnabled = false;
  public quantityFormControl: FormControl = new FormControl();
  private readonly subscription: Subscription = new Subscription();

  @Input() public readonly isCaseView: boolean;

  @ViewChild('materialNumberInput')
  public matNumberInput: AutocompleteInputComponent;
  @ViewChild('materialDescInput')
  public matDescInput: AutocompleteInputComponent;

  constructor(
    private readonly store: Store,
    private readonly pasteMaterialsService: PasteMaterialsService,
    private readonly matSnackBar: MatSnackBar
  ) {}

  public ngOnInit(): void {
    this.materialNumber$ = this.store.select(getCaseMaterialNumber);
    this.materialDesc$ = this.store.select(getCaseMaterialDesc);
    this.materialNumberAutocompleteLoading$ = this.store.select(
      getCaseAutocompleteLoading,
      FilterNames.MATERIAL_NUMBER
    );
    this.materialNumberAutocompleteLoading$ = this.store.select(
      getCaseAutocompleteLoading,
      FilterNames.MATERIAL_DESCRIPTION
    );
    this.addSubscriptions();
  }

  addSubscriptions(): void {
    this.quantityFormControl.setValidators([this.quantityValidator.bind(this)]);
  }

  quantityValidator(control: AbstractControl): ValidationErrors {
    const { value } = control;
    // input field should stay green when empty
    this.quantityValid = !value || value > 0;
    this.quantity = value;
    this.rowInputValid();

    return !this.quantityValid
      ? { invalidInput: !this.quantityValid }
      : undefined;
  }

  ngOnDestroy(): void {
    this.subscription.unsubscribe();
  }

  autocomplete(autocompleteSearch: AutocompleteSearch): void {
    this.store.dispatch(autocomplete({ autocompleteSearch }));
  }

  selectOption(option: IdValue, filter: string): void {
    this.store.dispatch(
      setSelectedAutocompleteOption({
        filter,
        option,
      })
    );
  }

  unselectOptions(filter: string): void {
    const filterName =
      filter === FilterNames.MATERIAL_NUMBER
        ? FilterNames.MATERIAL_DESCRIPTION
        : FilterNames.MATERIAL_NUMBER;
    this.store.dispatch(unselectAutocompleteOptions({ filter: filterName }));
    this.store.dispatch(unselectAutocompleteOptions({ filter }));
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
      this.quantityValid &&
      this.quantity > 0;
  }

  addRow(): void {
    const items: MaterialTableItem[] = [
      {
        materialNumber: this.matNumberInput.searchFormControl.value,
        materialDescription: this.matDescInput.searchFormControl.value,
        quantity: this.quantity,
        info: { valid: true, description: [ValidationDescription.Valid] },
      },
    ];
    // dispatch action depending on page
    // eslint-disable-next-line @typescript-eslint/no-unused-expressions
    this.isCaseView
      ? this.store.dispatch(addRowDataItem({ items }))
      : this.store.dispatch(addMaterialRowDataItem({ items }));

    // clear fields after dispatching action
    this.matNumberInput.clearInput();
    this.matDescInput.clearInput();
    this.quantityFormControl.reset();
    this.materialInputIsValid = false;
  }

  onQuantityKeyPress(event: KeyboardEvent): void {
    HelperService.validateQuantityInputKeyPress(event);
  }

  onQuantityPaste(event: ClipboardEvent): void {
    HelperService.validateQuantityInputPaste(event);
  }

  pasteFromClipboard() {
    this.pasteMaterialsService.onPasteStart(this.isCaseView);
  }

  displaySnackBar(): void {
    const matSnackBarRef = this.matSnackBar.open(
      translate('shared.caseMaterial.addEntry.pasteSnackbar.message'),
      translate('shared.caseMaterial.addEntry.pasteSnackbar.action'),
      { duration: 5000 }
    );
    matSnackBarRef?.onAction().subscribe(() => {
      window
        .open(
          'https://worksite-my.sharepoint.com/:v:/g/personal/fongmgll_schaeffler_com/ESFXg0x4h0xHjneDtNn8H78BuEvZ1qwZl8KF5PrhBmTXhw?e=6WedPW&isSPOFile=1',
          '_blank'
        )
        .focus();
    });
  }
}
