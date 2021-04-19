import {
  ChangeDetectionStrategy,
  Component,
  Input,
  OnInit,
} from '@angular/core';

import { Observable } from 'rxjs';

import { select, Store } from '@ngrx/store';

import * as fromCompare from '@cdba/compare/store';
import * as fromDetail from '@cdba/core/store';

import { BomItem, Calculation } from '../../models';

@Component({
  selector: 'cdba-bom-container',
  templateUrl: './bom-container.component.html',
  styleUrls: ['./bom-container.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class BomContainerComponent implements OnInit {
  @Input() index: number;

  // Calculation Variables
  calculations$: Observable<Calculation[]>;
  selectedCalculationNodeId$: Observable<string>;
  calculationsLoading$: Observable<boolean>;
  calculationsErrorMessage$: Observable<string>;

  // Bom Variables
  bomLoading$: Observable<boolean>;
  bomErrorMessage$: Observable<string>;
  childrenOfSelectedBomItem$: Observable<BomItem[]>;
  bomItems$: Observable<BomItem[]>;

  public constructor(
    private readonly store: Store<
      fromDetail.DetailState | fromCompare.CompareState
    >
  ) {}

  public ngOnInit(): void {
    if (this.index !== undefined) {
      this.initializeWithCompareSelectors();
    } else {
      this.initializeWithDetailSelectors();
    }
  }

  private initializeWithCompareSelectors(): void {
    this.calculations$ = this.store.pipe(
      select(fromCompare.getCalculations, this.index)
    );
    this.selectedCalculationNodeId$ = this.store.pipe(
      select(fromCompare.getSelectedCalculationNodeId, this.index)
    );
    this.calculationsLoading$ = this.store.pipe(
      select(fromCompare.getCalculationsLoading, this.index)
    );
    this.calculationsErrorMessage$ = this.store.pipe(
      select(fromCompare.getCalculationsErrorMessage, this.index)
    );

    this.bomItems$ = this.store.pipe(
      select(fromCompare.getBomItems, this.index)
    );
    this.bomLoading$ = this.store.pipe(
      select(fromCompare.getBomLoading, this.index)
    );
    this.bomErrorMessage$ = this.store.pipe(
      select(fromCompare.getBomErrorMessage, this.index)
    );
    this.childrenOfSelectedBomItem$ = this.store.pipe(
      select(fromCompare.getChildrenOfSelectedBomItem, this.index)
    );
  }

  private initializeWithDetailSelectors(): void {
    this.calculations$ = this.store.pipe(select(fromDetail.getCalculations));
    this.selectedCalculationNodeId$ = this.store.pipe(
      select(fromDetail.getSelectedNodeId)
    );
    this.calculationsLoading$ = this.store.pipe(
      select(fromDetail.getCalculationsLoading)
    );
    this.calculationsErrorMessage$ = this.store.pipe(
      select(fromDetail.getCalculationsErrorMessage)
    );

    this.bomItems$ = this.store.pipe(select(fromDetail.getBomItems));
    this.bomLoading$ = this.store.pipe(select(fromDetail.getBomLoading));
    this.bomErrorMessage$ = this.store.pipe(
      select(fromDetail.getBomErrorMessage)
    );
    this.childrenOfSelectedBomItem$ = this.store.pipe(
      select(fromDetail.getChildrenOfSelectedBomItem)
    );
  }

  public selectBomItem(item: BomItem): void {
    if (this.index !== undefined) {
      this.store.dispatch(
        fromCompare.selectBomItem({ item, index: this.index })
      );
    } else {
      this.store.dispatch(fromDetail.selectBomItem({ item }));
    }
  }

  public selectCalculation(event: {
    nodeId: string;
    calculation: Calculation;
  }): void {
    if (this.index !== undefined) {
      this.store.dispatch(
        fromCompare.selectCalculation({ ...event, index: this.index })
      );
    } else {
      this.store.dispatch(fromDetail.selectCalculation(event));
    }
  }
}
