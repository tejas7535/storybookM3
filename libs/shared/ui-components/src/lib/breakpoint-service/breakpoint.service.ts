import {
  BreakpointObserver,
  Breakpoints,
  BreakpointState
} from '@angular/cdk/layout';
import { Injectable } from '@angular/core';

import { Observable } from 'rxjs';
import { flatMap, map } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class BreakpointService {
  constructor(private readonly breakpointObserver: BreakpointObserver) {}

  /**
   * Returns an observable for mobile view
   */
  public isMobileViewPort(): Observable<boolean> {
    return this.breakpointObserver
      .observe(['(max-width: 599px)'])
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

  /**
   * Returns an observable for unsupportedViewPort
   */
  public unsupportedViewPort(): Observable<boolean> {
    const minState$ = this.breakpointObserver
      .observe(['(min-width: 600px)'])
      .pipe(map((state: BreakpointState) => state.matches));

    const maxState$ = this.breakpointObserver
      .observe(['(max-width: 959px)'])
      .pipe(map((state: BreakpointState) => state.matches));

    return minState$.pipe(
      flatMap(minState => maxState$.pipe(map(maxState => minState && maxState)))
    );
  }
}
