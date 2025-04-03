import { provideHttpClient } from '@angular/common/http';
import { provideHttpClientTesting } from '@angular/common/http/testing';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { RouterModule } from '@angular/router';

import { of, throwError } from 'rxjs';

import { SqvApprovalStatus } from '@gq/shared/models/quotation-detail/cost/sqv-approval-status.enum';
import { AttachmentsService } from '@gq/shared/services/rest/attachments/attachments.service';
import { Attachment } from '@gq/shared/services/rest/attachments/models/attachment.interface';
import { UploadRfqSqvCheckApprovalResponse } from '@gq/shared/services/rest/attachments/models/upload-rfq-sqv-approval-response.interface';
import { createServiceFactory, SpectatorService } from '@ngneat/spectator/jest';
import { Actions } from '@ngrx/effects';
import { provideMockActions } from '@ngrx/effects/testing';
import { MockStore, provideMockStore } from '@ngrx/store/testing';
import { marbles } from 'rxjs-marbles';

import { RfqSqvCheckAttachmentsActions } from './rfq-sqv-check-attachments.actions';
import { RfqSqvCheckAttachmentsEffects } from './rfq-sqv-check-attachments.effects';
import { rfqSqvCheckAttachmentsFeature } from './rfq-sqv-check-attachments.reducer';

describe('RfqSqvCheckAttachmentsEffects', () => {
  let spectator: SpectatorService<RfqSqvCheckAttachmentsEffects>;
  let action: any;
  let actions$: any;
  let effects: RfqSqvCheckAttachmentsEffects;
  let attachmentService: AttachmentsService;
  let snackBar: MatSnackBar;
  let store: any;
  const errorMessage = 'An error occured';

  const createService = createServiceFactory({
    service: RfqSqvCheckAttachmentsEffects,
    imports: [MatSnackBarModule, RouterModule.forRoot([])],
    providers: [
      provideMockActions(() => actions$),
      provideMockStore(),
      provideHttpClientTesting(),
      provideHttpClient(),
    ],
  });

  beforeEach(() => {
    spectator = createService();
    actions$ = spectator.inject(Actions);
    effects = spectator.inject(RfqSqvCheckAttachmentsEffects);

    attachmentService = spectator.inject(AttachmentsService);
    store = spectator.inject(MockStore);
    snackBar = spectator.inject(MatSnackBar);
  });

  describe('uploadAttachments$', () => {
    test(
      'should return uploadAttachmentsSuccess when REST call is successful',
      marbles((m) => {
        action = RfqSqvCheckAttachmentsActions.uploadAttachments({
          files: [new File([], 'test')],
        });
        const uploadResponse: UploadRfqSqvCheckApprovalResponse = {
          uploads: [{ fileName: '1' } as Attachment],
          status: {
            processVariables: {
              approvalStatus: SqvApprovalStatus.APPROVED,
              gqPositionId: '1245',
            },
          },
        };

        attachmentService.uploadRfqSqvCheckApproval = jest.fn(() => response);
        snackBar.open = jest.fn();
        store.overrideSelector(
          rfqSqvCheckAttachmentsFeature.selectGqPositionId,
          '1245'
        );

        const result = RfqSqvCheckAttachmentsActions.uploadAttachmentsSuccess({
          gqPositionId: '1245',
          newApprovalStatus: SqvApprovalStatus.APPROVED,
        });

        actions$ = m.hot('-a', { a: action });
        const response = m.cold('-a|', { a: uploadResponse });
        const expected = m.cold('--b', { b: result });

        m.expect(effects.uploadAttachments$).toBeObservable(expected);
        m.flush();
        expect(
          attachmentService.uploadRfqSqvCheckApproval
        ).toHaveBeenCalledTimes(1);
        expect(
          attachmentService.uploadRfqSqvCheckApproval
        ).toHaveBeenCalledWith([new File([], 'test')], '1245');
        expect(snackBar.open).toHaveBeenCalledTimes(1);
      })
    );
    test('should return uploadAttachmentsFailure on REST error', () => {
      action = RfqSqvCheckAttachmentsActions.uploadAttachments({
        files: [new File([], 'test')],
      });
      attachmentService.uploadRfqSqvCheckApproval = jest.fn(() => response);
      const result = RfqSqvCheckAttachmentsActions.uploadAttachmentsFailure({
        errorMessage,
      });

      actions$ = of(action);
      const response = throwError(() => errorMessage);

      effects.uploadAttachments$.subscribe((res) => {
        expect(res).toEqual(result);
      });
      expect(attachmentService.uploadRfqSqvCheckApproval).toHaveBeenCalledTimes(
        1
      );
    });
  });
  describe('downloadAttachments$', () => {
    test(
      'should return downloadAttachmentSuccess when REST call is successful',
      marbles((m) => {
        action = RfqSqvCheckAttachmentsActions.downloadAttachments(
          expect.anything()
        );

        global.URL.createObjectURL = jest.fn();

        const expectedAction =
          RfqSqvCheckAttachmentsActions.downloadAttachmentsSuccess({
            fileName: 'test.jpg',
          });

        const downloadAttachmentMock = jest.spyOn(
          attachmentService,
          'downloadRfqSqvCheckApprovalAttachments'
        );
        downloadAttachmentMock.mockReturnValue(of('test.jpg'));

        actions$ = m.hot('-a', { a: action });

        const result = effects.downloadAttachments$;

        m.expect(result).toBeObservable('-c', { c: expectedAction });
      })
    );

    test(
      'should dispatch downloadAttachmentFailure when REST call fails',
      marbles((m) => {
        action = RfqSqvCheckAttachmentsActions.downloadAttachments(
          expect.anything()
        );

        global.URL.createObjectURL = jest.fn();

        const expectedAction =
          RfqSqvCheckAttachmentsActions.downloadAttachmentsFailure({
            errorMessage,
          });

        const downloadAttachmentMock = jest.spyOn(
          attachmentService,
          'downloadRfqSqvCheckApprovalAttachments'
        );

        downloadAttachmentMock.mockReturnValue(throwError(() => errorMessage));

        actions$ = m.hot('-a', { a: action });

        const result = effects.downloadAttachments$;

        m.expect(result).toBeObservable('-c', { c: expectedAction });
      })
    );
  });
});
