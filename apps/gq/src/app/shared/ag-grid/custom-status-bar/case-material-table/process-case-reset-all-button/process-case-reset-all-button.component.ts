import { Component } from '@angular/core';

import { Store } from '@ngrx/store';

import { clearProcessCaseRowData } from '../../../../../core/store';

@Component({
  selector: 'gq-process-case-reset-all-button',
  templateUrl: './process-case-reset-all-button.component.html',
})
export class ProcessCaseResetAllButtonComponent {
  constructor(private readonly store: Store) {}
  agInit(): void {}
  resetAll(): void {
    this.store.dispatch(clearProcessCaseRowData());
  }
}
