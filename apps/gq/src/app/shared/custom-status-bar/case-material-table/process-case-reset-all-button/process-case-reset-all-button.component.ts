import { Component } from '@angular/core';

import { Store } from '@ngrx/store';

import { clearProcessCaseRowData } from '../../../../core/store';
import { CaseState } from '../../../../core/store/reducers/create-case/create-case.reducer';

@Component({
  selector: 'gq-process-case-reset-all-button',
  templateUrl: './process-case-reset-all-button.component.html',
})
export class ProcessCaseResetAllButtonComponent {
  constructor(private readonly store: Store<CaseState>) {}
  agInit(): void {}
  resetAll(): void {
    this.store.dispatch(clearProcessCaseRowData());
  }
}
