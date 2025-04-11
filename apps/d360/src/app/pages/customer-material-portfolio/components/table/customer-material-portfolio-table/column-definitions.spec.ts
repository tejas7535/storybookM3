import { TrafficLightCellRendererComponent } from '../../../../../shared/components/ag-grid/cell-renderer/traffic-light-cell-renderer/traffic-light-cell-renderer.component';
import { TrafficLightTooltipComponent } from '../../../../../shared/components/ag-grid/traffic-light-tooltip/traffic-light-tooltip.component';
import { AgGridLocalizationService } from './../../../../../shared/services/ag-grid-localization.service';
import { SelectableOptionsService } from './../../../../../shared/services/selectable-options.service';
import { Stub } from './../../../../../shared/test/stub.class';
import { columnDefinitions } from './column-definitions';

describe('columnDefinitions', () => {
  let agGridLocalizationService: AgGridLocalizationService;
  let selectableOptionsService: SelectableOptionsService;

  beforeEach(() => {
    agGridLocalizationService = Stub.get<AgGridLocalizationService>({
      component: AgGridLocalizationService,
    });
    selectableOptionsService = Stub.get<SelectableOptionsService>({
      component: SelectableOptionsService,
    });
  });

  it('should return column definitions with correct structure', () => {
    const columns = columnDefinitions(
      agGridLocalizationService,
      selectableOptionsService
    );

    expect(columns).toBeInstanceOf(Array);
    expect(columns.length).toBeGreaterThan(0);

    columns.forEach((col) => {
      expect(col).toHaveProperty('colId');
      expect(col).toHaveProperty('visible');
      expect(col).toHaveProperty('alwaysVisible');
    });
  });

  it('should include TrafficLightCellRendererComponent for tlMessageType column', () => {
    const columns = columnDefinitions(
      agGridLocalizationService,
      selectableOptionsService
    );
    const tlMessageTypeColumn = columns.find(
      (col) => col.colId === 'tlMessageType'
    );

    expect(tlMessageTypeColumn).toBeDefined();
    expect(tlMessageTypeColumn?.cellRenderer).toBe(
      TrafficLightCellRendererComponent
    );
    expect(tlMessageTypeColumn?.tooltipComponent).toBe(
      TrafficLightTooltipComponent
    );
  });

  it('should include correct valueFormatter for packagingSize column', () => {
    const columns = columnDefinitions(
      agGridLocalizationService,
      selectableOptionsService
    );
    const packagingSizeColumn = columns.find(
      (col) => col.colId === 'packagingSize'
    );

    expect(packagingSizeColumn).toBeDefined();
    expect(packagingSizeColumn?.valueFormatter).toBe(
      agGridLocalizationService.numberFormatter
    );
  });

  it('should include correct filter for stochasticType column', () => {
    jest.spyOn(selectableOptionsService, 'getFilterColDef').mockReturnValue({
      filter: 'mockFilter',
    } as any);
    const columns = columnDefinitions(
      agGridLocalizationService,
      selectableOptionsService
    );
    const stochasticTypeColumn = columns.find(
      (col) => col.colId === 'stochasticType'
    );

    expect(stochasticTypeColumn).toBeDefined();
    expect(selectableOptionsService.getFilterColDef).toHaveBeenCalledWith(
      'stochasticType',
      expect.any(Function),
      null
    );
    expect(stochasticTypeColumn?.filter).toBe('mockFilter');
  });

  it('should include correct valueFormatter for pfStatusAutoSwitch column', () => {
    const columns = columnDefinitions(
      agGridLocalizationService,
      selectableOptionsService
    );
    const pfStatusAutoSwitchColumn = columns.find(
      (col) => col.colId === 'pfStatusAutoSwitch'
    );

    expect(pfStatusAutoSwitchColumn).toBeDefined();
    expect(pfStatusAutoSwitchColumn?.valueFormatter).toBe(
      agGridLocalizationService.dateFormatter
    );
  });

  it('should include correct cellRendererParams for successorCustomerMaterialNumber column', () => {
    const columns = columnDefinitions(
      agGridLocalizationService,
      selectableOptionsService
    );
    const successorCustomerMaterialNumberColumn = columns.find(
      (col) => col.colId === 'successorCustomerMaterialNumber'
    );

    expect(successorCustomerMaterialNumberColumn).toBeDefined();
    expect(successorCustomerMaterialNumberColumn?.cellRendererParams).toEqual({
      materialNumberField: 'successorMaterial',
      customerMaterialNumberField: 'successorCustomerMaterialNumber',
      matCountNumberField: 'successorCustomerMaterialNumberCount',
    });
  });
});
