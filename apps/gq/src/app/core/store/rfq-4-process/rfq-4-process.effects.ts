import { inject, Injectable } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';

import { catchError, filter, map, of, switchMap, tap } from 'rxjs';

import { Rfq4AttachmentsService } from '@gq/calculator/rfq-4-detail-view/service/rest/rfq-4-attachments.service';
import { ActiveDirectoryUser } from '@gq/shared/models';
import { Rfq4Status } from '@gq/shared/models/quotation-detail/cost';
import { MicrosoftGraphMapperService } from '@gq/shared/services/rest/microsoft-graph-mapper/microsoft-graph-mapper.service';
import { RfqProcessResponse } from '@gq/shared/services/rest/rfq4/models/rfq-process-response.interface';
import { Rfq4Service } from '@gq/shared/services/rest/rfq4/rfq-4.service';
import { translate } from '@jsverse/transloco';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { concatLatestFrom } from '@ngrx/operators';
import { Store } from '@ngrx/store';

import {
  getMailBodyString,
  getMailSubjectString,
  getSeperatedNamesOfMaintainers,
  mailFallback,
} from './consts/maintainer-mail.consts';
import { Rfq4ProcessActions } from './rfq-4-process.actions';
import { rfq4ProcessFeature } from './rfq-4-process.reducer';

@Injectable()
export class Rfq4ProcessEffects {
  private readonly actions = inject(Actions);
  private readonly store = inject(Store);
  private readonly rfq4Service = inject(Rfq4Service);
  private readonly rfq4AttachmentsService = inject(Rfq4AttachmentsService);
  private readonly msGraphMapperService = inject(MicrosoftGraphMapperService);
  private readonly snackBar = inject(MatSnackBar);

  getSapMaintainers$ = createEffect(() => {
    return this.actions.pipe(
      ofType(Rfq4ProcessActions.getSapMaintainerUserIds),
      switchMap((_action) => {
        return this.rfq4Service.getSapMaintainers().pipe(
          map((maintainers) =>
            Rfq4ProcessActions.getSapMaintainerUserIdsSuccess({
              maintainerUserIds: maintainers.supportContacts.map(
                (maintainer) => maintainer.userId
              ),
            })
          ),
          catchError((error) =>
            of(
              Rfq4ProcessActions.getSapMaintainerUserIdsError({
                error,
              })
            )
          )
        );
      })
    );
  });

  getFullNamesOfMaintainers$ = createEffect(() => {
    return this.actions.pipe(
      ofType(Rfq4ProcessActions.getSapMaintainerUserIdsSuccess),
      switchMap((action) => {
        return this.msGraphMapperService
          .getActiveDirectoryUserByMultipleUserIds(action.maintainerUserIds)
          .pipe(
            map((adUsers) =>
              Rfq4ProcessActions.getActiveDirectoryUserOfSapMaintainerUserIdsSuccess(
                {
                  maintainers: adUsers,
                }
              )
            ),
            catchError((error) =>
              of(
                Rfq4ProcessActions.getActiveDirectoryUserOfSapMaintainerUserIdsError(
                  {
                    error,
                  }
                )
              )
            )
          );
      })
    );
  });

  findCalculators$ = createEffect(() => {
    return this.actions.pipe(
      ofType(Rfq4ProcessActions.findCalculators),
      switchMap((action) => {
        return this.rfq4Service.findCalculators(action.gqPositionId).pipe(
          map((foundCalculators) =>
            Rfq4ProcessActions.findCalculatorsSuccess({
              gqPositionId: action.gqPositionId,
              foundCalculators,
            })
          ),
          catchError((error) =>
            of(
              Rfq4ProcessActions.findCalculatorsError({
                error,
                gqPositionId: action.gqPositionId,
              })
            )
          )
        );
      })
    );
  });

  sendRecalculateSqvRequest$ = createEffect(() => {
    return this.actions.pipe(
      ofType(Rfq4ProcessActions.sendRecalculateSqvRequest),
      switchMap((action) => {
        return this.rfq4Service
          .recalculateSqv(action.gqPositionId, action.message)
          .pipe(
            tap(() =>
              this.snackBar.open(
                translate('shared.snackBarMessages.sqvRecalculateRequestSend')
              )
            ),
            map((rfqProcessResponse: RfqProcessResponse) =>
              Rfq4ProcessActions.sendRecalculateSqvRequestSuccess({
                gqPositionId: action.gqPositionId,
                rfqProcessResponse,
              })
            ),
            catchError((error) =>
              of(Rfq4ProcessActions.sendRecalculateSqvRequestError({ error }))
            )
          );
      })
    );
  });

