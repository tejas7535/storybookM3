import { NINE, SPACE, ZERO } from '@angular/cdk/keycodes';
import { Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { FormControl } from '@angular/forms';

import { Observable, Subscription } from 'rxjs';

import { select, Store } from '@ngrx/store';

import {
  addRowDataItem,
  autocomplete,
  getCaseAutocompleteLoading,
  getCaseMaterialnumber,
  selectAutocompleteOption,
  unselectAutocompleteOptions,
} from '../../../core/store';
import {
  AutocompleteSearch,
  CaseFilterItem,
  CaseTableItem,
  IdValue,
} from '../../../core/store/models';
import { CaseState } from '../../../core/store/reducers/create-case/create-case.reducer';
import { AutocompleteInputComponent } from '../autocomplete-input/autocomplete-input.component';

@Component({
  selector: 'gq-add-entry',
  templateUrl: './add-entry.component.html',
  styleUrls: ['./add-entry.component.scss'],
})
export class AddEntryComponent implements OnInit, OnDestroy {
  materialNumber$: Observable<CaseFilterItem>;
  materialNumberAutocompleteLoading$: Observable<boolean>;

  materialNumber: string;
  quantity: any;
  materialNumberIsValid = false;
  quantityValid = false;
  addRowEnabled = false;
  isExpanded = false;
  quantityFormControl: FormControl = new FormControl();
  private readonly subscription: Subscription = new Subscription();

  @ViewChild('materialNumberInput') matNumberInput: AutocompleteInputComponent;

  constructor(private readonly store: Store<CaseState>) {}
  public ngOnInit(): void {
    this.materialNumber$ = this.store.pipe(select(getCaseMaterialnumber));
    this.materialNumberAutocompleteLoading$ = this.store.pipe(
      select(getCaseAutocompleteLoading, 'materialNumber')
    );
    this.addSubscriptions();
  }
  addSubscriptions(): void {
    this.subscription.add(
      this.store.pipe(select(getCaseMaterialnumber)).subscribe((res) => {
        if (res.options.length > 0) {
          const idValueItem = res.options.find((opt) => opt.selected);

          this.materialNumber = idValueItem ? idValueItem.value : undefined;
        }
      })
    );
    this.subscription.add(
      this.quantityFormControl.valueChanges.subscribe((value) => {
        this.quantityValid = value !== undefined && value.length >= 1;
        this.quantity = value;
        this.rowInputValid();
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
  rowInputValid(): void {
    this.addRowEnabled = this.materialNumberIsValid
      ? this.quantityValid
      : false;
  }
  addRow(): void {
    const items: CaseTableItem[] = [
      {
        materialNumber: this.materialNumber,
        quantity: this.quantity,
        info: true,
      },
    ];
    this.store.dispatch(addRowDataItem({ items }));
    this.matNumberInput.clearInput();
    this.quantityFormControl.setValue('');
  }
  numberOnly(event: any): boolean {
    const charCode = event.which ? event.which : event.keyCode;

    return !(charCode >= SPACE && (charCode < ZERO || charCode > NINE));
  }

  toggleExpanded(): void {
    this.isExpanded = !this.isExpanded;
  }
}
