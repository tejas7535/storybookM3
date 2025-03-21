import { ValueFormatterParams } from 'ag-grid-enterprise';

import { materialClassificationOptions } from '../../../../feature/material-customer/model';
import { SelectableValue } from '../../../../shared/components/inputs/autocomplete/selectable-values.utils';
import { AgGridLocalizationService } from '../../../../shared/services/ag-grid-localization.service';
import { getAlertTableColumnDefinitions } from './column-definitions';

describe('Alert Table ColumnDefinitions', () => {
  let agGridLocalizationService: AgGridLocalizationService;
  let alertTypes: SelectableValue[];

  beforeEach(() => {
    agGridLocalizationService = {
      dateFormatter: jest.fn((params) => params.value),
    } as unknown as AgGridLocalizationService;

    alertTypes = [
      { id: 'type1', text: 'Type 1' },
      { id: 'type2', text: 'Type 2' },
    ];
  });

  it('should return column definitions with correct properties', () => {
    const columns = getAlertTableColumnDefinitions(
      agGridLocalizationService,
      alertTypes
    );

    expect(columns).toEqual(
      expect.arrayContaining([
        expect.objectContaining({
          field: 'customerNumber',
          colId: 'alert.customer_number.column_header',
          filter: 'agTextColumnFilter',
          sortable: true,
        }),
        expect.objectContaining({
          field: 'customerName',
          colId: 'alert.customer_name.column_header',
          filter: 'agTextColumnFilter',
          sortable: true,
        }),
        expect.objectContaining({
          field: 'materialNumber',
          colId: 'alert.material_number.column_header',
          filter: 'agTextColumnFilter',
          sortable: true,
        }),
        expect.objectContaining({
          field: 'materialDescription',
          colId: 'alert.material_description.column_header',
          filter: 'agTextColumnFilter',
          sortable: true,
        }),
        expect.objectContaining({
          field: 'type',
          colId: 'alert.category.column_header',
          valueFormatter: expect.any(Function),
          flex: 1,
          minWidth: 200,
          filter: 'agSetColumnFilter',
          filterParams: expect.objectContaining({
            values: alertTypes.map((item) => item.id),
            valueFormatter: expect.any(Function),
          }),
          sortable: true,
        }),
        expect.objectContaining({
          field: 'materialClassification',
          colId: 'alert.material_classification.column_header',
          filter: 'agSetColumnFilter',
          filterParams: expect.objectContaining({
            values: materialClassificationOptions,
          }),
          sortable: true,
        }),
        expect.objectContaining({
          field: 'customerMaterialNumber',
          colId: 'alert.customer_material_number.column_header',
          cellRenderer: 'customerMaterialNumberCellRenderer',
          filter: 'agTextColumnFilter',
          sortable: true,
        }),
        expect.objectContaining({
          field: 'createdAt',
          colId: 'alert.report_date.column_header',
          valueFormatter: agGridLocalizationService.dateFormatter,
          type: 'rightAligned',
          sortable: true,
        }),
        expect.objectContaining({
          field: 'dueDate',
          colId: 'alert.due_date.column_header',
          valueFormatter: agGridLocalizationService.dateFormatter,
          type: 'rightAligned',
          filter: 'agDateColumnFilter',
          sortable: true,
        }),
        expect.objectContaining({
          field: 'comment',
          colId: 'alert.comment.column_header',
          cellRenderer: undefined,
          maxWidth: 375,
          sortable: false,
          tooltipValueGetter: expect.any(Function),
          tooltipField: 'comment',
        }),
        expect.objectContaining({
          field: 'thresholdDeviation',
          colId: 'alert.thresholdDeviation.column_header',
          filter: 'agNumberColumnFilter',
          sortable: true,
        }),
        expect.objectContaining({
          field: 'threshold1',
          colId: 'alert.threshold1.column_header',
          filter: 'agNumberColumnFilter',
          sortable: true,
        }),
        expect.objectContaining({
          field: 'threshold1Description',
          colId: 'alert.threshold1Description.column_header',
          sortable: false,
        }),
        expect.objectContaining({
          field: 'threshold2',
          colId: 'alert.threshold2.column_header',
          filter: 'agNumberColumnFilter',
          sortable: true,
        }),
        expect.objectContaining({
          field: 'threshold2Description',
          colId: 'alert.threshold2Description.column_header',
          sortable: false,
        }),
        expect.objectContaining({
          field: 'threshold3',
          colId: 'alert.threshold3.column_header',
          filter: 'agNumberColumnFilter',
          sortable: true,
        }),
        expect.objectContaining({
          field: 'threshold3Description',
          colId: 'alert.threshold3Description.column_header',
          sortable: false,
        }),
      ])
    );
  });

  it('should format type field values correctly', () => {
    const columns = getAlertTableColumnDefinitions(
      agGridLocalizationService,
      alertTypes
    );
    const typeColumn = columns.find((col) => col.field === 'type') as any;

    const params = { value: 'type1' } as ValueFormatterParams;
    const formattedValue = typeColumn?.valueFormatter?.(params);

    expect(formattedValue).toBe('alert.category.type1');
  });

  it('should format type filter values correctly', () => {
    const columns = getAlertTableColumnDefinitions(
      agGridLocalizationService,
      alertTypes
    );
    const typeColumn = columns.find((col) => col.field === 'type');

    const valueFormatterParams = { value: 'type1' } as ValueFormatterParams;
    const formattedValue =
      typeColumn?.filterParams?.valueFormatter?.(valueFormatterParams);

    expect(formattedValue).toBe('alert.category.type1');
  });

  it('should format createdAt and dueDate fields using agGridLocalizationService', () => {
    const columns = getAlertTableColumnDefinitions(
      agGridLocalizationService,
      alertTypes
    );
    const createdAtColumn = columns.find(
      (col) => col.field === 'createdAt'
    ) as any;
    const dueDateColumn = columns.find((col) => col.field === 'dueDate') as any;

    const params = { value: '2024-01-01' } as ValueFormatterParams;
    const formattedCreatedAt = createdAtColumn?.valueFormatter?.(params);
    const formattedDueDate = dueDateColumn?.valueFormatter?.(params);

    expect(formattedCreatedAt).toBe('2024-01-01');
    expect(formattedDueDate).toBe('2024-01-01');
  });

  it('should set tooltipValueGetter for comment field', () => {
    const columns = getAlertTableColumnDefinitions(
      agGridLocalizationService,
      alertTypes
    );
    const commentColumn = columns.find((col) => col.field === 'comment');

    const params = { value: 'Test comment' } as ValueFormatterParams;
    const tooltipValue = commentColumn?.tooltipValueGetter?.(params as any);

    expect(tooltipValue).toEqual({ value: 'Test comment' });
  });
});
