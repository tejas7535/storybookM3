import { Component } from '@angular/core';

import { SnackBarService } from '@schaeffler/snackbar';

@Component({
  // tslint:disable-next-line: component-max-inline-declarations
  template: `<button (click)="showInformationToast()" mat-raised-button>
      Show Information Toast
    </button>
    <button (click)="showSuccessToast()" mat-raised-button color="primary">
      Show Success Toast
    </button>

    <button (click)="showWarningToast()" mat-raised-button color="accent">
      Show Warning Toast
    </button>
    <button (click)="showErrorToast()" mat-raised-button color="warn">
      Show Error Toast
    </button>`,
  styles: [
    `
      button {
        margin: 10px;
      }
    `,
  ],
})
export class SnackbarLauncherComponent {
  constructor(private readonly snackBarService: SnackBarService) {}

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
      .subscribe((result) => {
        if (result === 'action') {
          this.showSuccessToast();
        }
      });
  }

  public showErrorToast(): void {
    this.snackBarService.showErrorMessage('Ohoh, an error occured!');
  }
}
