import { Injectable } from '@angular/core';
import {
  MatSnackBar,
  MatSnackBarRef,
  TextOnlySnackBar,
} from '@angular/material/snack-bar';

import { TranslocoService } from '@jsverse/transloco';

import { Interaction } from './interaction-type.model';

@Injectable({ providedIn: 'root' })
export class UserInteractionService {
  snackBarRef: MatSnackBarRef<TextOnlySnackBar>;
  snackBarIsOpen = false;

  public constructor(
    private readonly snackbar: MatSnackBar,
    private readonly translocoService: TranslocoService
  ) {}

  /**
   * Opens a SnackBar with the message and action provided by the interactionType
   *
   * @param interaction
   */
  interact(interaction: Interaction): void {
    if (!this.snackBarIsOpen) {
      const message = this.translocoService.translate(`${interaction.message}`);
      let actionMessage = '';
      if (interaction.action) {
        actionMessage = this.translocoService.translate(
          `${interaction.action.message}`
        );
      }

      this.snackBarRef = this.snackbar.open(message, actionMessage, {
        duration: 5000,
      });

      this.snackBarIsOpen = true;

      if (interaction.action && interaction.action.url !== '') {
        this.snackBarRef.onAction().subscribe(() => {
          window.open(interaction.action.url, '_blank').focus();
        });
      }

      this.snackBarRef.afterDismissed().subscribe(() => {
        this.snackBarIsOpen = false;
      });
    }
  }
}
