import { Component, OnInit } from '@angular/core';

import { Observable } from 'rxjs';

import { Store } from '@ngrx/store';

import {
  getDrawings,
  getDrawingsError,
  getDrawingsLoading,
  getMaterialDesignation,
  getNodeIdOfSelectedDrawing,
  selectDrawing,
} from '@cdba/core/store';
import { Drawing } from '@cdba/shared/models';

@Component({
  selector: 'cdba-drawings',
  templateUrl: './drawings.component.html',
})
export class DrawingsComponent implements OnInit {
  materialDesignation$: Observable<string>;
  drawings$: Observable<Drawing[]>;
  selectedNodeId$: Observable<string>;
  loading$: Observable<boolean>;
  errorMessage$: Observable<string>;

  public constructor(private readonly store: Store) {}

  ngOnInit(): void {
    this.materialDesignation$ = this.store.select(getMaterialDesignation);
    this.drawings$ = this.store.select(getDrawings);
    this.selectedNodeId$ = this.store.select(getNodeIdOfSelectedDrawing);
    this.loading$ = this.store.select(getDrawingsLoading);
    this.errorMessage$ = this.store.select(getDrawingsError);
  }

  public selectDrawing(event: { nodeId: string; drawing: Drawing }): void {
    this.store.dispatch(selectDrawing(event));
  }
}
