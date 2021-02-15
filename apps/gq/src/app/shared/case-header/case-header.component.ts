import { Location } from '@angular/common';
import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { MatMenuTrigger } from '@angular/material/menu';

import { Observable } from 'rxjs';

import { select, Store } from '@ngrx/store';

import { Customer, MaterialDetails, Quotation } from '../../core/store/models';
import { ProcessCaseState } from '../../core/store/reducers/process-case/process-case.reducer';
import { getCustomer } from '../../core/store/selectors';

@Component({
  selector: 'gq-case-header',
  templateUrl: './case-header.component.html',
  styleUrls: ['./case-header.component.scss'],
})
export class CaseHeaderComponent implements OnInit {
  @Input() gqId: number;
  @Input() sapId: string;
  @Input() customerName: string;
  @Input() material: MaterialDetails;
  @Input() offerScreen: boolean;
  @Input() quotation: Quotation;

  @Output()
  readonly toggleOfferDrawer: EventEmitter<boolean> = new EventEmitter();

  public customer$: Observable<Customer>;

  timedOutCloser: number;

  constructor(
    private readonly store: Store<ProcessCaseState>,
    private readonly location: Location
  ) {}

  public ngOnInit(): void {
    this.customer$ = this.store.pipe(select(getCustomer));
  }

  drawerToggle(): void {
    this.toggleOfferDrawer.emit(true);
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
