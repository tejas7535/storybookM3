import { Component } from '@angular/core';

import { Store } from '@ngrx/store';

import { clearRowData } from '../../../core/store';
import { CaseState } from '../../../core/store/reducers/create-case/create-case.reducer';

@Component({
  selector: 'gq-reset-all-button',
  templateUrl: './reset-all-button.component.html',
  styleUrls: ['./reset-all-button.component.scss'],
})
export class ResetAllButtonComponent {
  constructor(private readonly store: Store<CaseState>) {}
  agInit(): void {}
  resetAll(): void {
    this.store.dispatch(clearRowData());
  }
}
