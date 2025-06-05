import { ColumnUtilityService } from '@gq/shared/ag-grid/services/column-utility.service';
import { DateFilterParamService } from '@gq/shared/ag-grid/services/date-filter-param/date-filter-param.service';
import {
  createServiceFactory,
  mockProvider,
  SpectatorService,
} from '@ngneat/spectator/jest';
import { ColDef } from 'ag-grid-community';

import { provideTranslocoTestingModule } from '@schaeffler/transloco/testing';

import { Rfq4RequestsColDefService } from './rfq-4-request-col-def-service';
import { Rfq4RequestsFields } from './rfq-4-requests-fields.enum';
describe('Rfq4RequestColDefService', () => {
  let service: Rfq4RequestsColDefService;
  let spectator: SpectatorService<Rfq4RequestsColDefService>;

  const createService = createServiceFactory({
    service: Rfq4RequestsColDefService,
    imports: [provideTranslocoTestingModule({})],
    providers: [
      mockProvider(ColumnUtilityService),
      mockProvider(DateFilterParamService),
    ],
  });

  beforeEach(() => {
    spectator = createService();
    service = spectator.service;
  });

  test('should be created', () => {
    expect(service).toBeTruthy();
  });
  test('COLUMN_DEFS should be defined', () => {
    expect(service.COLUMN_DEFS).toBeDefined();
  });

  describe('getColDefsForOpenTab', () => {
    test('should return COLUMN_DEFS', () => {
      const colDefs = service.getColDefsForOpenTab();
      expect(colDefs).not.toContain(
        (colDef: ColDef) => colDef.field === Rfq4RequestsFields.ASSIGNED_TO
      );
    });
  });
  describe('getColDefsForNonOpenTab', () => {
    test('should return COLUMN_DEFS', () => {
      const colDefs = service.getColDefsForNonOpenTab();
      expect(colDefs).not.toContain(
        (colDef: ColDef) => colDef.field === Rfq4RequestsFields.STATUS
      );
    });
  });

  describe('getRfq4IdValueFormatter', () => {
    test('should return formatted RFQ ID', () => {
      const params = { value: '12345' };
      const result = service.getRfq4IdValueFormatter(params);
      expect(result).toBe('RFQ12345');
    });
  });
});
