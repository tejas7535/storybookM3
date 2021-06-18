import {
  BreakpointObserver,
  Breakpoints,
  BreakpointState,
} from '@angular/cdk/layout';
import { Injectable } from '@angular/core';

import { merge, Observable } from 'rxjs';
import { filter, mapTo } from 'rxjs/operators';

import { SidebarMode, Viewport } from './models';

@Injectable({
  providedIn: 'root',
})
export class SidebarService {
  /*
   * Definition of Breakpoint States --> Basis for viewports and sidebarmodes
   */
  private readonly isSmall$: Observable<BreakpointState> =
    this.breakpointObserver.observe([Breakpoints.XSmall, Breakpoints.Small]);

  private readonly isMedium$: Observable<BreakpointState> =
    this.breakpointObserver.observe(Breakpoints.Medium);

  private readonly isLarge$: Observable<BreakpointState> =
    this.breakpointObserver.observe([Breakpoints.Large, Breakpoints.XLarge]);

  /*
   * Viewport Observables
   */
  private readonly smallViewport$: Observable<Viewport> = this.isSmall$.pipe(
    filter((state: BreakpointState) => state.matches),
    mapTo(Viewport.Small)
  );

  private readonly mediumViewport$: Observable<Viewport> = this.isMedium$.pipe(
    filter((state: BreakpointState) => state.matches),
    mapTo(Viewport.Medium)
  );

  private readonly largeViewport$: Observable<Viewport> = this.isLarge$.pipe(
    filter((state: BreakpointState) => state.matches),
    mapTo(Viewport.Large)
  );

  /*
   * SidebarMode Observables
   */
  private readonly closed$: Observable<SidebarMode> = this.isSmall$.pipe(
    filter((state: BreakpointState) => state.matches),
    mapTo(SidebarMode.Closed)
  );

  private readonly minified$: Observable<SidebarMode> = this.isMedium$.pipe(
    filter((state: BreakpointState) => state.matches),
    mapTo(SidebarMode.Minified)
  );

  private readonly opened$: Observable<SidebarMode> = this.isLarge$.pipe(
    filter((state: BreakpointState) => state.matches),
    mapTo(SidebarMode.Open)
  );

  public constructor(private readonly breakpointObserver: BreakpointObserver) {}

  /**
   * Returns sidebar mode as observable based on current breakpoint
   */
  public getSidebarMode(): Observable<SidebarMode> {
    return merge(this.closed$, this.minified$, this.opened$);
  }

  /**
   * Returns viewport as observable based on current breakpoint
   */
  public getViewport(): Observable<Viewport> {
    return merge(
      this.smallViewport$,
      this.mediumViewport$,
      this.largeViewport$
    );
  }
}
