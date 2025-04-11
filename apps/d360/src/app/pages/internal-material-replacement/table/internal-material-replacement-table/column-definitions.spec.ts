import { replacementTypeValues } from '../../../../feature/internal-material-replacement/model';
import { replacementTypeValueFormatter } from '../../../../shared/ag-grid/grid-value-formatter';
import { TrafficLightCellRendererComponent } from '../../../../shared/components/ag-grid/cell-renderer/traffic-light-cell-renderer/traffic-light-cell-renderer.component';
import {
  trafficLightValueFormatter,
  trafficLightValues,
} from '../../../../shared/components/ag-grid/traffic-light-shared-functions';
import { TrafficLightTooltipComponent } from '../../../../shared/components/ag-grid/traffic-light-tooltip/traffic-light-tooltip.component';
import { AgGridLocalizationService } from '../../../../shared/services/ag-grid-localization.service';
import { Stub } from '../../../../shared/test/stub.class';
import { SelectableOptionsService } from './../../../../shared/services/selectable-options.service';
import { getIMRColumnDefinitions } from './column-definitions';

describe('getIMRColumnDefinitions', () => {
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

  it('should return column definitions with correct properties', () => {
    const columns = getIMRColumnDefinitions(
      agGridLocalizationService,
      selectableOptionsService
    );

    expect(columns).toBeDefined();
    expect(columns.length).toBeGreaterThan(0);

    const regionColumn = columns.find((col) => col.property === 'region');
    expect(regionColumn).toBeDefined();
    expect(regionColumn.colId).toBe('material_customer.column.region');

    const replacementTypeColumn = columns.find(
      (col) => col.property === 'replacementType'
    );
    expect(replacementTypeColumn).toBeDefined();
    expect(replacementTypeColumn.colId).toBe(
      'internal_material_replacement.column.replacementType'
    );
    expect((replacementTypeColumn.valueFormatter as any)({})).toBe(
      replacementTypeValueFormatter()({})
    );
    expect(replacementTypeColumn.filter).toBe('agSetColumnFilter');
    expect(replacementTypeColumn.filterParams).toEqual({
      values: replacementTypeValues,
      valueFormatter: expect.any(Function),
    });

    const tlMessageTypeColumn = columns.find(
      (col) => col.property === 'tlMessageType'
    );
    expect(tlMessageTypeColumn).toBeDefined();
    expect(tlMessageTypeColumn.colId).toBe(
      'internal_material_replacement.column.statusMasterData.rootString'
    );
    expect(tlMessageTypeColumn.cellRenderer).toBe(
      TrafficLightCellRendererComponent
    );
    expect(tlMessageTypeColumn.filter).toBe('agSetColumnFilter');
    expect(tlMessageTypeColumn.filterParams).toEqual({
      values: trafficLightValues,
      valueFormatter: trafficLightValueFormatter,
    });
    expect(tlMessageTypeColumn.tooltipComponent).toBe(
      TrafficLightTooltipComponent
    );
    expect(tlMessageTypeColumn.tooltipField).toBe('tlMessage');
  });

  it('should use agGridLocalizationService for date and number formatting', () => {
    const columns = getIMRColumnDefinitions(
      agGridLocalizationService,
      selectableOptionsService
    );

    const replacementDateColumn = columns.find(
      (col) => col.property === 'replacementDate'
    );
    expect(replacementDateColumn).toBeDefined();
    expect(replacementDateColumn.valueFormatter).toBe(
      agGridLocalizationService.dateFormatter
    );

    const countBCTotalColumn = columns.find(
      (col) => col.property === 'countBCTotal'
    );
    expect(countBCTotalColumn).toBeDefined();
    expect(countBCTotalColumn.valueFormatter).toBe(
      agGridLocalizationService.numberFormatter
    );
  });
});
