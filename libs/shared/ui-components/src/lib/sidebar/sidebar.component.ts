import { Subscription } from 'rxjs';

import {
  ChangeDetectionStrategy,
  Component,
  EventEmitter,
  Input,
  OnDestroy,
  OnInit,
  Output
} from '@angular/core';

import { BreakpointService } from '@schaeffler/shared/responsive';

import { SidebarMode } from './sidebar-mode.enum';

import { SidebarAnimationStyle } from './sidebar-animation-style';
import { contentAnimation, sidebarAnimation } from './sidebar-animations';
import { SidebarElement } from './sidebar-element';

@Component({
  selector: 'schaeffler-sidebar',
  templateUrl: './sidebar.component.html',
  styleUrls: ['./sidebar.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  animations: [sidebarAnimation, contentAnimation]
})
export class SidebarComponent implements OnInit, OnDestroy {
  private readonly subscriptions: Subscription = new Subscription();

  @Input() width = 260;

  @Input() mode: SidebarMode;

  @Input() elements: SidebarElement[];

  public isMobileViewPort: boolean;

  @Output() public readonly toggle: EventEmitter<void> = new EventEmitter();

  constructor(private readonly breakpointService: BreakpointService) {}

  /**
   * receives view from breakpoint service
   *
   */
  public ngOnInit(): void {
    this.subscriptions.add(
      this.breakpointService
        .isMobileViewPort()
        .subscribe(isMobile => (this.isMobileViewPort = isMobile))
    );
  }

  /**
   * unsubscribes from open subscriptions
   */
  public ngOnDestroy(): void {
    this.subscriptions.unsubscribe();
  }

  /**
   * Opens or close menu if swipeMode is activate
   */
  public toggleSidebar(): void {
    if (this.isMobileViewPort) {
      this.toggle.emit();
    }
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
  public trackByFn(index): number {
    return index;
  }
}
