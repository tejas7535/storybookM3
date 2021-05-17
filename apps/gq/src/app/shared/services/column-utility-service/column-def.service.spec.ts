import { createServiceFactory, SpectatorService } from '@ngneat/spectator';
import { provideMockStore } from '@ngrx/store/testing';

import { updateQuotationDetails } from '../../../core/store';
import { UpdateQuotationDetail } from '../../../core/store/reducers/process-case/models';
import { PriceSource } from '../../models/quotation-detail';
import { ColumnDefService } from './column-def.service';

jest.mock('@ngneat/transloco', () => ({
  ...jest.requireActual('@ngneat/transloco'),
  translate: jest.fn(() => 'translate it'),
}));
describe('ColumnDefService', () => {
  let service: ColumnDefService;
  let spectator: SpectatorService<ColumnDefService>;

  const createService = createServiceFactory({
    service: ColumnDefService,
    providers: [provideMockStore({})],
  });

  beforeEach(() => {
    spectator = createService();
    service = spectator.service;
  });

  test('should be created', () => {
    expect(service).toBeTruthy();
  });
  describe('selectManualPrice', () => {
    beforeEach(() => {
      service['store'].dispatch = jest.fn();
    });
    test('should dispatch action', () => {
      const price = 10;
      const gqPositionId = '20';
      const updateQuotationDetailList: UpdateQuotationDetail[] = [
        {
          price: 10,
          gqPositionId,
          priceSource: PriceSource.MANUAL,
        },
      ];

      service.selectManualPrice(price, gqPositionId, 1);

      expect(service['store'].dispatch).toHaveBeenCalledWith(
        updateQuotationDetails({ updateQuotationDetailList })
      );
    });
  });
});
