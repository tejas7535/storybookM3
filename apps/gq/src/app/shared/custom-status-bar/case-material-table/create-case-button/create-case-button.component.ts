import { Component, OnInit } from '@angular/core';

import { Observable } from 'rxjs';

import { Store } from '@ngrx/store';

import { createCase, getCustomerConditionsValid } from '../../../../core/store';
import { CaseState } from '../../../../core/store/reducers/create-case/create-case.reducer';

@Component({
  selector: 'gq-create-case-button',
  templateUrl: './create-case-button.component.html',
})
export class CreateCaseButtonComponent implements OnInit {
  createCaseEnabled$: Observable<boolean>;
  constructor(private readonly store: Store<CaseState>) {}
  ngOnInit(): void {
    this.createCaseEnabled$ = this.store.select(getCustomerConditionsValid);
  }

  createCase(): void {
    this.store.dispatch(createCase());
  }

  agInit(): void {}
}
