import { Component } from '@angular/core';

import { Observable } from 'rxjs';

import { Store } from '@ngrx/store';
import { IStatusPanelParams } from 'ag-grid-enterprise';

import {
  getCostComponentSplitItems as getCostComponentSplitItemsDetail,
  getSelectedSplitType as getSelectedSplitTypeDetail,
  toggleSplitType as toggleSplitTypeForDetailPage,
} from '@cdba/core/store';
import {
  CostComponentSplit,
  CostComponentSplitType,
} from '@cdba/shared/models';

import { toggleSplitType as toggleSplitTypeForComparePage } from '../../../../../compare/store/actions';
import {
  getCostComponentSplitItems as getCostComponentSplitItemsCompare,
  getSelectedSplitType as getSelectedSplitTypeCompare,
} from '../../../../../compare/store/selectors';

@Component({
  selector: 'cdba-cost-elements-status-bar',
  templateUrl: './cost-elements-status-bar.component.html',
  standalone: false,
})
export class CostElementsStatusBarComponent {
  public currentSplitType$: Observable<CostComponentSplitType>;
  public costElements$: Observable<CostComponentSplit[]>;

  private index: number;

  constructor(private readonly store: Store) {}

  public agInit(params: IStatusPanelParams): void {
    this.index = params.context.index;

    if (this.index === undefined) {
      this.currentSplitType$ = this.store.select(getSelectedSplitTypeDetail);
      this.costElements$ = this.store.select(getCostComponentSplitItemsDetail);
    } else {
      this.currentSplitType$ = this.store.select(
        getSelectedSplitTypeCompare(this.index)
      );
      this.costElements$ = this.store.select(
        getCostComponentSplitItemsCompare(this.index)
      );
    }
  }

  public toggleSelectedSplitType(): void {
    if (this.index === undefined) {
      this.store.dispatch(toggleSplitTypeForDetailPage());
    } else {
      this.store.dispatch(toggleSplitTypeForComparePage());
    }
  }
}
