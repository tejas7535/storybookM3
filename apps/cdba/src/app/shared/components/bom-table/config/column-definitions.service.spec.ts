import {
  createServiceFactory,
  mockProvider,
  SpectatorService,
} from '@ngneat/spectator/jest';
import { ValueFormatterParams, ValueGetterParams } from 'ag-grid-community';

import { provideTranslocoTestingModule } from '@schaeffler/transloco/testing';

import { ColumnUtilsService } from '@cdba/shared/components/table';
import { ScrambleMaterialNumberPipe } from '@cdba/shared/pipes';
import { BetaFeatureService } from '@cdba/shared/services/beta-feature/beta-feature.service';
import {
  ValueFormatterFunction,
  ValueGetterFunction,
} from '@cdba/testing/types';

import { ColumnDefinitionService } from './column-definitions.service';

describe('ColumnDefinitions', () => {
  let service: ColumnDefinitionService;
  let spectator: SpectatorService<ColumnDefinitionService>;
  let betaFeatureService: BetaFeatureService;

  const createService = createServiceFactory({
    service: ColumnDefinitionService,
    imports: [provideTranslocoTestingModule({ en: {} })],
    providers: [
      mockProvider(ColumnUtilsService, {
        formatNumber: jest.fn(() => ''),
        formatDate: jest.fn(() => ''),
      }),
      mockProvider(ScrambleMaterialNumberPipe, {
        transform: jest.fn(() => ''),
      }),
      mockProvider(BetaFeatureService),
    ],
  });

  beforeEach(() => {
    spectator = createService();
    service = spectator.service;
    betaFeatureService = spectator.inject(BetaFeatureService);
    betaFeatureService.getBetaFeature = jest.fn(() => false);
  });

  it('should be created', () => {
    expect(service).toBeDefined();
  });

  describe('getColDef', () => {
    it('should return the correct column definitions', () => {
      expect(service.getColDef().length).toBe(12);

      // oData
      betaFeatureService.getBetaFeature = jest.fn(() => true);
      expect(service.getColDef().length).toBe(73);
    });
  });

  describe('COLUMN_DEFINITIONS_CLASSIC', () => {
    it('should call value getter and format methods', () => {
      const columnDefinitions = service.COLUMN_DEFINITIONS_CLASSIC;
      const formatNumberSpy = jest.spyOn(
        service['columnUtilsService'],
        'formatNumber'
      );

      columnDefinitions.forEach((column) => {
        if (column.valueGetter) {
          const valueGetter = column.valueGetter as ValueGetterFunction;
          valueGetter({ data: {} } as ValueGetterParams);
        }

        if (column.valueFormatter) {
          const valueFormatter =
            column.valueFormatter as ValueFormatterFunction;
          valueFormatter({ data: {} } as ValueFormatterParams);
        }
      });

      expect(formatNumberSpy).toHaveBeenCalledTimes(3);
    });
  });

  describe('COLUMN_DEFINITIONS_ODATA', () => {
    it('should call value getter and format methods', () => {
      const columnDefinitions = service.COLUMN_DEFINITIONS_ODATA;
      const formatNumberSpy = jest.spyOn(
        service['columnUtilsService'],
        'formatNumber'
      );

      columnDefinitions.forEach((column) => {
        if (column.valueGetter) {
          const valueGetter = column.valueGetter as ValueGetterFunction;
          valueGetter({ data: {} } as ValueGetterParams);
        }

        if (column.valueFormatter) {
          const valueFormatter =
            column.valueFormatter as ValueFormatterFunction;
          valueFormatter({ data: {} } as ValueFormatterParams);
        }
      });

      expect(formatNumberSpy).toHaveBeenCalledTimes(43);
    });
  });
});
