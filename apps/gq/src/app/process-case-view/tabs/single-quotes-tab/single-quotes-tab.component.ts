import { ChangeDetectionStrategy, Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';

import { Observable } from 'rxjs';

import { translate } from '@ngneat/transloco';
import { Store } from '@ngrx/store';

import { ViewToggle } from '@schaeffler/view-toggle';

import { getQuotation, getUpdateLoading } from '../../../core/store';
import { Quotation } from '../../../shared/models';
import { AddCustomViewModalComponent } from './add-custom-view-modal/add-custom-view-modal.component';

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

  constructor(
    private readonly store: Store,
    private readonly dialog: MatDialog
  ) {}

  public ngOnInit(): void {
    this.quotation$ = this.store.select(getQuotation);
    this.updateLoading$ = this.store.select(getUpdateLoading);
  }

  onViewToggle(view: ViewToggle) {
    if (view.id === 1) {
      this.dialog
        .open(AddCustomViewModalComponent, {
          disableClose: true,
          width: '550px',
          data: { createNewView: true },
        })
        .afterClosed()
        .subscribe((result) => {
          console.log(result);
        });
    }
  }
}
