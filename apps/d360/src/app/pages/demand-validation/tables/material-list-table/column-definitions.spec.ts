import { AgGridLocalizationService } from '../../../../shared/services/ag-grid-localization.service';
import { getColumnDefinitions } from './column-definitions';

describe('getColumnDefinitions', () => {
  let agGridLocalizationService: AgGridLocalizationService;

  beforeEach(() => {
    agGridLocalizationService = {
      numberFormatter: jest.fn(),
    } as unknown as AgGridLocalizationService;
  });

  it('should return column definitions with correct properties', () => {
    const columnDefs = getColumnDefinitions(agGridLocalizationService);

    expect(columnDefs).toHaveLength(5);

    // Check materialNumber column
    expect(columnDefs[0]).toEqual({
      colId: 'materialNumber',
      filter: undefined,
      filterParams: undefined,
      width: 180,
    });

    // Check materialDescription column
    expect(columnDefs[1]).toEqual({
      colId: 'materialDescription',
      flex: 1,
    });

    // Check customerMaterialNumber column
    expect(columnDefs[2]).toEqual({
      colId: 'customerMaterialNumber',
      cellRenderer: 'customerMaterialNumberCellRenderer',
      flex: 1,
    });

    // Check materialClassification column
    expect(columnDefs[3]).toEqual({
      colId: 'materialClassification',
      width: 80,
    });

    // Check demandPlanValue column
    expect(columnDefs[4].colId).toBe('demandPlanValue');
    expect(columnDefs[4].width).toBe(120);
    expect(columnDefs[4].valueFormatter).toBe(
      agGridLocalizationService.numberFormatter
    );
  });

  it('should use the numberFormatter from agGridLocalizationService for demandPlanValue column', () => {
    const mockNumberFormatter = jest.fn();
    agGridLocalizationService.numberFormatter = mockNumberFormatter;

    const columnDefs = getColumnDefinitions(agGridLocalizationService);
    const demandPlanValueColumn = columnDefs.find(
      (col) => col.colId === 'demandPlanValue'
    );

    expect(demandPlanValueColumn).toBeDefined();
    expect(demandPlanValueColumn?.valueFormatter).toBe(mockNumberFormatter);
  });
});
