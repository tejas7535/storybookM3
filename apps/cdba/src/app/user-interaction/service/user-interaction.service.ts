import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import {
  MatSnackBar,
  MatSnackBarRef,
  TextOnlySnackBar,
} from '@angular/material/snack-bar';

import { Observable } from 'rxjs';

import { TranslocoService } from '@jsverse/transloco';

import { API, BomExportStatusPath } from '@cdba/shared/constants/api';

import { BomExportStatus } from '../model/feature/bom-export';
import { Interaction } from '../model/interaction.model';
import { InteractionType } from '../model/interaction-type.enum';

@Injectable({ providedIn: 'root' })
export class UserInteractionService {
  snackBarRef: MatSnackBarRef<TextOnlySnackBar>;
  snackBarIsOpen = false;

  public constructor(
    private readonly snackbar: MatSnackBar,
    private readonly translocoService: TranslocoService,
    private readonly http: HttpClient
  ) {}

  /**
   * Opens a SnackBar with the message and action provided by the interactionType
   *
   * @param {InteractionType} interactionType - The type of interaction to handle
   */
  interact(interactionType: InteractionType): void {
    let interaction: Interaction;
    if (!this.snackBarIsOpen) {
      interaction = this.determineInteractionByType(interactionType);

      const message = this.translocoService.translate(`${interaction.message}`);
      let actionMessage = '';
      if (interaction.action) {
        actionMessage = this.translocoService.translate(
          `${interaction.action.message}`
        );
      }

      this.snackBarRef = this.snackbar.open(message, actionMessage);

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

  /**
   * Loads the initial BOM (Bill of Materials) export status.
   *
   * @returns An Observable that emits the current BOM export status.
   */
  loadInitialBomExportStatus(): Observable<BomExportStatus> {
    return this.http.get<BomExportStatus>(`${API.v1}/${BomExportStatusPath}`);
  }

  // Required due to the unserializable action exception from NgRx
  private determineInteractionByType(
    interactionType: InteractionType
  ): Interaction {
    let interaction: Interaction;
    switch (interactionType) {
      case InteractionType.HTTP_GENERAL_ERROR: {
        interaction = Interaction.HTTP_GENERAL_ERROR;
        break;
      }
      case InteractionType.HTTP_GENERAL_VALIDATION_ERROR: {
        interaction = Interaction.HTTP_GENERAL_VALIDATION_ERROR;
        break;
      }
      case InteractionType.REQUEST_BOM_EXPORT_SUCCESS: {
        interaction = Interaction.REQUEST_BOM_EXPORT_SUCCESS;
        break;
      }
      case InteractionType.REQUEST_BOM_EXPORT_FAILURE: {
        interaction = Interaction.REQUEST_BOM_EXPORT_FAILURE;
        break;
      }
      case InteractionType.TRACK_BOM_EXPORT_PROGRESS_COMPLETED: {
        interaction = Interaction.TRACK_BOM_EXPORT_PROGRESS_COMPLETED;
        break;
      }
      case InteractionType.TRACK_BOM_EXPORT_PROGRESS_FAILURE: {
        interaction = Interaction.TRACK_BOM_EXPORT_PROGRESS_FAILURE;
        break;
      }
      case InteractionType.REQUEST_BOM_EXPORT_VALIDATION_ERROR: {
        interaction = Interaction.REQUEST_BOM_EXPORT_VALIDATION_ERROR;
        break;
      }
      default: {
        throw new Error('Unhandled InteractionType');
      }
    }

    return interaction;
  }
}
