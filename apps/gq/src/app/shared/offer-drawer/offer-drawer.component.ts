import { Component, EventEmitter, Input, Output } from '@angular/core';

import { Observable } from 'rxjs';

import { Store } from '@ngrx/store';

import { getUpdateLoading } from '../../core/store';
import { ProcessCaseState } from '../../core/store/reducers/process-case/process-case.reducer';
import { Quotation } from '../models';

@Component({
  selector: 'gq-offer-drawer',
  templateUrl: './offer-drawer.component.html',
  styleUrls: ['./offer-drawer.component.scss'],
})
export class OfferDrawerComponent {
  updateLoading$: Observable<boolean>;
  @Input() quotation: Quotation;

  @Output()
  readonly toggleOfferDrawer: EventEmitter<boolean> = new EventEmitter();

  constructor(private readonly store: Store<ProcessCaseState>) {
    this.updateLoading$ = this.store.select(getUpdateLoading);
  }

  public drawerToggle(): void {
    this.toggleOfferDrawer.emit(true);
  }
}
