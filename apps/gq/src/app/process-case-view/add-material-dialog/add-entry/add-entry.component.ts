import { NINE, SPACE, ZERO } from '@angular/cdk/keycodes';
import {
  Component,
  EventEmitter,
  Input,
  OnDestroy,
  OnInit,
  Output,
  ViewChild,
} from '@angular/core';
import { FormControl } from '@angular/forms';

import { Observable, Subscription } from 'rxjs';

import { select, Store } from '@ngrx/store';

import {
  addMaterialRowDataItem,
  autocomplete,
  getAddMaterialRowData,
  getCaseAutocompleteLoading,
  getCaseMaterialNumber,
  selectAutocompleteOption,
  unselectAutocompleteOptions,
} from '../../../core/store';
import {
  AutocompleteSearch,
  CaseFilterItem,
  IdValue,
  MaterialTableItem,
  ValidationDescription,
} from '../../../core/store/models';
import { ProcessCaseState } from '../../../core/store/reducers/process-case/process-case.reducer';
import { AutocompleteInputComponent } from '../../../shared/autocomplete-input/autocomplete-input.component';

@Component({
  selector: 'gq-add-material-entry',
  templateUrl: './add-entry.component.html',
  styleUrls: ['./add-entry.component.scss'],
})
export class AddEntryComponent implements OnInit, OnDestroy {
  materialNumber$: Observable<CaseFilterItem>;
  materialNumberAutocompleteLoading$: Observable<boolean>;

  _isDisabled: boolean;
  materialNumber: string;
  rowData: MaterialTableItem[];
  materialNumberInput: boolean;
  quantity: any;
  materialNumberIsValid = false;
  quantityValid = false;
  addRowEnabled = false;
  quantityFormControl: FormControl = new FormControl();
  private readonly subscription: Subscription = new Subscription();

  @Input() set isDisabled(isDisabled: boolean) {
    this._isDisabled = isDisabled;
    isDisabled
      ? this.quantityFormControl.disable()
      : this.quantityFormControl.enable();
  }

  @Output() readonly inputContent: EventEmitter<boolean> = new EventEmitter(
    true
  );
  @ViewChild('materialNumberInput') matNumberInput: AutocompleteInputComponent;

  constructor(private readonly store: Store<ProcessCaseState>) {}

  public ngOnInit(): void {
    this.materialNumber$ = this.store.pipe(select(getCaseMaterialNumber));
    this.materialNumberAutocompleteLoading$ = this.store.pipe(
      select(getCaseAutocompleteLoading, 'materialNumber')
    );
    this.addSubscriptions();
  }

  addSubscriptions(): void {
    this.subscription.add(
      this.store.pipe(select(getCaseMaterialNumber)).subscribe((res) => {
        if (res.options.length > 0) {
          const idValueItem = res.options.find((opt) => opt.selected);
          this.materialNumber = idValueItem ? idValueItem.id : undefined;
        }
      })
    );
    this.subscription.add(
      this.quantityFormControl.valueChanges.subscribe((value) => {
        this.quantityValid = value && value.length >= 1;
        this.emitHasInput();
        this.quantity = value;
        this.rowInputValid();
      })
    );
    this.subscription.add(
      this.store.pipe(select(getAddMaterialRowData)).subscribe((data) => {
        this.rowData = data;
      })
    );
  }

  ngOnDestroy(): void {
    this.subscription.unsubscribe();
  }

  agInit(): void {}

  autocomplete(autocompleteSearch: AutocompleteSearch): void {
    this.store.dispatch(autocomplete({ autocompleteSearch }));
  }

  selectOption(option: IdValue, filter: string): void {
    this.store.dispatch(selectAutocompleteOption({ option, filter }));
  }

  unselectOptions(filter: string): void {
    this.store.dispatch(unselectAutocompleteOptions({ filter }));
  }

  materialNumberValid(isValid: boolean): void {
    this.materialNumberIsValid = isValid;
    this.rowInputValid();
  }

  emitHasInput(): void {
    this.inputContent.emit(this.materialNumberInput || this.quantityValid);
  }

  materialHasInput(hasInput: boolean): void {
    this.materialNumberInput = hasInput;
    this.emitHasInput();
  }

  rowInputValid(): void {
    this.addRowEnabled = this.materialNumberIsValid
      ? this.quantityValid && this.rowDoesNotExist()
      : false;
  }

  rowDoesNotExist(): boolean {
    const exists = this.rowData.find(
      (el) =>
        el.materialNumber === this.materialNumber &&
        el.quantity === this.quantity
    );

    return exists === undefined;
  }

  addRow(): void {
    const items: MaterialTableItem[] = [
      {
        materialNumber: this.materialNumber,
        quantity: this.quantity,
        info: { valid: true, description: [ValidationDescription.Valid] },
      },
    ];
    this.store.dispatch(addMaterialRowDataItem({ items }));
    this.matNumberInput.clearInput();
    this.quantityFormControl.setValue('');
  }

  numberOnly(event: any): boolean {
    const charCode = event.which ? event.which : event.keyCode;

    return !(charCode >= SPACE && (charCode < ZERO || charCode > NINE));
  }
}
