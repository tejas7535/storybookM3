import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { Router } from '@angular/router';

import { Observable } from 'rxjs';

import { Store } from '@ngrx/store';

import { AppRoutePath } from '@cdba/app-route-path.enum';
import {
  getSelectedCalculationNodeIds,
  getSelectedRefTypeNodeIds,
} from '@cdba/core/store';
import {
  COMPARE_ITEMS_MAX_COUNT,
  COMPARE_ITEMS_MIN_COUNT,
} from '@cdba/shared/constants/table';

@Component({
  selector: 'cdba-compare-button',
  templateUrl: './compare-button.component.html',
})
export class CompareButtonComponent implements OnInit {
  @Output()
  showCompareViewEvent = new EventEmitter<void>();

  selectedNodeIds$: Observable<string[]>;
  appRoutePath = AppRoutePath;
  minCount = COMPARE_ITEMS_MIN_COUNT;
  maxCount = COMPARE_ITEMS_MAX_COUNT;

  public constructor(
    private readonly router: Router,
    private readonly store: Store
  ) {}

  public ngOnInit(): void {
    this.selectedNodeIds$ = this.router.routerState.snapshot.url.includes(
      AppRoutePath.ResultsPath
    )
      ? this.store.select(getSelectedRefTypeNodeIds)
      : this.store.select(getSelectedCalculationNodeIds);
  }

  public agInit(): void {}

  public showCompareView(): void {
    this.showCompareViewEvent.emit();
  }
}
