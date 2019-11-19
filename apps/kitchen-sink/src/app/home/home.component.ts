import { Component } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';
import {
  SnackBarComponent,
  SnackBarMessageType,
  SpeedDialFabItem
} from '@schaeffler/shared/ui-components';

@Component({
  selector: 'schaeffler-home',
  templateUrl: './home.component.html'
})
export class HomeComponent {
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

  constructor(private readonly snackBar: MatSnackBar) {}

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
