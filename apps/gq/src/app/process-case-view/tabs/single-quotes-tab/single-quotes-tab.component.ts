import { ChangeDetectionStrategy, Component, OnInit } from '@angular/core';

import { Observable } from 'rxjs';

import { Store } from '@ngrx/store';

import { getQuotation, getUpdateLoading } from '../../../core/store';
import { Quotation } from '../../../shared/models';

@Component({
  selector: 'gq-single-quotes-tab',
  templateUrl: './single-quotes-tab.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SingleQuotesTabComponent implements OnInit {
  public quotation$: Observable<Quotation>;
  public updateLoading$: Observable<boolean>;

  constructor(private readonly store: Store) {}

  public ngOnInit(): void {
    this.quotation$ = this.store.select(getQuotation);
    this.updateLoading$ = this.store.select(getUpdateLoading);
  }
}