  sendRequestToMaintainCalculators$ = createEffect(
    () => {
      return this.actions.pipe(
        ofType(Rfq4ProcessActions.sendEmailRequestToMaintainCalculators),
        concatLatestFrom(() =>
          this.store.select(rfq4ProcessFeature.getValidMaintainers)
        ),
        tap(([action, maintainers]) => {
          const emailAddresses = getAddresses(maintainers);
          const subject = getMailSubjectString(action.quotationDetail);
          const body = getMailBodyString(
            getUsers(maintainers),
            action.quotationDetail
          );

          const mailtoLink = `mailto:${emailAddresses}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;

          window.open(mailtoLink, '_blank');
        })
      );
    },
    { dispatch: false }
  );

  sendReopenRecalculationRequest$ = createEffect(() => {
    return this.actions.pipe(
      ofType(Rfq4ProcessActions.sendReopenRecalculationRequest),
      switchMap((action) => {
        return this.rfq4Service.reopenRecalculation(action.gqPositionId).pipe(
          map((rfqProcessResponse: RfqProcessResponse) =>
            Rfq4ProcessActions.sendReopenRecalculationRequestSuccess({
              rfqProcessResponse,
              gqPositionId: action.gqPositionId,
            })
          ),
          catchError((error) =>
            of(
              Rfq4ProcessActions.sendReopenRecalculationRequestError({
                error,
              })
            )
          )
        );
      })
    );
  });

  sendCancelProcessRequest$ = createEffect(() => {
    return this.actions.pipe(
      ofType(Rfq4ProcessActions.sendCancelProcess),
      switchMap((action) => {
        return this.rfq4Service
          .cancelProcess(
            action.gqPositionId,
            action.reasonForCancellation,
            action.comment
          )
          .pipe(
            map((rfqProcessResponse: RfqProcessResponse) =>
              Rfq4ProcessActions.sendCancelProcessSuccess({
                gqPositionId: action.gqPositionId,
                rfqProcessResponse,
              })
            ),
            catchError((error) =>
              of(Rfq4ProcessActions.sendCancelProcessError({ error }))
            )
          );
      })
    );
  });

  getProcessHistoryData$ = createEffect(() => {
    return this.actions.pipe(
      ofType(Rfq4ProcessActions.getProcessHistory),
      switchMap((action) => {
        return this.rfq4Service.getProcessHistory(action.gqPositionId).pipe(
          map((processHistory) =>
            Rfq4ProcessActions.getProcessHistorySuccess({
              processHistory,
            })
          ),
          catchError((error) =>
            of(Rfq4ProcessActions.getProcessHistoryError({ error }))
          )
        );
      })
    );
  });

  triggerGetProcessAttachments$ = createEffect(() => {
    return this.actions.pipe(
      ofType(Rfq4ProcessActions.getProcessHistorySuccess),
      filter(
        (history) =>
          history.processHistory?.rfq4Status === Rfq4Status.CONFIRMED &&
          history.processHistory?.rfqId !== null
      ),
      switchMap((history) =>
        of(
          Rfq4ProcessActions.getProcessAttachments({
            rfqId: history.processHistory?.rfqId,
          })
        )
      )
    );
  });

  getProcessAttachments$ = createEffect(() => {
    return this.actions.pipe(
      ofType(Rfq4ProcessActions.getProcessAttachments),
      switchMap((action) => {
        return this.rfq4AttachmentsService
          .getCalculatorAttachments(action.rfqId)
          .pipe(
            map((attachments) =>
              Rfq4ProcessActions.getProcessAttachmentsSuccess({
                attachments,
              })
            ),
            catchError((error) =>
              of(Rfq4ProcessActions.getProcessAttachmentsError({ error }))
            )
          );
      })
    );
  });

  downloadAttachment$ = createEffect(() => {
    return this.actions.pipe(
      ofType(Rfq4ProcessActions.downloadAttachment),
      switchMap((action) => {
        return this.rfq4AttachmentsService
          .downloadCalculatorAttachment(action.attachment)
          .pipe(
            map((fileName: string) => {
              return Rfq4ProcessActions.downloadAttachmentSuccess({ fileName });
            }),
            catchError((error) =>
              of(
                Rfq4ProcessActions.downloadAttachmentFailure({
                  errorMessage: error,
                })
              )
            )
          );
      })
    );
  });
}
const getAddresses = (maintainers: ActiveDirectoryUser[]): string => {
  return maintainers.length === 0
    ? mailFallback
    : maintainers.map((maintainer) => maintainer.mail).join(',');
};

const getUsers = (maintainers: ActiveDirectoryUser[]): string => {
  const maintainerFormatted = maintainers.map(
    (m) => `${m.firstName} ${m.lastName}`
  );

  return getSeperatedNamesOfMaintainers(maintainerFormatted, 'and');
};
