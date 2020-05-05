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

import { headerAnimations } from './header.animations';

@Component({
  selector: 'schaeffler-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss'],
  animations: headerAnimations,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class HeaderComponent implements OnInit, OnDestroy {
  private readonly subscription: Subscription = new Subscription();

  @Input() toggleEnabled = false;

  @Input() platformTitle: string;

  isMobileViewPort: boolean;

  @Output() readonly toggle: EventEmitter<void> = new EventEmitter();

  constructor(
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
        .subscribe((isMobile) => (this.isMobileViewPort = isMobile))
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
    this.store.dispatch({ type: '[Sidebar] Toggle Sidebar' });

    this.toggle.emit();
  }
}
