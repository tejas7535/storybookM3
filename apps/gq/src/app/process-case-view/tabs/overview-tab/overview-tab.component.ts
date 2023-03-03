import { Component, OnDestroy, OnInit } from '@angular/core';

import { map, NEVER, Observable, Subject, takeUntil } from 'rxjs';

import { getCustomer } from '@gq/core/store/selectors';
import { Customer } from '@gq/shared/models/customer';
import { Store } from '@ngrx/store';

import { GeneralInformation } from './models';

@Component({
  selector: 'gq-overview-tab',
  templateUrl: './overview-tab.component.html',
})
export class OverviewTabComponent implements OnInit, OnDestroy {
  public generalInformation$: Observable<GeneralInformation> = NEVER;
  private readonly shutDown$$: Subject<void> = new Subject();

  constructor(private readonly store: Store) {}

  ngOnInit(): void {
    this.initializeObservables();
  }

  ngOnDestroy(): void {
    this.shutDown$$.next();
    this.shutDown$$.unsubscribe();
  }

  private initializeObservables(): void {
    this.generalInformation$ = this.store.select(getCustomer).pipe(
      takeUntil(this.shutDown$$),
      // TODO: collect information correctly when available
      // eslint-disable-next-line ngrx/avoid-mapping-selectors
      map((item: Customer) => {
        const info: GeneralInformation = {
          approvalLevel: 'L1 + L2',
          validityFrom: '01/01/2023',
          validityTo: '12/31/2023',
          duration: '10 months',
          project: 'GSIM Project',
          projectInformation:
            'This is a longer text that contains some Project information',
          customer: item,
          requestedQuotationDate: '01/01/2024',
          comment: 'This is a longer comment text, that contains a comment.',
        };

        return info;
      })
    );
  }
}
