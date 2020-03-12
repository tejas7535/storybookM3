import { Component, OnInit } from '@angular/core';

import { translate } from '@ngneat/transloco';
import { Store } from '@ngrx/store';
import {
  openBanner,
  SnackBarService,
  SpeedDialFabItem
} from '@schaeffler/shared/ui-components';

import { AppState } from '../core/store';

@Component({
  selector: 'schaeffler-home',
  templateUrl: './home.component.html',
  styles: [
    `
      button {
        margin: 10px;
      }
    `
  ]
})
export class HomeComponent implements OnInit {
  public speedDialFabOpen = false;
  public speedDialFabDisabled = true;

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
    private readonly snackBarService: SnackBarService,
    private readonly store: Store<AppState>
  ) {}

  ngOnInit(): void {
    this.openBanner();
  }

  /**
   * Opens Banner, should be triggered only once upon app start
   */
  public openBanner(): void {
    this.store.dispatch(
      openBanner({
        text: translate('banner.bannerText'),
        buttonText: translate('banner.buttonText'),
        icon: 'info',
        truncateSize: 120
      })
    );
  }

  public showSuccessToast(): void {
    this.snackBarService
      .showSuccessMessage('Yippi, the Snackbar works!', 'ok')
      .subscribe(); // we need to subscribe here, that the snackbar is dismissed on button click
  }

  public showInformationToast(): void {
    this.snackBarService.showInfoMessage('Some boring news for you.');
  }

  public showWarningToast(): void {
    this.snackBarService
      .showWarningMessage(
        "This is a extra long warning! Don't do this in production! This is a extra long warning! Don't do this in production! This is a extra long warning! Don't do this in production!",
        'Try again'
      )
      .subscribe(result => {
        if (result === 'action') {
          this.showSuccessToast();
        }
      });
  }

  public showErrorToast(): void {
    this.snackBarService.showErrorMessage('Ohoh, an error occured!');
  }

  public speedDialFabClicked(key: string): void {
    if (key === 'conversation' || key === 'cancel') {
      this.speedDialFabOpen = !this.speedDialFabOpen;
    }
  }
}
