import { AgGridLocalizationService } from '../../../../shared/services/ag-grid-localization.service';
import { changeHistoryColumnDefinitions } from './column-definition';

describe('changeHistoryColumnDefinitions', () => {
  let agGridLocalizationService: AgGridLocalizationService;
  beforeEach(() => {
    agGridLocalizationService = {} as unknown as AgGridLocalizationService;
  });

  it('should return an array of column definitions with correct properties', () => {
    const result = changeHistoryColumnDefinitions(agGridLocalizationService);

    expect(result).toBeInstanceOf(Array);
    expect(result.length).toBeGreaterThan(0);

    result.forEach((column) => {
      expect(column).toHaveProperty('colId');
      expect(typeof column.colId).toEqual('string');
      expect(column).toHaveProperty('title');
      expect(typeof column.title).toEqual('string');
    });
  });
});
