import {
  Component,
  EventEmitter,
  Input,
  OnDestroy,
  OnInit,
  Output,
} from '@angular/core';
import { Router } from '@angular/router';

import { Observable, Subscription } from 'rxjs';

import { select, Store } from '@ngrx/store';

import { AppRoutePath } from '../../app-route-path.enum';
import { Customer } from '../../core/store/models';
import { ProcessCaseState } from '../../core/store/reducers/process-case/process-case.reducers';
import { getCustomer } from '../../core/store/selectors';

@Component({
  selector: 'gq-offer-header',
  templateUrl: './offer-header.component.html',
  styleUrls: ['./offer-header.component.scss'],
})
export class OfferHeaderComponent implements OnInit, OnDestroy {
  @Input() offerNumber: string;
  @Input() quotationNumber: string;

  @Output()
  readonly toggleOfferDrawer: EventEmitter<boolean> = new EventEmitter();

  public customer$: Observable<Customer>;
  public readonly subscription: Subscription = new Subscription();

  private customerNumber: string;

  constructor(
    private readonly store: Store<ProcessCaseState>,
    private readonly router: Router
  ) {}

  public ngOnInit(): void {
    this.customer$ = this.store.pipe(select(getCustomer));

    this.subscription.add(
      this.customer$.subscribe(
        (customer) => (this.customerNumber = customer.id)
      )
    );
  }

  public ngOnDestroy(): void {
    this.subscription.unsubscribe();
  }

  backToProcessCase(): void {
    this.router.navigate([AppRoutePath.ProcessCaseViewPath], {
      queryParams: {
        quotation_number: this.quotationNumber,
        customer_number: this.customerNumber,
      },
    });
  }
}
