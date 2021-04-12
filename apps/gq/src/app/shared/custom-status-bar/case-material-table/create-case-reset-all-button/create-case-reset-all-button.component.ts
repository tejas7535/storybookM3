import { Component } from '@angular/core';

import { Store } from '@ngrx/store';

import { clearCreateCaseRowData } from '../../../../core/store';
import { CaseState } from '../../../../core/store/reducers/create-case/create-case.reducer';

@Component({
  selector: 'gq-create-case-reset-all-button',
  templateUrl: './create-case-reset-all-button.component.html',
  styleUrls: ['./create-case-reset-all-button.component.scss'],
})
export class CreateCaseResetAllButtonComponent {
  constructor(private readonly store: Store<CaseState>) {}
  agInit(): void {}
  resetAll(): void {
    this.store.dispatch(clearCreateCaseRowData());
  }
}
