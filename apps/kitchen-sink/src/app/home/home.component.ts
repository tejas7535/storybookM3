import { Component, OnDestroy, OnInit } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';
import { select, Store } from '@ngrx/store';
import {
  BannerTextComponent,
  getBannerOpen,
  openBanner,
  SnackBarComponent,
  SnackBarMessageType,
  SpeedDialFabItem
} from '@schaeffler/shared/ui-components';
import { Subject } from 'rxjs';
import { take, takeUntil } from 'rxjs/operators';

import { AppState } from '../core/store';
import { CustomBannerComponent } from '../shared/components/custom-banner/custom-banner.component';

@Component({
  selector: 'schaeffler-home',
  templateUrl: './home.component.html'
})
export class HomeComponent implements OnInit, OnDestroy {
  public speedDialFabOpen = false;
  public speedDialFabDisabled = true;

  private readonly destroy$: Subject<boolean> = new Subject();

  public speedDialFabPrimaryBtn: SpeedDialFabItem = {
    key: 'conversation',
    icon: 'bubbles',
    color: 'primary',
    label: true,
    title: 'new conversation'
  };

  public speedDialFabSecondaryBtns: SpeedDialFabItem[] = [
    {
      key: 'mail',
      icon: 'mail',
      color: 'accent',
      label: true,
      title: 'new mail'
    },
    {
      key: 'phone',
      icon: 'phone',
      color: 'accent',
      label: true,
      title: 'new call'
    }
  ];

  constructor(
    private readonly snackBar: MatSnackBar,
    private readonly store: Store<AppState>
  ) {}

  ngOnInit(): void {
    this.openBanner();

    this.store
      .pipe(
        takeUntil(this.destroy$),
        select(getBannerOpen)
      )
      .pipe(take(2))
      .subscribe(open => {
        if (!open) {
          this.openCustomBanner();
        }
      });
  }

  ngOnDestroy(): void {
    this.destroy$.next(true);
    this.destroy$.complete();
  }

  /**
   * Opens Banner, should be triggered only once upon app start
   */
  public openBanner(): void {
    this.store.dispatch(
      openBanner({
        component: BannerTextComponent,
        text: 'BANNER.BANNER_TEXT',
        buttonText: 'BANNER.BUTTON_TEXT',
        truncateSize: 120
      })
    );
  }

  /**
   * Opens custom banner, should be triggered only once when the default banner is closed
   */
  public openCustomBanner(): void {
    this.store.dispatch(
      openBanner({
        component: CustomBannerComponent,
        text: 'CUSTOM_BANNER.BANNER_TEXT',
        buttonText: 'CUSTOM_BANNER.BUTTON_TEXT',
        truncateSize: 0
      })
    );
  }

  openSnackbar(): void {
    const snackBarRef = this.snackBar.openFromComponent(SnackBarComponent, {
      panelClass: 'success-message',
      data: {
        message: `Yippi, the Snackbar works!`,
        type: SnackBarMessageType.SUCCESS
      }
    });
    snackBarRef.instance.snackBarRef = snackBarRef;
  }

  public speedDialFabClicked(key: string): void {
    console.log('Speed Dial FAB has been clicked:', key);
    if (key === 'conversation' || key === 'cancel') {
      this.speedDialFabOpen = !this.speedDialFabOpen;
    }
  }
}
