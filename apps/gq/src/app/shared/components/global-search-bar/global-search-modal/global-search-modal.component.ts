import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormControl } from '@angular/forms';
import { MatDialogRef } from '@angular/material/dialog';

import { debounce, Subject, takeUntil, timer } from 'rxjs';

@Component({
  selector: 'gq-global-search-modal',
  templateUrl: './global-search-modal.component.html',
})
export class GlobalSearchModalComponent implements OnInit, OnDestroy {
  private readonly DEBOUNCE_TIME_DEFAULT = 500;

  private readonly unsubscribe$ = new Subject<boolean>();

  searchFormControl: FormControl;

  materialNumbersToDisplay: string[] = [];
  searchVal = '';

  mockMaterialNrs = [
    '009117903-0000-13',
    '000001279-5208-11',
    '000266175-5063-10',
    '001206109-0000-23',
    '001306109-0000-23',
    '001406109-0000-23',
    '001506109-0000-23',
  ];

  constructor(
    private readonly dialogRef: MatDialogRef<GlobalSearchModalComponent>
  ) {
    this.searchFormControl = new FormControl();
  }

  ngOnInit(): void {
    this.searchFormControl.valueChanges
      .pipe(
        takeUntil(this.unsubscribe$),
        debounce((val) =>
          val === '' ? timer(0) : timer(this.DEBOUNCE_TIME_DEFAULT)
        )
      )
      .subscribe((searchVal: string) => {
        this.searchVal = searchVal;

        if (searchVal === '') {
          this.materialNumbersToDisplay = [];

          return;
        }

        // This is just for testing puropses, in the future this will be done in BE
        this.materialNumbersToDisplay = this.mockMaterialNrs
          .filter((materialNr: string) => materialNr.startsWith(searchVal))
          .slice(0, 5);
      });
  }

  ngOnDestroy(): void {
    this.unsubscribe$.next(true);
    this.unsubscribe$.unsubscribe();
  }

  onItemSelected(materialNr: string) {
    console.log(materialNr);
  }

  closeDialog() {
    this.dialogRef.close();
  }

  clearInputField() {
    this.materialNumbersToDisplay = [];
    this.searchFormControl.patchValue('');
  }
}
