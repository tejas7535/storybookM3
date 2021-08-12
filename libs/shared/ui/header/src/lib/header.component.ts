import {
  ChangeDetectionStrategy,
  Component,
  EventEmitter,
  Input,
  OnDestroy,
  OnInit,
  Output,
} from '@angular/core';

import { Subscription } from 'rxjs';

import { Store } from '@ngrx/store';

import { BreakpointService } from '@schaeffler/responsive';
import { toggleSidebar } from '@schaeffler/sidebar';

import { headerAnimations } from './header.animations';

@Component({
  selector: 'schaeffler-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss'],
  animations: headerAnimations,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class HeaderComponent implements OnInit, OnDestroy {
  @Input() public toggleEnabled = false;
  @Input() public platformTitle: string;
  @Input() public link?: string;
  @Input() public logo?: string;

  @Output() public readonly toggle: EventEmitter<void> = new EventEmitter();

  public isMobileViewPort: boolean;

  private readonly subscription: Subscription = new Subscription();

  public constructor(
    private readonly breakpointService: BreakpointService,
    private readonly store: Store
  ) {}

  /**
   * receives current viewPort
   */
  public ngOnInit(): void {
    this.subscription.add(
      this.breakpointService
        .isMobileViewPort()
        .subscribe((isMobile: boolean) => (this.isMobileViewPort = isMobile))
    );
  }

  /**
   * unsubscribes from open subscriptions
   */
  public ngOnDestroy(): void {
    this.subscription.unsubscribe();
  }

  /**
   * Emits toggle in application after burgermenu click
   */
  public toggleClicked(): void {
    this.store.dispatch(toggleSidebar());

    this.toggle.emit();
  }
}
