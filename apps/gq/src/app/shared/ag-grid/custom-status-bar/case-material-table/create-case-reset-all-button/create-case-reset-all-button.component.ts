import { Component } from '@angular/core';

import { clearCreateCaseRowData } from '@gq/core/store/actions';
import { Store } from '@ngrx/store';

@Component({
  selector: 'gq-create-case-reset-all-button',
  templateUrl: './create-case-reset-all-button.component.html',
})
export class CreateCaseResetAllButtonComponent {
  constructor(private readonly store: Store) {}
  agInit(): void {}
  resetAll(): void {
    this.store.dispatch(clearCreateCaseRowData());
  }
}
