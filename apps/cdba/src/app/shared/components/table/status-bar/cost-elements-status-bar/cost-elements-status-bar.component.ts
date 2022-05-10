import { Component } from '@angular/core';

import { Observable } from 'rxjs';

import { IStatusPanelParams } from '@ag-grid-community/all-modules';
import {
  getCostComponentSplitItems as getCostComponentSplitItemsDetail,
  getSelectedSplitType as getSelectedSplitTypeDetail,
  toggleSplitType as toggleSplitTypeForDetailPage,
} from '@cdba/core/store';
import {
  CostComponentSplit,
  CostComponentSplitType,
} from '@cdba/shared/models';
import { Store } from '@ngrx/store';

import { toggleSplitType as toggleSplitTypeForComparePage } from '../../../../../compare/store/actions/compare.actions';
import {
  getCostComponentSplitItems as getCostComponentSplitItemsCompare,
  getSelectedSplitType as getSelectedSplitTypeCompare,
} from '../../../../../compare/store/selectors/compare.selectors';

@Component({
  selector: 'cdba-cost-elements-status-bar',
  templateUrl: './cost-elements-status-bar.component.html',
})
export class CostElementsStatusBarComponent {
  private index: number;
  public currentSplitType$: Observable<CostComponentSplitType>;
  public costElements$: Observable<CostComponentSplit[]>;

  constructor(private readonly store: Store) {}

  public agInit(params: IStatusPanelParams): void {
    this.index = params.context.index;

    if (this.index !== undefined) {
      this.currentSplitType$ = this.store.select(
        getSelectedSplitTypeCompare(this.index)
      );
      this.costElements$ = this.store.select(
        getCostComponentSplitItemsCompare(this.index)
      );
    } else {
      this.currentSplitType$ = this.store.select(getSelectedSplitTypeDetail);
      this.costElements$ = this.store.select(getCostComponentSplitItemsDetail);
    }
  }

  public toggleSelectedSplitType(): void {
    if (this.index !== undefined) {
      this.store.dispatch(toggleSplitTypeForComparePage());
    } else {
      this.store.dispatch(toggleSplitTypeForDetailPage());
    }
  }
}
