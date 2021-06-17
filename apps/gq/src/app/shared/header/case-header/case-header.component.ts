import { Location } from '@angular/common';
import { Component, Input, OnInit } from '@angular/core';
import { MatMenuTrigger } from '@angular/material/menu';

import { Observable } from 'rxjs';

import { select, Store } from '@ngrx/store';

import { ProcessCaseState } from '../../../core/store/reducers/process-case/process-case.reducer';
import { getCustomer } from '../../../core/store/selectors';
import { Customer } from '../../models/customer';

@Component({
  selector: 'gq-case-header',
  templateUrl: './case-header.component.html',
  styleUrls: ['./case-header.component.scss'],
})
export class CaseHeaderComponent implements OnInit {
  @Input() showCustomerHeader: boolean;

  public customer$: Observable<Customer>;

  timedOutCloser: number;

  constructor(
    private readonly store: Store<ProcessCaseState>,
    private readonly location: Location
  ) {}

  public ngOnInit(): void {
    this.customer$ = this.store.pipe(select(getCustomer));
  }

  backClicked(): void {
    this.location.back();
  }

  iconEnter(trigger: MatMenuTrigger): void {
    if (this.timedOutCloser) {
      clearTimeout(this.timedOutCloser);
    }
    trigger.openMenu();
  }

  iconLeave(trigger: MatMenuTrigger): void {
    this.timedOutCloser = setTimeout(() => {
      trigger.closeMenu();
    }, 1500);
  }
}
