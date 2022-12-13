import { ChangeDetectionStrategy, Component, OnInit } from '@angular/core';

import { Observable } from 'rxjs';

import { translate } from '@ngneat/transloco';
import { Store } from '@ngrx/store';

import { ViewToggle } from '@schaeffler/view-toggle';

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

  public customViews: ViewToggle[] = [
    {
      id: 0,
      title: translate('shared.quotationDetailsTable.defaultView'),
    },
    {
      id: 1,
      title: '+',
    },
  ];

  constructor(private readonly store: Store) {}

  public ngOnInit(): void {
    this.quotation$ = this.store.select(getQuotation);
    this.updateLoading$ = this.store.select(getUpdateLoading);
  }

  onViewToggle(view: ViewToggle) {
    console.log(view);
  }
}
