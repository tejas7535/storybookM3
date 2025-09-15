import { SqvApprovalStatus } from '@gq/shared/models/quotation-detail/cost/sqv-approval-status.enum';
import { createServiceFactory, SpectatorService } from '@ngneat/spectator/jest';
import { Actions } from '@ngrx/effects';
import { provideMockActions } from '@ngrx/effects/testing';
import { MockStore, provideMockStore } from '@ngrx/store/testing';
import { marbles } from 'rxjs-marbles';

import { RfqSqvCheckAttachmentsActions } from './rfq-sqv-check-attachments.actions';
import { RfqSqvCheckAttachmentFacade } from './rfq-sqv-check-attachments.facade';
import { rfqSqvCheckAttachmentsFeature } from './rfq-sqv-check-attachments.reducer';

describe('RfqSqvCheckAttachmentsFacade', () => {
  let service: RfqSqvCheckAttachmentFacade;
  let spectator: SpectatorService<RfqSqvCheckAttachmentFacade>;
  let mockStore: MockStore;
  let actions$: Actions;

  const createService = createServiceFactory({
    service: RfqSqvCheckAttachmentFacade,
    providers: [provideMockStore({}), provideMockActions(() => actions$)],
  });

  beforeEach(() => {
    spectator = createService();
    service = spectator.service;
    mockStore = spectator.inject(MockStore);
    actions$ = spectator.inject(Actions);
  });

  describe('Observables', () => {
    test(
      'shouldProvideAttachmentsUploading$',
      marbles((m) => {
        const expected = m.cold('a', { a: false });
        mockStore.overrideSelector(
          rfqSqvCheckAttachmentsFeature.selectAttachmentsUploading,
          false
        );
        m.expect(service.attachmentsUploading$).toBeObservable(expected);
      })
    );

    test(
      'should dispatch upload attachments success',
      marbles((m) => {
        const action = RfqSqvCheckAttachmentsActions.uploadAttachmentsSuccess({
          gqPositionId: '1245',
          newApprovalStatus: SqvApprovalStatus.APPROVED,
        });
        const expected = m.cold('b', {
          b: action,
        });

        actions$ = m.hot('a', { a: action });

        m.expect(service.uploadAttachmentsSuccess$).toBeObservable(
          expected as any
        );
      })
    );

    test(
      'should provide attachmentsLoading$',
      marbles((m) => {
        const expected = m.cold('a', { a: false });
        mockStore.overrideSelector(
          rfqSqvCheckAttachmentsFeature.selectAttachmentsLoading,
          false
        );
        m.expect(service.attachmentsLoading$).toBeObservable(expected);
      })
    );

    test(
      'should provide attachments$',
      marbles((m) => {
        const expected = m.cold('a', { a: [] });
        mockStore.overrideSelector(
          rfqSqvCheckAttachmentsFeature.selectAttachments,
          []
        );
        m.expect(service.attachments$).toBeObservable(expected);
      })
    );
  });
  describe('Methods', () => {
    test('should dispatch uploadAttachments', () => {
      const files = [new File([''], 'filename')];
      const action = RfqSqvCheckAttachmentsActions.uploadAttachments({ files });
      const spy = jest.spyOn(mockStore, 'dispatch');
      service.uploadAttachments(files);
      expect(spy).toHaveBeenCalledWith(action);
    });

    test('should dispatch downloadAttachments', () => {
      const gqPositionId = '1234';
      const action = RfqSqvCheckAttachmentsActions.downloadAttachments({
        gqPositionId,
      });
      const spy = jest.spyOn(mockStore, 'dispatch');
      service.downloadAttachments(gqPositionId);
      expect(spy).toHaveBeenCalledWith(action);
    });
    test('should dispatch download attachments with file', () => {
      const gqPositionId = '1234';
      const file = { fileName: 'file1.txt' } as any;
      const action = RfqSqvCheckAttachmentsActions.downloadAttachments({
        gqPositionId,
        file,
      });
      const spy = jest.spyOn(mockStore, 'dispatch');
      service.downloadAttachments(gqPositionId, file);
      expect(spy).toHaveBeenCalledWith(action);
    });
  });
  test('should dispatch setGqPositionId', () => {
    const gqPositionId = '1234';
    const action = RfqSqvCheckAttachmentsActions.setGqPositionId({
      gqPositionId,
    });
    const spy = jest.spyOn(mockStore, 'dispatch');
    service.setGqPositionId(gqPositionId);
    expect(spy).toHaveBeenCalledWith(action);
  });

  test('should dispatch resetGqPositionId', () => {
    const action = RfqSqvCheckAttachmentsActions.resetGqPositionId();
    const spy = jest.spyOn(mockStore, 'dispatch');
    service.resetGqPositionId();
    expect(spy).toHaveBeenCalledWith(action);
  });

  test('updateAttachments should alert', () => {
    window.alert = jest.fn();
    const filesToUpload = [new File([''], 'filename')];
    const fileNamesToDelete = ['file1.txt'];
    service.updateAttachments(filesToUpload, fileNamesToDelete);
    expect(window.alert).toHaveBeenCalledWith(
      `'hello I update attachments', ${JSON.stringify(
        filesToUpload
      )}, ${JSON.stringify(fileNamesToDelete)}`
    );
  });

  test('should dispatch getAllAttachments', () => {
    const gqPositionId = '1234';
    const action = RfqSqvCheckAttachmentsActions.getAllAttachments({
      gqPositionId,
    });
    const spy = jest.spyOn(mockStore, 'dispatch');
    service.getAllAttachments(gqPositionId);
    expect(spy).toHaveBeenCalledWith(action);
  });
});
