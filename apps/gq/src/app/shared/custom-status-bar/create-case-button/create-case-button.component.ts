import { Component, OnInit } from '@angular/core';

import { Observable } from 'rxjs';

import { select, Store } from '@ngrx/store';

import { getCustomerConditionsValid } from '../../../core/store';
import { CaseState } from '../../../core/store/reducers/create-case/create-case.reducer';

@Component({
  selector: 'gq-create-case-button',
  templateUrl: './create-case-button.component.html',
  styleUrls: ['./create-case-button.component.scss'],
})
export class CreateCaseButtonComponent implements OnInit {
  createCaseEnabled$: Observable<boolean>;

  constructor(private readonly store: Store<CaseState>) {}
  ngOnInit(): void {
    this.createCaseEnabled$ = this.store.pipe(
      select(getCustomerConditionsValid)
    );
  }
  createCase(): void {
    // Todo: creating new case with the user input
  }
  agInit(): void {}
}
