import { createServiceFactory, SpectatorService } from '@ngneat/spectator/jest';
import { GetContextMenuItemsParams } from 'ag-grid-enterprise';
import { MockProvider } from 'ng-mocks';

import { SearchByCasesOrMaterialsColumnFields } from '../../../ag-grid/constants/column-fields.enum';
import { ColumnUtilityService } from '../../../ag-grid/services/column-utility.service';
import { QuotationStatus } from '../../../models';
import { GridOptionsService } from './grid-options.service';

describe('GridOptionsService', () => {
  let service: GridOptionsService;
  let spectator: SpectatorService<GridOptionsService>;

  const createService = createServiceFactory({
    service: GridOptionsService,
    providers: [
      MockProvider(ColumnUtilityService, {
        getCopyCellContentContextMenuItem: jest
          .fn()
          .mockReturnValue('copyValue'),
      }),
    ],
  });
  beforeEach(() => {
    spectator = createService();
    service = spectator.service;
  });

  describe('should create', () => {
    test('should create', () => {
      expect(service).toBeTruthy();
    });
  });

  describe('getContextMenuItems', () => {
    test('should return link by gq colId', () => {
      ColumnUtilityService.getOpenInNewTabContextMenuItem = jest
        .fn()
        .mockReturnValue('value1');
      ColumnUtilityService.getOpenInNewWindowContextMenuItem = jest
        .fn()
        .mockReturnValue('value2');

      const params = {
        column: {
          getColId: () => SearchByCasesOrMaterialsColumnFields.GQ_ID,
        },
        value: 'value',
      };

      const result =
        service.DEFAULT_GRID_OPTIONS.getContextMenuItems &&
        service.DEFAULT_GRID_OPTIONS.getContextMenuItems(
          params as GetContextMenuItemsParams
        );

      expect(result).toEqual(['copyValue', 'value1', 'value2']);
    });

    test('should return link by node params', () => {
      ColumnUtilityService.getOpenInNewTabContextMenuItemByUrl = jest
        .fn()
        .mockReturnValue('value1');
      ColumnUtilityService.getOpenInNewWindowContextMenuItemByUrl = jest
        .fn()
        .mockReturnValue('value2');

      service.getUrlByColumnData = jest.fn().mockReturnValue('url');
      const params = {
        column: {
          getColId: () => 'not gq id',
        },
        node: {
          data: {},
        },
      };

      const result =
        service.DEFAULT_GRID_OPTIONS.getContextMenuItems &&
        service.DEFAULT_GRID_OPTIONS.getContextMenuItems(
          params as GetContextMenuItemsParams
        );

      expect(result).toEqual(['copyValue', 'value1', 'value2']);
      expect(service.getUrlByColumnData).toHaveBeenCalledTimes(1);
    });
  });

  describe('getUrlByColumnData', () => {
    test('should return url', () => {
      const params = {
        node: {
          data: {
            gqId: 'gqId',
            customerId: 'customerId',
            salesOrg: 'salesOrg',
            status: QuotationStatus.ACTIVE,
            enabledForApprovalWorkflow: true,
          },
        },
        context: {
          router: {
            createUrlTree: jest.fn().mockReturnValue({
              toString: jest.fn().mockReturnValue('url'),
            }),
          },
          columnUtilityService: {
            determineCaseNavigationPath: jest.fn().mockReturnValue('path'),
          },
        },
      };
      const result = service.getUrlByColumnData(
        params as any as GetContextMenuItemsParams
      );

      expect(result).toEqual('url');
      expect(
        params.context.columnUtilityService.determineCaseNavigationPath
      ).toHaveBeenCalledWith(
        params.node.data.status,
        params.node.data.enabledForApprovalWorkflow
      );
      expect(params.context.router.createUrlTree).toHaveBeenCalledWith('path', {
        queryParamsHandling: 'merge',
        queryParams: {
          quotation_number: 'gqId',
          customer_number: 'customerId',
          sales_org: 'salesOrg',
        },
      });
    });
  });
});
