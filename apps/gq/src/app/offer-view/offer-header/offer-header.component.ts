import { Location } from '@angular/common';
import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';

import { Observable, Subscription } from 'rxjs';

import { select, Store } from '@ngrx/store';

import { Customer } from '../../core/store/models';
import { ProcessCaseState } from '../../core/store/reducers/process-case/process-case.reducer';
import { getCustomer } from '../../core/store/selectors';

@Component({
  selector: 'gq-offer-header',
  templateUrl: './offer-header.component.html',
  styleUrls: ['./offer-header.component.scss'],
})
export class OfferHeaderComponent implements OnInit {
  @Input() offerNumber: string;

  @Output()
  readonly toggleOfferDrawer: EventEmitter<boolean> = new EventEmitter();

  public customer$: Observable<Customer>;
  public readonly subscription: Subscription = new Subscription();

  constructor(
    private readonly store: Store<ProcessCaseState>,
    private readonly location: Location
  ) {}
  public ngOnInit(): void {
    this.customer$ = this.store.pipe(select(getCustomer));
  }
  navigateBack(): void {
    this.location.back();
  }
}
