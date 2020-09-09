import {
  ChangeDetectionStrategy,
  Component,
  EventEmitter,
  OnInit,
  Output,
} from '@angular/core';

import { Observable } from 'rxjs';

import { select, Store } from '@ngrx/store';

import {
  getBomErrorMessage,
  getBomLoading,
  getCalculations,
  getCalculationsErrorMessage,
  getCalculationsLoading,
  getChildrenOfSelectedBomItem,
  getSelectedNodeId,
  selectCalculation,
} from '../../../core/store';
import { DetailState } from '../../../core/store/reducers/detail/detail.reducer';
import { BomItem } from '../../../core/store/reducers/detail/models';
import { Calculation } from '../../../core/store/reducers/shared/models';

@Component({
  selector: 'cdba-additional-information',
  templateUrl: './additional-information.component.html',
  styleUrls: ['./additional-information.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AdditionalInformationComponent implements OnInit {
  // Calculation Variables
  calculations$: Observable<Calculation[]>;
  selectedCalculationNodeId$: Observable<string>;
  calculationsLoading$: Observable<boolean>;
  calculationsErrorMessage$: Observable<string>;

  // Bom Variables
  bomLoading$: Observable<boolean>;
  bomErrorMessage$: Observable<string>;
  childrenOfSelectedBomItem$: Observable<BomItem[]>;

  @Output() private readonly closeOverlay: EventEmitter<
    void
  > = new EventEmitter();

  public constructor(private readonly store: Store<DetailState>) {}

  ngOnInit(): void {
    this.calculations$ = this.store.pipe(select(getCalculations));
    this.selectedCalculationNodeId$ = this.store.pipe(
      select(getSelectedNodeId)
    );
    this.calculationsLoading$ = this.store.pipe(select(getCalculationsLoading));
    this.calculationsErrorMessage$ = this.store.pipe(
      select(getCalculationsErrorMessage)
    );

    this.bomLoading$ = this.store.pipe(select(getBomLoading));
    this.bomErrorMessage$ = this.store.pipe(select(getBomErrorMessage));
    this.childrenOfSelectedBomItem$ = this.store.pipe(
      select(getChildrenOfSelectedBomItem)
    );
  }

  public selectCalculation(event: {
    nodeId: string;
    calculation: Calculation;
  }): void {
    this.store.dispatch(selectCalculation(event));
  }

  public onClose(): void {
    this.closeOverlay.emit();
  }
}
