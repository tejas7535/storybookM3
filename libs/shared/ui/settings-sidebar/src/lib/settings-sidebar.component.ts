import {
  Component,
  EventEmitter,
  Input,
  OnDestroy,
  OnInit,
  Output,
} from '@angular/core';

import { Subscription } from 'rxjs';

import { Icon } from '@schaeffler/icons';
import { BreakpointService } from '@schaeffler/responsive';

@Component({
  selector: 'schaeffler-settings-sidebar',
  templateUrl: './settings-sidebar.component.html',
  styleUrls: ['./settings-sidebar.component.scss'],
})
export class SettingsSidebarComponent implements OnInit, OnDestroy {
  private readonly subscriptions: Subscription = new Subscription();

  public isMobileViewPort: boolean;
  public isLessThanMedium: boolean;

  @Input() public open = true;
  @Input() public openSidebarBtn = false;
  @Input() public closeSidebarBtn = false;
  @Input() public width = '400px';
  @Input() public triggerBtnIcon: Icon = new Icon('icon-filter');

  @Output()
  private readonly openedChange: EventEmitter<boolean> = new EventEmitter();

  constructor(private readonly breakpointService: BreakpointService) {}

  public ngOnInit(): void {
    this.subscriptions.add(
      this.breakpointService
        .isMobileViewPort()
        .subscribe((isMobile) => (this.isMobileViewPort = isMobile))
    );
    this.subscriptions.add(
      this.breakpointService
        .isLessThanMedium()
        .subscribe(
          (isLessThanMedium) => (this.isLessThanMedium = isLessThanMedium)
        )
    );
  }

  /**
   * unsubscribes from open subscriptions
   */
  public ngOnDestroy(): void {
    this.subscriptions.unsubscribe();
  }

  public onChangeState(open: boolean): void {
    this.openedChange.emit(open);
  }
}
