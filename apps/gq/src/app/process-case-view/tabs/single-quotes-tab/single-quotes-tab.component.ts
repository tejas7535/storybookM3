import { ChangeDetectionStrategy, Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';

import { Observable } from 'rxjs';

import { Store } from '@ngrx/store';

import { ViewToggle } from '@schaeffler/view-toggle';

import { getQuotation, getUpdateLoading } from '../../../core/store';
import { Quotation } from '../../../shared/models';
import { AgGridStateService } from '../../../shared/services/ag-grid-state.service/ag-grid-state.service';
import { AddCustomViewModalComponent } from './add-custom-view-modal/add-custom-view-modal.component';

@Component({
  selector: 'gq-single-quotes-tab',
  templateUrl: './single-quotes-tab.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SingleQuotesTabComponent implements OnInit {
  private readonly ADD_VIEW_ID = 9999;

  public quotation$: Observable<Quotation>;
  public updateLoading$: Observable<boolean>;

  public customViews: ViewToggle[] = [];

  constructor(
    private readonly store: Store,
    private readonly dialog: MatDialog,
    private readonly gridStateService: AgGridStateService
  ) {}

  public ngOnInit(): void {
    this.quotation$ = this.store.select(getQuotation);
    this.updateLoading$ = this.store.select(getUpdateLoading);
    this.gridStateService.init('process_case');

    this.customViews = [
      ...this.gridStateService.getCustomViews(),
      {
        id: this.ADD_VIEW_ID,
        title: '+',
      },
    ];
    this.gridStateService.setActiveView(this.customViews[0].id);
  }

  onViewToggle(view: ViewToggle) {
    if (view.id === this.ADD_VIEW_ID) {
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
    } else {
      this.gridStateService.setActiveView(view.id);
    }
  }
}
