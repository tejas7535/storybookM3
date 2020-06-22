import { Location } from '@angular/common';
import { Component, OnInit } from '@angular/core';

import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

import { select, Store } from '@ngrx/store';

import * as fromRouter from '../core/store/reducers';

@Component({
  selector: 'cdba-detail',
  templateUrl: './detail.component.html',
  styleUrls: ['./detail.component.scss'],
})
export class DetailComponent implements OnInit {
  public plant$: Observable<string>;
  public materialNumber$: Observable<string>;

  public constructor(
    private readonly store: Store<fromRouter.AppState>,
    private readonly location: Location
  ) {}

  ngOnInit(): void {
    this.materialNumber$ = this.store.pipe(
      select(fromRouter.getRouterState),
      map((routerState) => routerState.state),
      map((state) => state.queryParams.materialNumber)
    );
    this.plant$ = this.store.pipe(
      select(fromRouter.getRouterState),
      map((routerState) => routerState.state),
      map((state) => state.queryParams.plant)
    );
  }

  backToSearch(): void {
    this.location.back();
  }
}
