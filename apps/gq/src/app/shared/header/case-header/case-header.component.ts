import { Location } from '@angular/common';
import { Component, Input, OnInit } from '@angular/core';
import { MatMenuTrigger } from '@angular/material/menu';

import { Observable } from 'rxjs';

import { Store } from '@ngrx/store';

import { getCustomer } from '../../../core/store/selectors';
import { Customer } from '../../models/customer';
import { Breadcrumb } from './breadcrumbs/breadcrumb.model';

@Component({
  selector: 'gq-case-header',
  templateUrl: './case-header.component.html',
  styleUrls: ['./case-header.component.scss'],
})
export class CaseHeaderComponent implements OnInit {
  @Input() showCustomerHeader: boolean;
  @Input() breadcrumbs: Breadcrumb[];

  public customer$: Observable<Customer>;

  timedOutCloser: number;

  constructor(
    private readonly store: Store,
    private readonly location: Location
  ) {}

  public ngOnInit(): void {
    this.customer$ = this.store.select(getCustomer);
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
    this.timedOutCloser = window.setTimeout(() => {
      trigger.closeMenu();
    }, 1500);
  }
}
