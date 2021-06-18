import {
  BreakpointObserver,
  Breakpoints,
  BreakpointState,
} from '@angular/cdk/layout';
import { Injectable } from '@angular/core';

import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

@Injectable({
  providedIn: 'root',
})
export class BreakpointService {
  public constructor(private readonly breakpointObserver: BreakpointObserver) {}

  /**
   * Returns an observable for mobile view
   */
  public isMobileViewPort(): Observable<boolean> {
    return this.breakpointObserver
      .observe(Breakpoints.XSmall)
      .pipe(map((state: BreakpointState) => state.matches));
  }

  /**
   * Returns an observable for handset view
   */
  public isHandset(): Observable<boolean> {
    return this.breakpointObserver
      .observe(Breakpoints.Handset)
      .pipe(map((state: BreakpointState) => state.matches));
  }

  public isLessThanMedium(): Observable<boolean> {
    return this.breakpointObserver
      .observe([Breakpoints.XSmall, Breakpoints.Small])
      .pipe(map((state: BreakpointState) => state.matches));
  }

  public isMedium(): Observable<boolean> {
    return this.breakpointObserver
      .observe(Breakpoints.Medium)
      .pipe(map((state: BreakpointState) => state.matches));
  }

  /**
   * Returns an observable for unsupportedViewPort
   */
  public unsupportedViewPort(): Observable<boolean> {
    return this.breakpointObserver
      .observe(Breakpoints.Small)
      .pipe(map((state: BreakpointState) => state.matches));
  }
  public isDesktop(): Observable<boolean> {
    return this.breakpointObserver
      .observe(Breakpoints.XLarge)
      .pipe(map((state: BreakpointState) => state.matches));
  }
}
