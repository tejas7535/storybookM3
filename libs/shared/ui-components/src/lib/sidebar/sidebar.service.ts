import { BreakpointObserver, BreakpointState } from '@angular/cdk/layout';
import { Injectable } from '@angular/core';

import { merge, Observable } from 'rxjs';
import {
  distinctUntilChanged,
  filter,
  flatMap,
  map,
  mapTo
} from 'rxjs/operators';

import { SidebarMode } from './sidebar-mode.enum';

@Injectable({
  providedIn: 'root'
})
export class SidebarService {
  /**
   * Observer for openState
   */
  private readonly closed$: Observable<SidebarMode>;

  /**
   * Observer for minifiedState
   */
  private readonly minified$: Observable<SidebarMode>;

  /**
   * Observer for openState
   */
  private readonly opened$: Observable<SidebarMode>;

  /**
   * Observer for mergedStates
   */
  private readonly sidebarObserver$: Observable<SidebarMode>;

  constructor(private readonly breakpointObserver: BreakpointObserver) {
    this.closed$ = this.breakpointObserver.observe(['(min-width: 960px)']).pipe(
      filter((state: BreakpointState) => !state.matches),
      mapTo(SidebarMode.Closed)
    );

    this.opened$ = this.breakpointObserver
      .observe(['(min-width: 1280px)'])
      .pipe(
        filter((state: BreakpointState) => state.matches),
        mapTo(SidebarMode.Open)
      );

    const minifiedStart$: Observable<boolean> = this.breakpointObserver
      .observe(['(min-width: 960px)'])
      .pipe(map(state => state.matches));

    const minifiedEnd$: Observable<boolean> = this.breakpointObserver
      .observe(['(max-width: 1279px)'])
      .pipe(map(state => state.matches));

    this.minified$ = minifiedStart$.pipe(
      flatMap(start => minifiedEnd$.pipe(map(end => start && end))),
      distinctUntilChanged(),
      filter(val => val),
      mapTo(SidebarMode.Minified)
    );

    this.sidebarObserver$ = merge(this.closed$, this.minified$, this.opened$);
  }

  /**
   * Returns the observer of current breakPointState
   */
  public getSidebarMode(): Observable<SidebarMode> {
    return this.sidebarObserver$;
  }
}
