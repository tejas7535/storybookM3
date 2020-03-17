import { merge, Observable } from 'rxjs';
import { filter, mapTo } from 'rxjs/operators';

import {
  BreakpointObserver,
  Breakpoints,
  BreakpointState
} from '@angular/cdk/layout';
import { Injectable } from '@angular/core';

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
    this.closed$ = this.breakpointObserver
      .observe([Breakpoints.XSmall, Breakpoints.Small])
      .pipe(
        filter((state: BreakpointState) => state.matches),
        mapTo(SidebarMode.Closed)
      );

    this.opened$ = this.breakpointObserver
      .observe([Breakpoints.Large, Breakpoints.XLarge])
      .pipe(
        filter((state: BreakpointState) => state.matches),
        mapTo(SidebarMode.Open)
      );

    this.minified$ = this.breakpointObserver.observe(Breakpoints.Medium).pipe(
      filter((state: BreakpointState) => state.matches),
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
