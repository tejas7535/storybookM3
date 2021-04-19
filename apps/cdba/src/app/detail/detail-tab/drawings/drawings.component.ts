import { Component, OnInit } from '@angular/core';

import { Observable } from 'rxjs';

import { select, Store } from '@ngrx/store';

import {
  getDrawings,
  getDrawingsErrorMessage,
  getDrawingsLoading,
  getNodeIdOfSelectedDrawing,
  selectDrawing,
} from '@cdba/core/store';
import { DetailState } from '@cdba/core/store/reducers/detail/detail.reducer';
import { Drawing } from '@cdba/shared/models';

@Component({
  selector: 'cdba-drawings',
  templateUrl: './drawings.component.html',
  styleUrls: ['./drawings.component.scss'],
})
export class DrawingsComponent implements OnInit {
  drawings$: Observable<Drawing[]>;
  selectedNodeId$: Observable<string>;
  loading$: Observable<boolean>;
  errorMessage$: Observable<string>;

  public constructor(private readonly store: Store<DetailState>) {}

  ngOnInit(): void {
    this.drawings$ = this.store.pipe(select(getDrawings));
    this.selectedNodeId$ = this.store.pipe(select(getNodeIdOfSelectedDrawing));
    this.loading$ = this.store.pipe(select(getDrawingsLoading));
    this.errorMessage$ = this.store.pipe(select(getDrawingsErrorMessage));
  }

  public selectDrawing(event: { nodeId: string; drawing: Drawing }): void {
    this.store.dispatch(selectDrawing(event));
  }
}
