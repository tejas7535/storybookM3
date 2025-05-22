import { TestBed } from '@angular/core/testing';

import { of } from 'rxjs';

import { ActiveDirectoryUser } from '@gq/shared/models';
import { MicrosoftGraphMapperService } from '@gq/shared/services/rest/microsoft-graph-mapper/microsoft-graph-mapper.service';
import { patchState } from '@ngrx/signals';
import { unprotected } from '@ngrx/signals/testing';
import { provideMockStore } from '@ngrx/store/testing';

import {
  CALCULATOR_QUOTATION_DATA_MOCK,
  CALCULATOR_QUOTATION_DETAIL_DATA_MOCK,
  CALCULATOR_RFQ_4_PROCESS_DATA_MOCK,
  RFQ_DETAIL_VIEW_DATA_MOCK,
} from '../../../../testing/mocks/models/calculator/rfq-4-detail-view/rfq-4-detail-view-data.mock';
import { Rfq4DetailViewService } from '../service/rest/rfq-4-detail-view.service';
import { Rfq4DetailViewStore } from './rfq-4-detail-view.store';

describe('Rfq4DetailViewStore', () => {
  const rfq4DetailViewService = {
    getRfq4DetailViewData: jest
      .fn()
      .mockReturnValue(of(RFQ_DETAIL_VIEW_DATA_MOCK)),
  };
  const aadUser: ActiveDirectoryUser = {
    firstName: 'firstName',
    lastName: 'lastName',
    userId: 'userId',
    mail: 'user@mail.com',
  };
  const microsoftGraphMapperService = {
    getActiveDirectoryUserByMultipleUserIds: jest
      .fn()
      .mockReturnValue(of([aadUser])),
  };

  const routerRfqId = '5012';
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        Rfq4DetailViewStore,
        provideMockStore({
          initialState: {
            router: {
              state: {
                queryParams: { rfqId: routerRfqId },
                params: {},
              },
            },
          },
        }),
        { provide: Rfq4DetailViewService, useValue: rfq4DetailViewService },
        {
          provide: MicrosoftGraphMapperService,
          useValue: microsoftGraphMapperService,
        },
      ],
    });
  });

  test('should create', () => {
    const store = TestBed.inject(Rfq4DetailViewStore);
    expect(store).toBeTruthy();
  });

  describe('computed', () => {
    test('getQuotationData', () => {
      const store = TestBed.inject(Rfq4DetailViewStore);

      patchState(unprotected(store), {
        rfq4DetailViewData: RFQ_DETAIL_VIEW_DATA_MOCK,
      });
      const quotation = store.getQuotationData();
      expect(quotation).toEqual(CALCULATOR_QUOTATION_DATA_MOCK);
    });
    test('getQuotationDetailData', () => {
      const store = TestBed.inject(Rfq4DetailViewStore);

      patchState(unprotected(store), {
        rfq4DetailViewData: RFQ_DETAIL_VIEW_DATA_MOCK,
      });
      const quotationDetail = store.getQuotationDetailData();
      expect(quotationDetail).toEqual(CALCULATOR_QUOTATION_DETAIL_DATA_MOCK);
    });
    test('getRfq4ProcessData', () => {
      const store = TestBed.inject(Rfq4DetailViewStore);

      patchState(unprotected(store), {
        rfq4DetailViewData: RFQ_DETAIL_VIEW_DATA_MOCK,
      });
      const rfq4ProcessData = store.getRfq4ProcessData();
      expect(rfq4ProcessData).toEqual(CALCULATOR_RFQ_4_PROCESS_DATA_MOCK);
    });
  });

  describe('methods', () => {
    test('loadRfq4DetailViewData', () => {
      const store = TestBed.inject(Rfq4DetailViewStore);
      const rfqId = '123';

      store.loadRfq4DetailViewData(rfqId);
      expect(rfq4DetailViewService.getRfq4DetailViewData).toHaveBeenCalledWith(
        rfqId
      );
      expect(store.loading()).toBeTruthy();
      expect(store.rfq4DetailViewData()).toEqual(RFQ_DETAIL_VIEW_DATA_MOCK);
    });
    test('loadAdUser', () => {
      const store = TestBed.inject(Rfq4DetailViewStore);
      const userId = 'userId';

      store.loadAdUser(userId);

      expect(
        microsoftGraphMapperService.getActiveDirectoryUserByMultipleUserIds
      ).toHaveBeenCalledWith([userId]);
      expect(store.loading()).toBeFalsy();
      expect(store.processStartedByAdUser()).toEqual(aadUser);
    });
  });

  describe('hooks', () => {
    test('onInit calls getRfqDetailViewData', () => {
      const store = TestBed.inject(Rfq4DetailViewStore);
      TestBed.flushEffects();
      // Verify the rxMethod was triggered with the correct argument
      expect(rfq4DetailViewService.getRfq4DetailViewData).toHaveBeenCalledWith(
        routerRfqId
      );
      expect(store.loading()).toBeFalsy();
    });
  });
});
