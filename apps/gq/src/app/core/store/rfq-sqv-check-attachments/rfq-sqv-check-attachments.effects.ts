import { inject, Injectable } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';

import { catchError, map, mergeMap, of, switchMap, tap } from 'rxjs';

import { AttachmentsService } from '@gq/shared/services/rest/attachments/attachments.service';
import { PositionAttachment } from '@gq/shared/services/rest/attachments/models/position-attachment.interface';
import { translate } from '@jsverse/transloco';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { concatLatestFrom } from '@ngrx/operators';
import { Store } from '@ngrx/store';

import { RfqSqvCheckAttachmentsActions } from './rfq-sqv-check-attachments.actions';
import { rfqSqvCheckAttachmentsFeature } from './rfq-sqv-check-attachments.reducer';

@Injectable()
export class RfqSqvCheckAttachmentsEffects {
  private readonly actions = inject(Actions);
  private readonly attachmentService = inject(AttachmentsService);
  private readonly store = inject(Store);
  private readonly snackBar = inject(MatSnackBar);

  uploadAttachments$ = createEffect(() => {
    return this.actions.pipe(
      ofType(RfqSqvCheckAttachmentsActions.uploadAttachments),
      concatLatestFrom(() =>
        this.store.select(rfqSqvCheckAttachmentsFeature.selectGqPositionId)
      ),
      mergeMap(([{ files }, gqPositionId]) =>
        this.attachmentService
          .uploadRfqSqvCheckApproval(files, gqPositionId)
          .pipe(
            tap(() => {
              const successMessage = translate(
                'shared.snackBarMessages.attachmentsUploaded'
              );
              this.snackBar.open(successMessage);
            }),
            map(({ status }) =>
              RfqSqvCheckAttachmentsActions.uploadAttachmentsSuccess({
                gqPositionId: status.processVariables.gqPositionId,
                newApprovalStatus: status.processVariables.approvalStatus,
              })
            ),
            catchError((error) =>
              of(
                RfqSqvCheckAttachmentsActions.uploadAttachmentsFailure({
                  errorMessage: error,
                })
              )
            )
          )
      )
    );
  });

  downloadAttachments$ = createEffect(() => {
    return this.actions.pipe(
      ofType(RfqSqvCheckAttachmentsActions.downloadAttachments),
      switchMap((action) =>
        this.attachmentService
          .downloadRfqSqvCheckApprovalAttachments(
            action.gqPositionId,
            action.file
          )
          .pipe(
            map((fileName: string) => {
              return RfqSqvCheckAttachmentsActions.downloadAttachmentsSuccess({
                fileName,
              });
            }),
            catchError((error) =>
              of(
                RfqSqvCheckAttachmentsActions.downloadAttachmentsFailure({
                  errorMessage: error,
                })
              )
            )
          )
      )
    );
  });

  triggerGetAttachments$ = createEffect(() => {
    return this.actions.pipe(
      ofType(RfqSqvCheckAttachmentsActions.setGqPositionId),
      map((action) =>
        RfqSqvCheckAttachmentsActions.getAllAttachments({
          gqPositionId: action.gqPositionId,
        })
      )
    );
  });
  getAttachments$ = createEffect(() => {
    return this.actions.pipe(
      ofType(RfqSqvCheckAttachmentsActions.getAllAttachments),
      switchMap((action) =>
        this.attachmentService
          .getRfqSqvCheckApprovalAttachments(action.gqPositionId)
          .pipe(
            map((attachments: PositionAttachment[]) => {
              return RfqSqvCheckAttachmentsActions.getAllAttachmentsSuccess({
                attachments,
              });
            }),
            catchError((error) =>
              of(
                RfqSqvCheckAttachmentsActions.getAllAttachmentsFailure({
                  errorMessage: error,
                })
              )
            )
          )
      )
    );
  });
}
