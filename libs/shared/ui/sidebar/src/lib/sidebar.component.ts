import { Component, Input, OnDestroy, OnInit } from '@angular/core';

import { Subscription } from 'rxjs';

import { select, Store } from '@ngrx/store';

import { BreakpointService } from '@schaeffler/responsive';

import {
  contentAnimation,
  sidebarAnimation,
} from './animations/sidebar-animations';
import { SidebarAnimationStyle, SidebarMode } from './models';
import { SidebarState } from './store/reducers/sidebar.reducer';
import { getSidebarMode } from './store/selectors/sidebar.selectors';

@Component({
  selector: 'schaeffler-sidebar',
  templateUrl: './sidebar.component.html',
  styleUrls: ['./sidebar.component.scss'],
  animations: [sidebarAnimation, contentAnimation],
})
export class SidebarComponent implements OnInit, OnDestroy {
  private readonly subscriptions: Subscription = new Subscription();

  @Input() width = 260;

  public mode: SidebarMode;

  public isMobileViewPort: boolean;

  constructor(
    private readonly breakpointService: BreakpointService,
    private readonly store: Store<SidebarState>
  ) {}

  /**
   * receives view from breakpoint service
   *
   */
  public ngOnInit(): void {
    this.subscriptions.add(
      this.breakpointService
        .isMobileViewPort()
        .subscribe((isMobile) => (this.isMobileViewPort = isMobile))
    );

    this.subscriptions.add(
      this.store
        .pipe(select(getSidebarMode))
        .subscribe((mode) => (this.mode = mode))
    );
  }

  /**
   * unsubscribes from open subscriptions
   */
  public ngOnDestroy(): void {
    this.subscriptions.unsubscribe();
  }

  /**
   * Animates the sidebar-nav
   */
  public get sidebarAnimation(): SidebarAnimationStyle {
    const value = this.mode === 1 ? 'minify' : 'open';
    const width = this.isMobileViewPort ? '100%' : `${this.width}px`;

    return { value, params: { width } };
  }

  /**
   * Animates the sidebar-content
   */
  public get contentAnimation(): SidebarAnimationStyle {
    if (this.mode === 1) {
      return { value: 'minify' };
    }

    return { value: 'open', params: { margin_left: `${this.width}px` } };
  }

  /**
   * Helps Angular to track array
   */
  public trackByFn(index: number): number {
    return index;
  }
}
