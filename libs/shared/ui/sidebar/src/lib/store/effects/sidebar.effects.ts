import { Injectable } from '@angular/core';
import { ActivationEnd, Router } from '@angular/router';

import { filter, map, withLatestFrom } from 'rxjs/operators';

import { Actions, createEffect, ofType } from '@ngrx/effects';
import { select, Store } from '@ngrx/store';

import { SidebarMode, Viewport } from '../../models';
import { SidebarService } from '../../sidebar.service';
import { setSidebarMode, toggleSidebar } from '../actions/sidebar.actions';
import { SidebarState } from '../reducers/sidebar.reducer';
import { getSidebarMode } from '../selectors/sidebar.selectors';

/**
 * Effect class for all tagging related actions which trigger side effects
 */
@Injectable()
export class SidebarEffects {
  setSidebarState$ = createEffect(() =>
    this.sidebarService
      .getSidebarMode()
      .pipe(map((mode: SidebarMode) => setSidebarMode({ sidebarMode: mode })))
  );

  toggleSidebar$ = createEffect(() =>
    this.actions$.pipe(
      ofType(toggleSidebar.type),
      withLatestFrom(
        this.store.pipe(select(getSidebarMode)),
        this.sidebarService.getViewport()
      ),
      map(([_action, mode, viewport]) =>
        setSidebarMode({ sidebarMode: this.defineSidebarMode(mode, viewport) })
      )
    )
  );

  closeSidebar$ = createEffect(() =>
    this.router.events.pipe(
      filter((event) => event instanceof ActivationEnd),
      withLatestFrom(this.sidebarService.getViewport()),
      map(([_action, viewport]) =>
        viewport === Viewport.Small
          ? setSidebarMode({ sidebarMode: SidebarMode.Closed })
          : { type: 'NO_ACTION' }
      )
    )
  );

  defineSidebarMode = (
    currentMode: SidebarMode,
    viewport: Viewport
  ): SidebarMode => {
    switch (currentMode) {
      case SidebarMode.Closed: {
        return SidebarMode.Open;
      }
      case SidebarMode.Minified: {
        return SidebarMode.Open;
      }
      case SidebarMode.Open: {
        switch (viewport) {
          case Viewport.Small: {
            return SidebarMode.Closed;
          }
          case Viewport.Medium:
          case Viewport.Large: {
            return SidebarMode.Minified;
          }
          default: {
            return currentMode;
          }
        }
      }
      default: {
        return currentMode;
      }
    }
  };

  constructor(
    private readonly actions$: Actions,
    private readonly sidebarService: SidebarService,
    private readonly store: Store<SidebarState>,
    private readonly router: Router
  ) {}
}
