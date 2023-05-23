import { Component } from '@angular/core';

import { ProcessCaseActions } from '@gq/core/store/process-case';
import { Store } from '@ngrx/store';

@Component({
  selector: 'gq-process-case-reset-all-button',
  templateUrl: './process-case-reset-all-button.component.html',
})
export class ProcessCaseResetAllButtonComponent {
  constructor(private readonly store: Store) {}
  agInit(): void {}
  resetAll(): void {
    this.store.dispatch(ProcessCaseActions.clearRowData());
  }
}
