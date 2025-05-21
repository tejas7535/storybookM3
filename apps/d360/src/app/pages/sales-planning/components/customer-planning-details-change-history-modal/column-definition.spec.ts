import { planningLevelMaterialTypes } from '../../../../feature/sales-planning/planning-level.service';
import { AgGridLocalizationService } from '../../../../shared/services/ag-grid-localization.service';
import { changeHistoryColumnDefinitions } from './column-definition';

describe('changeHistoryColumnDefinitions', () => {
  let agGridLocalizationService: AgGridLocalizationService;

  beforeEach(() => {
    agGridLocalizationService = {
      numberFormatter: jest.fn((params, _decimals, currency) =>
        `${params.value} ${currency || ''}`.trim()
      ),
    } as unknown as AgGridLocalizationService;
  });

  it('should return column definitions with correct properties', () => {
    const columns = changeHistoryColumnDefinitions(agGridLocalizationService);

    expect(columns).toBeDefined();
    expect(columns).toHaveLength(10);

    const planningYearColumn = columns.find(
      (col) => col.colId === 'planningYear'
    );
    expect(planningYearColumn).toBeDefined();
    expect(planningYearColumn?.title).toBe('planningYear');

    const planningMonthColumn = columns.find(
      (col) => col.colId === 'planningMonth'
    );
    expect(planningMonthColumn).toBeDefined();
    expect(planningMonthColumn?.filter).toBe('agSetColumnFilter');
    expect(planningMonthColumn?.filterParams?.values).toHaveLength(12);

    const materialTypeLevelColumn = columns.find(
      (col) => col.colId === 'materialTypeLevel'
    );
    expect(materialTypeLevelColumn).toBeDefined();
    expect(materialTypeLevelColumn?.filterParams?.values).toBe(
      planningLevelMaterialTypes
    );

    const materialDescriptionColumn = columns.find(
      (col) => col.colId === 'materialDescription'
    );
    expect(materialDescriptionColumn).toBeDefined();
    expect(materialDescriptionColumn?.flex).toBe(1);
    expect(materialDescriptionColumn?.minWidth).toBe(150);

    const changeTimestampColumn = columns.find(
      (col) => col.colId === 'changeTimestamp'
    );
    expect(changeTimestampColumn).toBeDefined();
    expect(changeTimestampColumn?.filter).toBe('agDateColumnFilter');
    expect(changeTimestampColumn?.sort).toBe('desc');

    const valueOldColumn = columns.find((col) => col.colId === 'valueOld');
    expect(valueOldColumn).toBeDefined();
    expect(valueOldColumn?.filter).toBe('agNumberColumnFilter');
    expect(agGridLocalizationService.numberFormatter).not.toHaveBeenCalled();

    const valueNewColumn = columns.find((col) => col.colId === 'valueNew');
    expect(valueNewColumn).toBeDefined();
    expect(valueNewColumn?.filter).toBe('agNumberColumnFilter');

    const changeTypeColumn = columns.find((col) => col.colId === 'changeType');
    expect(changeTypeColumn).toBeDefined();
    expect(changeTypeColumn?.filterParams?.values).toEqual(['U', 'I', 'D']);
  });

  it('should format valueOld correctly using numberFormatter', () => {
    const columns = changeHistoryColumnDefinitions(agGridLocalizationService);
    const valueOldColumn = columns.find(
      (col) => col.colId === 'valueOld'
    ) as any;

    const mockParams = {
      data: { oldValueCurrency: 'USD' },
      value: 12_345,
    };

    const formattedValue = valueOldColumn?.valueFormatter?.(mockParams as any);
    expect(formattedValue).toBe('12345 USD');
    expect(agGridLocalizationService.numberFormatter).toHaveBeenCalledWith(
      mockParams,
      0,
      'USD'
    );
  });

  it('should format valueNew correctly using numberFormatter', () => {
    const columns = changeHistoryColumnDefinitions(agGridLocalizationService);
    const valueNewColumn = columns.find(
      (col) => col.colId === 'valueNew'
    ) as any;

    const mockParams = {
      data: { newValueCurrency: 'EUR' },
      value: 67_890,
    };

    const formattedValue = valueNewColumn?.valueFormatter?.(mockParams as any);
    expect(formattedValue).toBe('67890 EUR');
    expect(agGridLocalizationService.numberFormatter).toHaveBeenCalledWith(
      mockParams,
      0,
      'EUR'
    );
  });
});
