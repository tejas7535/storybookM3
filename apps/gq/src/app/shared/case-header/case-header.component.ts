import { Location } from '@angular/common';
import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';

import { Observable } from 'rxjs';

import { select, Store } from '@ngrx/store';

import { Customer } from '../../core/store/models';
import { ProcessCaseState } from '../../core/store/reducers/process-case/process-case.reducers';
import { getCustomer } from '../../core/store/selectors';

@Component({
  selector: 'gq-case-header',
  templateUrl: './case-header.component.html',
  styleUrls: ['./case-header.component.scss'],
})
export class CaseHeaderComponent implements OnInit {
  @Input() quotationNumber: string;
  @Input() sapId: string;
  @Input() materialNumber15: string;

  @Output() readonly toggleOfferDrawer: EventEmitter<
    boolean
  > = new EventEmitter();

  customer$: Observable<Customer>;

  constructor(
    private readonly store: Store<ProcessCaseState>,
    private readonly _location: Location
  ) {}

  public ngOnInit(): void {
    this.customer$ = this.store.pipe(select(getCustomer));
  }

  drawerToggle(): void {
    this.toggleOfferDrawer.emit(true);
  }
  backClicked(): void {
    this._location.back();
  }
}
