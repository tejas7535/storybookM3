import { ColumnUtilityService } from '@gq/shared/ag-grid/services';
import { RecalculationReasons } from '@gq/shared/models/quotation-detail/cost/recalculation-reasons.enum';
import { translate } from '@jsverse/transloco';
import {
  createServiceFactory,
  mockProvider,
  SpectatorService,
} from '@ngneat/spectator/jest';
import { ValueGetterParams } from 'ag-grid-community';

import { ColumnDefinitionService } from './column-definition.service';

describe('columnDefinitionService for rfqItems Table', () => {
  let service: ColumnDefinitionService;
  let spectator: SpectatorService<ColumnDefinitionService>;

  const createService = createServiceFactory({
    service: ColumnDefinitionService,
    providers: [mockProvider(ColumnUtilityService)],
  });

  beforeEach(() => {
    spectator = createService();
    service = spectator.service;
  });
  test('should be created', () => {
    expect(service).toBeTruthy();
  });

  describe('utilities', () => {
    describe('getSqvStatusText', () => {
      test('shall return text for not_available', () => {
        const valueGetterParams = {
          data: {
            sqvCheck: {
              sqvCheckStatus: RecalculationReasons.NOT_AVAILABLE,
            },
          },
        } as ValueGetterParams;
        service.getSqvStatusText(valueGetterParams);
        expect(translate).toHaveBeenCalledWith(
          `shared.rfqItemsTable.issueToResolve.${RecalculationReasons.NOT_AVAILABLE.toLocaleLowerCase()}`
        );
      });
      test('shall return text for invalid', () => {
        const valueGetterParams = {
          data: {
            sqvCheck: {
              sqvCheckStatus: RecalculationReasons.INVALID,
              sqvValidityPeriod: 3,
            },
          },
        } as ValueGetterParams;
        service.getSqvStatusText(valueGetterParams);
        expect(translate).toHaveBeenCalledWith(
          `shared.rfqItemsTable.issueToResolve.${RecalculationReasons.INVALID.toLocaleLowerCase()}`,
          {
            months: 3,
          }
        );
      });
    });
  });
});
