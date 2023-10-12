import { Component, Inject, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';

import { Observable } from 'rxjs';

import { Store } from '@ngrx/store';

import {
  getBeautifiedFilterValues,
  getFiltersAsFileName,
} from '../../../core/store/selectors';
import {
  EmployeeListDialogMeta,
  EmployeeListDialogMetaFilters,
} from './models';

@Component({
  selector: 'ia-employee-list-dialog',
  templateUrl: './employee-list-dialog.component.html',
  styleUrls: ['./employee-list-dialog.component.scss'],
})
export class EmployeeListDialogComponent implements OnInit {
  beautifiedFilters$: Observable<EmployeeListDialogMetaFilters>;
  defaultExcelName$: Observable<string>;

  constructor(
    @Inject(MAT_DIALOG_DATA) public data: EmployeeListDialogMeta,
    private readonly store: Store
  ) {}

  ngOnInit(): void {
    this.beautifiedFilters$ = this.store.select(getBeautifiedFilterValues);
    this.defaultExcelName$ = this.store.select(
      getFiltersAsFileName(this.data.headings.header)
    );
  }
}
