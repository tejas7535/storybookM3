import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormControl } from '@angular/forms';
import { MatDialogRef } from '@angular/material/dialog';

import { debounce, EMPTY, Subject, takeUntil, tap, timer } from 'rxjs';

import { AutoCompleteFacade } from '../../../../core/store';
import { IdValue } from '../../../models/search';
import { AutocompleteRequestDialog } from '../../autocomplete-input/autocomplete-request-dialog.enum';
import { FilterNames } from '../../autocomplete-input/filter-names.enum';

@Component({
  selector: 'gq-global-search-modal',
  templateUrl: './global-search-modal.component.html',
})
export class GlobalSearchModalComponent implements OnInit, OnDestroy {
  private readonly DEBOUNCE_TIME_DEFAULT = 500;
  public readonly MIN_INPUT_STRING_LENGTH_FOR_AUTOCOMPLETE = 2;

  private readonly unsubscribe$ = new Subject<boolean>();

  searchFormControl: FormControl;

  searchVal = '';

  constructor(
    private readonly dialogRef: MatDialogRef<GlobalSearchModalComponent>,
    public readonly autocomplete: AutoCompleteFacade
  ) {
    this.searchFormControl = new FormControl();
  }

  ngOnInit(): void {
    this.autocomplete.resetView();
    this.autocomplete.initFacade(AutocompleteRequestDialog.GLOBAL_SEARCH);

    this.searchFormControl.valueChanges
      .pipe(
        takeUntil(this.unsubscribe$),
        tap((value: string) => {
          if (value.length < this.MIN_INPUT_STRING_LENGTH_FOR_AUTOCOMPLETE) {
            this.searchVal = value;
            this.autocomplete.resetAutocompleteMaterials();
          }
        }),
        debounce((value: string) =>
          value.length >= this.MIN_INPUT_STRING_LENGTH_FOR_AUTOCOMPLETE
            ? timer(this.DEBOUNCE_TIME_DEFAULT)
            : EMPTY
        )
      )
      .subscribe((searchVal: string) => {
        this.searchVal = searchVal;

        if (searchVal === '') {
          this.autocomplete.resetAutocompleteMaterials();

          return;
        }

        this.autocomplete.autocomplete({
          filter: FilterNames.MATERIAL_NUMBER_OR_DESCRIPTION,
          searchFor: searchVal,
          limit: 5,
        });
      });
  }

  ngOnDestroy(): void {
    this.unsubscribe$.next(true);
    this.unsubscribe$.unsubscribe();
  }

  onItemSelected(idValue: IdValue) {
    console.log(idValue);
  }

  closeDialog() {
    this.dialogRef.close();
  }

  clearInputField() {
    this.searchFormControl.patchValue('');
  }
}
