import { QuotationAttachment } from '@gq/shared/models';
import { createServiceFactory, SpectatorService } from '@ngneat/spectator/jest';
import { Actions } from '@ngrx/effects';
import { provideMockActions } from '@ngrx/effects/testing';
import { MockStore, provideMockStore } from '@ngrx/store/testing';
import { marbles } from 'rxjs-marbles';

import { ActiveCaseActions } from './active-case.action';
import { ActiveCaseFacade } from './active-case.facade';
import { activeCaseFeature } from './active-case.reducer';
import {
  getQuotationDetailIsFNumber,
  getQuotationHasFNumberMaterials,
} from './active-case.selectors';

describe('ActiveCaseFacade', () => {
  let facade: ActiveCaseFacade;
  let spectator: SpectatorService<ActiveCaseFacade>;
  let mockStore: MockStore;
  let actions$: Actions;

  const createService = createServiceFactory({
    service: ActiveCaseFacade,
    providers: [provideMockStore({}), provideMockActions(() => actions$)],
  });

  beforeEach(() => {
    spectator = createService();
    facade = spectator.service;
    mockStore = spectator.inject(MockStore);
    actions$ = spectator.inject(Actions);
  });

  test('should be created', () => {
    expect(facade).toBeTruthy();
  });

  describe('costsUpdating$', () => {
    test(
      'should select update costs loading',
      marbles((m) => {
        mockStore.overrideSelector(
          activeCaseFeature.selectUpdateCostsLoading,
          true
        );
        m.expect(facade.costsUpdating$).toBeObservable(
          m.cold('a', { a: true })
        );
      })
    );
  });

  describe('updateCostsSuccess$', () => {
    test(
      'should dispatch update costs success',
      marbles((m) => {
        const action = ActiveCaseActions.updateCostsSuccess({} as any);
        const expected = m.cold('b', {
          b: action,
        });

        actions$ = m.hot('a', { a: action });

        m.expect(facade.updateCostsSuccess$).toBeObservable(expected as any);
      })
    );
  });

  describe('attachmentsUploading$', () => {
    test(
      'should select attachments uploading',
      marbles((m) => {
        mockStore.overrideSelector(
          activeCaseFeature.selectAttachmentsUploading,
          true
        );
        m.expect(facade.attachmentsUploading$).toBeObservable(
          m.cold('a', { a: true })
        );
      })
    );
  });

  describe('uploadAttachmentsSuccess$', () => {
    test(
      'should dispatch upload attachments success',
      marbles((m) => {
        const attachments: QuotationAttachment[] = [];
        const action = ActiveCaseActions.uploadAttachmentsSuccess({
          attachments,
        });
        const expected = m.cold('b', {
          b: action,
        });

        actions$ = m.hot('a', { a: action });

        m.expect(facade.uploadAttachmentsSuccess$).toBeObservable(
          expected as any
        );
      })
    );
  });

  describe('quotationAttachments$', () => {
    test('should select quotation attachments', () => {
      const attachments: QuotationAttachment[] = [
        { filename: 'test' } as unknown as QuotationAttachment,
      ];
      mockStore.overrideSelector(
        activeCaseFeature.selectAttachments,
        attachments
      );

      facade.quotationAttachments$.subscribe((result) => {
        expect(result).toBe(attachments);
      });
    });
  });

  describe('attachmentsGetting$', () => {
    test(
      'should select attachments getting',
      marbles((m) => {
        mockStore.overrideSelector(
          activeCaseFeature.selectAttachmentsGetting,
          true
        );
        m.expect(facade.attachmentsGetting$).toBeObservable(
          m.cold('a', { a: true })
        );
      })
    );
  });

  describe('attachmentsGettingSuccess$', () => {
    test(
      'should dispatch get all attachments success',
      marbles((m) => {
        const attachments: QuotationAttachment[] = [];
        const action = ActiveCaseActions.getAllAttachmentsSuccess({
          attachments,
        });
        const expected = m.cold('b', {
          b: action,
        });

        actions$ = m.hot('a', { a: action });

        m.expect(facade.attachmentsGettingSuccess$).toBeObservable(
          expected as any
        );
      })
    );
  });

  describe('quotationHasFNumberMaterials$', () => {
    test(
      'should select quotationHasF-numbers',
      marbles((m) => {
        mockStore.overrideSelector(getQuotationHasFNumberMaterials, true);
        m.expect(facade.quotationHasFNumberMaterials$).toBeObservable(
          m.cold('a', { a: true })
        );
      })
    );
  });

  describe('quotationDetailIsFNumber$', () => {
    test(
      'should getQuotationDetailIsFNumber',
      marbles((m) => {
        mockStore.overrideSelector(getQuotationDetailIsFNumber, true);
        m.expect(facade.quotationDetailIsFNumber$).toBeObservable(
          m.cold('a', { a: true })
        );
      })
    );
  });
  // ############################# methods testing ##############################
  describe('updateCosts', () => {
    test('should dispatch update costs', () => {
      const gqPosId = '123';
      const action = ActiveCaseActions.updateCosts({ gqPosId });
      const spy = jest.spyOn(mockStore, 'dispatch');

      facade.updateCosts(gqPosId);

      expect(spy).toHaveBeenCalledWith(action);
    });
  });

  describe('uploadAttachments', () => {
    test('should dispatch upload attachments', () => {
      const files = [new File([], 'file')];
      const action = ActiveCaseActions.uploadAttachments({ files });
      const spy = jest.spyOn(mockStore, 'dispatch');

      facade.uploadAttachments(files);

      expect(spy).toHaveBeenCalledWith(action);
    });
  });

  describe('getAllAttachments', () => {
    test('should dispatch get all attachments', () => {
      const action = ActiveCaseActions.getAllAttachments();
      const spy = jest.spyOn(mockStore, 'dispatch');

      facade.getAllAttachments();

      expect(spy).toHaveBeenCalledWith(action);
    });
  });

  describe('downloadAttachment', () => {
    test('should dispatch download attachment', () => {
      const attachment: QuotationAttachment = {
        gqId: 123,
        sapId: '456',
        folderName: 'folder',
        uploadedAt: '2020-01-01',
        uploadedBy: 'user',
        fileName: 'test.jpg',
      };
      const action = ActiveCaseActions.downloadAttachment({ attachment });
      const spy = jest.spyOn(mockStore, 'dispatch');

      facade.downloadAttachment(attachment);

      expect(spy).toHaveBeenCalledWith(action);
    });
  });
});
