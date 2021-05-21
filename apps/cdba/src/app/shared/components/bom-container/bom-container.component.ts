import {
  ChangeDetectionStrategy,
  Component,
  Input,
  OnInit,
} from '@angular/core';

import { Observable } from 'rxjs';

import { Store } from '@ngrx/store';

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

  materialDesignation$: Observable<string>;

  // Calculation Variables
  calculations$: Observable<Calculation[]>;
  selectedCalculationNodeId$: Observable<string[]>;
  selectedCalculation$: Observable<Calculation>;
  calculationsLoading$: Observable<boolean>;
  calculationsErrorMessage$: Observable<string>;

  // Bom Variables
  bomLoading$: Observable<boolean>;
  bomErrorMessage$: Observable<string>;
  childrenOfSelectedBomItem$: Observable<BomItem[]>;
  bomItems$: Observable<BomItem[]>;

  public constructor(private readonly store: Store) {}

  public ngOnInit(): void {
    if (this.index !== undefined) {
      this.initializeWithCompareSelectors();
    } else {
      this.initializeWithDetailSelectors();
    }
  }

  public selectCalculation(
    event: {
      nodeId: string;
      calculation: Calculation;
    }[]
  ): void {
    if (this.index !== undefined) {
      this.store.dispatch(
        fromCompare.selectCalculation({ ...event[0], index: this.index })
      );
    } else {
      this.store.dispatch(fromDetail.selectCalculation(event[0]));
    }
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

  private initializeWithCompareSelectors(): void {
    this.materialDesignation$ = this.store.select(
      fromCompare.getMaterialDesignation,
      this.index
    );

    this.calculations$ = this.store.select(
      fromCompare.getCalculations,
      this.index
    );
    this.selectedCalculationNodeId$ = this.store.select(
      fromCompare.getSelectedCalculationNodeId,
      this.index
    );
    this.selectedCalculation$ = this.store.select(
      fromCompare.getSelectedCalculation,
      this.index
    );
    this.calculationsLoading$ = this.store.select(
      fromCompare.getCalculationsLoading,
      this.index
    );
    this.calculationsErrorMessage$ = this.store.select(
      fromCompare.getCalculationsErrorMessage,
      this.index
    );

    this.bomItems$ = this.store.select(fromCompare.getBomItems, this.index);
    this.bomLoading$ = this.store.select(fromCompare.getBomLoading, this.index);
    this.bomErrorMessage$ = this.store.select(
      fromCompare.getBomErrorMessage,
      this.index
    );
    this.childrenOfSelectedBomItem$ = this.store.select(
      fromCompare.getChildrenOfSelectedBomItem,
      this.index
    );
  }

  private initializeWithDetailSelectors(): void {
    this.materialDesignation$ = this.store.select(
      fromDetail.getMaterialDesignation
    );

    this.calculations$ = this.store.select(fromDetail.getCalculations);
    this.selectedCalculationNodeId$ = this.store.select(
      fromDetail.getSelectedCalculationNodeId
    );
    this.selectedCalculation$ = this.store.select(
      fromDetail.getSelectedCalculation
    );
    this.calculationsLoading$ = this.store.select(
      fromDetail.getCalculationsLoading
    );
    this.calculationsErrorMessage$ = this.store.select(
      fromDetail.getCalculationsErrorMessage
    );

    this.bomItems$ = this.store.select(fromDetail.getBomItems);
    this.bomLoading$ = this.store.select(fromDetail.getBomLoading);
    this.bomErrorMessage$ = this.store.select(fromDetail.getBomErrorMessage);
    this.childrenOfSelectedBomItem$ = this.store.select(
      fromDetail.getChildrenOfSelectedBomItem
    );
  }
}
