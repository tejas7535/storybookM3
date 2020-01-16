import {
  AfterViewInit,
  ChangeDetectionStrategy,
  Component,
  EventEmitter,
  HostBinding,
  Input,
  OnChanges,
  OnDestroy,
  OnInit,
  Output,
  SimpleChanges
} from '@angular/core';
import { fromEvent, merge, Subscription } from 'rxjs';
import {
  distinctUntilChanged,
  filter,
  map,
  mapTo,
  pairwise,
  share,
  throttleTime
} from 'rxjs/operators';

import { Direction } from './enums/direction.enum';
import { VisibilityState } from './enums/visibility-state.enum';
import { headerAnimations } from './header.animations';

import { BreakpointService } from '@schaeffler/shared/responsive';

@Component({
  selector: 'schaeffler-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss'],
  animations: headerAnimations,
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class HeaderComponent
  implements OnInit, AfterViewInit, OnChanges, OnDestroy {
  @HostBinding('@toggle') get toggleVisibility(): VisibilityState {
    return this.headerVisibility;
  }

  private headerVisibility: VisibilityState = VisibilityState.Visible;

  private readonly subscription: Subscription = new Subscription();

  @Input() sidebarMode: number;

  @Input() toggleEnabled = false;

  @Input() platformTitle: string;

  isMobileViewPort: boolean;

  @Output() readonly toggle: EventEmitter<void> = new EventEmitter();

  constructor(private readonly breakpointService: BreakpointService) {}

  /**
   * receives current viewPort
   */
  public ngOnInit(): void {
    this.subscription.add(
      this.breakpointService
        .isMobileViewPort()
        .subscribe(isMobile => (this.isMobileViewPort = isMobile))
    );
  }

  /**
   * angular change detection function
   * @param changes contains the received change object
   */
  public ngOnChanges(changes: SimpleChanges): void {
    if (changes.sidebarMode) {
      if (this.isMobileViewPort && changes.sidebarMode.currentValue === 2) {
        this.headerVisibility = VisibilityState.Visible;
      }
    }
  }

  /**
   * observes users srolling direction
   */
  public ngAfterViewInit(): void {
    this.observeScrollDirection();
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
    this.toggle.emit();
  }

  /**
   * Manipulates observable and subscribes to changes
   */
  private observeScrollDirection(): void {
    const scroll$ = fromEvent(window, 'scroll').pipe(
      throttleTime(10),
      map(() => window.pageYOffset),
      filter(pageYOffset => pageYOffset >= 15),
      pairwise(),
      map(([y1, y2]): Direction => (y2 < y1 ? Direction.Up : Direction.Down)),
      distinctUntilChanged(),
      share()
    );

    const goingUp$ = scroll$.pipe(
      filter(direction => direction === Direction.Up),
      mapTo(VisibilityState.Visible)
    );

    const goingDown$ = scroll$.pipe(
      filter(direction => direction === Direction.Down),
      mapTo(VisibilityState.Hidden)
    );

    this.subscription.add(
      merge(goingUp$, goingDown$).subscribe(visibilityState => {
        if (this.isMobileViewPort) {
          this.headerVisibility = visibilityState;
        }
      })
    );
  }
}
