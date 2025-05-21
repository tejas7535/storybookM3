import { TableWithHeader } from '@mm/shared/components/pdf/pdf-table-with-header/table-with-header';
import { createServiceFactory, SpectatorService } from '@ngneat/spectator/jest';

import { Table } from '@schaeffler/pdf-generator';

import { PdfTableFactory } from './pdf-table-factory.service';

describe('PdfTableFactory', () => {
  let spectator: SpectatorService<PdfTableFactory>;
  let service: PdfTableFactory;

  const createService = createServiceFactory({
    service: PdfTableFactory,
  });

  beforeEach(() => {
    spectator = createService();
    service = spectator.service;
  });

  test('should be created', () => {
    expect(service).toBeTruthy();
  });

  describe('createStyledTable', () => {
    test('should create a table with proper styling', () => {
      const data = [
        ['Column 1', 'Column 2'],
        ['Value 1', 'Value 2'],
      ];

      const table = service.createStyledTable(data);

      expect(table).toBeInstanceOf(Table);
      expect(table).toBeTruthy();
    });

    test('should create a table with alternate row background by default', () => {
      const data = [['A', 'B']];

      const table = service.createStyledTable(data);

      expect(table).toBeInstanceOf(Table);
    });

    test('should create a table without background when alternateBackground is false', () => {
      const data = [['A', 'B']];

      const table = service.createStyledTable(data, false);

      expect(table).toBeInstanceOf(Table);
    });
  });

  describe('createTableWithHeader', () => {
    test('should create a table with header component', () => {
      const mockTable = new Table({ data: [['A', 'B']] });
      const title = 'Test Table';

      const tableWithHeader = service.createTableWithHeader(mockTable, title);

      expect(tableWithHeader).toBeInstanceOf(TableWithHeader);
    });
  });

  describe('createCompleteTable', () => {
    test('should create a complete table with data and title', () => {
      const data = [
        ['Header 1', 'Header 2'],
        ['Value 1', 'Value 2'],
      ];
      const title = 'Complete Table';

      jest.spyOn(service, 'createStyledTable');
      jest.spyOn(service, 'createTableWithHeader');

      const completeTable = service.createCompleteTable(data, title);

      expect(service.createStyledTable).toHaveBeenCalledWith(data);
      expect(service.createTableWithHeader).toHaveBeenCalled();
      expect(completeTable).toBeInstanceOf(TableWithHeader);
    });
  });
});
