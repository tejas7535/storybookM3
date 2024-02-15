import { ElementRef } from '@angular/core';
import { fakeAsync, tick } from '@angular/core/testing';
import { MATERIAL_SANITY_CHECKS } from '@angular/material/core';
import { MatDialogModule } from '@angular/material/dialog';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';

import { createComponentFactory, Spectator } from '@ngneat/spectator/jest';
import { TranslocoService } from '@ngneat/transloco';
import { provideMockStore } from '@ngrx/store/testing';

import { LoadingSpinnerModule } from '@schaeffler/loading-spinner';
import { provideTranslocoTestingModule } from '@schaeffler/transloco/testing';

import * as en from '../../../assets/i18n/en.json';
import { EmployeeListDialogComponent } from '../../shared/dialogs/employee-list-dialog/employee-list-dialog.component';
import { EmployeeListDialogModule } from '../../shared/dialogs/employee-list-dialog/employee-list-dialog.module';
import {
  EmployeeListDialogMeta,
  EmployeeListDialogMetaFilters,
} from '../../shared/dialogs/employee-list-dialog/models';
import { EmployeeListDialogMetaHeadings } from '../../shared/dialogs/employee-list-dialog/models/employee-list-dialog-meta-headings.model';
import { FilterDimension, IdValue, TimePeriod } from '../../shared/models';
import { FluctuationType } from '../../shared/tables/employee-list-table/models';
import { AttritionDialogComponent } from '../attrition-dialog/attrition-dialog.component';
import { AttritionDialogMeta } from '../attrition-dialog/models/attrition-dialog-meta.model';
import { ChartType, DimensionFluctuationData } from '../models';
import {
  BUTTON_CSS,
  OrgChartData,
  OrgChartNode,
  OrgChartTranslation,
} from './models';
import { OrgChartComponent } from './org-chart.component';
import { OrgChartService } from './org-chart.service';

jest.mock('d3-selection', () => ({
  select: jest.fn(() => {}),
}));

describe('OrgChartComponent', () => {
  let component: OrgChartComponent;
  let spectator: Spectator<OrgChartComponent>;
  let transloco: TranslocoService;
  let translation: OrgChartTranslation;
  let orgChartService: OrgChartService;

  const createComponent = createComponentFactory({
    component: OrgChartComponent,
    detectChanges: false,
    imports: [
      MatProgressSpinnerModule,
      EmployeeListDialogModule,
      provideTranslocoTestingModule({ en }),
      LoadingSpinnerModule,
      MatDialogModule,
    ],
    providers: [
      provideMockStore({}),
      { provide: MATERIAL_SANITY_CHECKS, useValue: false },
      OrgChartService,
    ],
  });

  beforeEach(() => {
    spectator = createComponent();
    component = spectator.debugElement.componentInstance;
    transloco = spectator.inject(TranslocoService);
    orgChartService = spectator.inject(OrgChartService);

    translation = {
      columnDirect: 'Direct',
      columnOverall: 'Overall',
      rowAttrition: 'Attrition',
      rowEmployees: 'Employees',
    };
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  describe('set orgChartData', () => {
    test('should set org chart data', () => {
      component.updateChart = jest.fn();
      const obj: any = {};
      transloco.translateObject = jest.fn(() => obj);
      component['orgChartService'].mapDimensionDataToNodes = jest.fn();
      const employees = [{ id: '123' } as unknown as DimensionFluctuationData];

      const input: OrgChartData = {
        data: employees,
        dimension: FilterDimension.ORG_UNIT,
        translation,
      };

      component.orgChartData = input;

      expect(component.updateChart).toHaveBeenCalled();
      expect(
        component['orgChartService'].mapDimensionDataToNodes
      ).toHaveBeenCalledWith(employees, translation, FluctuationType.TOTAL);
    });
  });

  describe('selectedNodeEmployeesLoading', () => {
    test('should set employees as undefined when loading and dialog opened', () => {
      component['_dialogRef'] = {
        componentInstance: {
          data: {
            employees: [{ employeeKey: '123' }],
          } as EmployeeListDialogMeta,
        },
      } as any;

      component.selectedNodeEmployeesLoading = true;

      expect(
        component['_dialogRef'].componentInstance.data.employees
      ).toBeUndefined();
    });

    test('should do nothing when loading and dialog closed', () => {
      component['_dialogRef'] = undefined;

      component.selectedNodeEmployeesLoading = true;

      expect(component['_dialogRef']).toBeUndefined();
    });

    test('should not set employees as undefined when not loading and dialog opened', () => {
      component['_dialogRef'] = {
        componentInstance: {
          data: {
            employees: [{ employeeKey: '123' }],
          } as EmployeeListDialogMeta,
        },
      } as any;

      component.selectedNodeEmployeesLoading = false;

      expect(
        component['_dialogRef'].componentInstance.data.employees
      ).not.toBeUndefined();
    });

    test('should do nothing when not loading and dialog closed', () => {
      component['_dialogRef'] = undefined;

      component.selectedNodeEmployeesLoading = false;

      expect(component['_dialogRef']).toBeUndefined();
    });
  });

  describe('set chartContainer', () => {
    test('should set container and update chart if elementRef', () => {
      component.updateChart = jest.fn();
      component['_chartContainer'] = undefined;

      const ref = {} as unknown as ElementRef;

      component.chartContainer = ref;

      expect(component.chartContainer).toEqual(ref);
      expect(component.updateChart).toHaveBeenCalledTimes(1);
    });

    test('should do nothing when elementRef unavailable', () => {
      component.updateChart = jest.fn();
      component['_chartContainer'] = undefined;

      component.chartContainer = undefined;

      expect(component.chartContainer).toBeUndefined();
      expect(component.updateChart).not.toHaveBeenCalled();
    });
  });

  describe('onMouseOver', () => {
    test('should raise parent SVG element when mouse over attrition button', () => {
      const event = {
        target: {
          classList: {
            contains: jest.fn().mockReturnValue(true),
          },
        },
      };

      const parent = {
        raise: jest.fn(),
      };
      component.d3s = {
        select: jest.fn().mockReturnValue(parent),
      };

      const findParentSVGSpy = jest
        .spyOn(component, 'findParentSVG')
        .mockReturnValue(parent);

      component.onMouseOver(event);

      expect(findParentSVGSpy).toHaveBeenCalledWith(event);
      expect(component.d3s.select).toHaveBeenCalledWith(parent);
      expect(parent.raise).toHaveBeenCalledWith();
    });

    test('should not raise parent SVG element when mouse out non-attrition button', () => {
      const event = {
        target: {
          classList: {
            contains: jest.fn().mockReturnValue(false),
          },
        },
      };

      const findParentSVGSpy = jest
        .spyOn(component, 'findParentSVG')
        .mockReturnValue(undefined as unknown);

      component.onMouseOver(event);

      expect(findParentSVGSpy).not.toHaveBeenCalled();
    });
  });

  describe('onMouseOut', () => {
    test('should raise node button SVG element when mouse out attrition button', () => {
      const event = {
        target: {
          classList: {
            contains: jest.fn().mockReturnValue(true),
          },
        },
      };

      const button = { raise: jest.fn() } as any;
      const parent = {
        select: jest.fn().mockReturnValue(button),
      };
      component.d3s = {
        select: jest.fn().mockReturnValue(parent),
      };

      const findParentSVGSpy = jest
        .spyOn(component, 'findParentSVG')
        .mockReturnValue(parent);

      component.onMouseOut(event);

      expect(findParentSVGSpy).toHaveBeenCalledWith(event);
      expect(component.d3s.select).toHaveBeenCalledWith(parent);
      expect(parent.select).toHaveBeenCalledWith('g .node-button-g');
      expect(button.raise).toHaveBeenCalled();
    });

    test('should not raise parent SVG element when mouse out non-attrition button', () => {
      const event = {
        target: {
          classList: {
            contains: jest.fn().mockReturnValue(false),
          },
        },
      };

      const findParentSVGSpy = jest
        .spyOn(component, 'findParentSVG')
        .mockReturnValue(undefined as unknown);

      component.onMouseOut(event);

      expect(findParentSVGSpy).not.toHaveBeenCalled();
    });
  });

  describe('clickout', () => {
    beforeEach(() => {
      component['dialog'].open = jest.fn();

      const input: OrgChartData = {
        data: [
          {
            id: '123',
            parentId: '321',
            dimension: 'Schaeffler_IT',
            managerOfOrgUnit: 'Hans',
            fluctuationRate: {},
            directFluctuationRate: {},
            absoluteFluctuation: {},
            directAbsoluteFluctuation: {},
          } as DimensionFluctuationData,
        ],
        dimension: FilterDimension.ORG_UNIT,
        translation,
      };

      component.orgChartData = input;
    });
    test('should open dialog with attrition data when attrition icon is clicked', () => {
      const meta: AttritionDialogMeta = {} as any;
      component.timeRange = new IdValue('123', 'June 2020');
      component.loadChildAttritionOverTime.emit = jest.fn();
      orgChartService.createAttritionDialogMeta = jest
        .fn()
        .mockReturnValue(meta);
      component.clickout({
        target: {
          id: BUTTON_CSS.attrition,
          dataset: {
            id: '123',
          },
        },
      });

      expect(component.loadChildAttritionOverTime.emit).toHaveBeenCalledWith(
        component.orgChartData.data[0]
      );
      expect(component['dialog'].open).toHaveBeenCalledWith(
        AttritionDialogComponent,
        {
          data: { type: ChartType.ORG_CHART, meta },
          width: '90%',
          maxWidth: '750px',
        }
      );
    });
    test('should open dialog with employee data when employee icon is clicked', () => {
      const data: EmployeeListDialogMeta = {
        headings: {
          header: 'Hans (Schaeffler_IT)',
          icon: 'organizationalView.employeeListDialog.contentTitle',
        } as EmployeeListDialogMetaHeadings,
        type: 'leavers',
        employees: [] as any[],
        employeesLoading: false,
        enoughRightsToShowAllEmployees: true,
      };

      component.createEmployeeListDialogMeta = jest.fn(() => data);

      component.clickout({
        target: {
          id: BUTTON_CSS.people,
          dataset: {
            id: '123',
          },
        },
      });

      expect(component['dialog'].open).toHaveBeenCalledWith(
        EmployeeListDialogComponent,
        {
          data,
        }
      );
      expect(component.createEmployeeListDialogMeta).toHaveBeenCalled();
    });
    test('should emit showParent event if arrow up is clicked', () => {
      component.showParent.emit = jest.fn();

      component.clickout({
        target: {
          id: BUTTON_CSS.showUpArrow,
          dataset: {
            id: '123',
          },
        },
      });

      expect(component.showParent.emit).toHaveBeenCalledWith(
        component.orgChartData.data[0]
      );
    });

    test('should clear highlights and set highlights to the children when expand button is clicked', () => {
      component.chart = {
        clearHighlighting: jest.fn(),
        setUpToTheRootHighlighted: jest.fn(),
        render: jest.fn(),
      } as any;
      const id = '123';
      const childId = '1234';
      component.chartData = [
        {
          nodeId: childId,
          parentNodeId: id,
        } as any,
      ];

      component.clickout({
        target: {
          id: BUTTON_CSS.expand,
          dataset: {
            id,
          },
        },
      });

      expect(component.chart.clearHighlighting).toHaveBeenCalled();
      expect(component.chart.setUpToTheRootHighlighted).toHaveBeenCalledWith(
        childId
      );
      expect(component.chart.render).toHaveBeenCalled();
    });

    test('should clear highlights and set highlights to clicked node when collapse button is clicked', () => {
      component.chart = {
        clearHighlighting: jest.fn(),
        setUpToTheRootHighlighted: jest.fn(),
        render: jest.fn(),
      } as any;
      const id = '123';

      component.clickout({
        target: {
          id: BUTTON_CSS.collapse,
          dataset: {
            id,
          },
        },
      });

      expect(component.chart.clearHighlighting).toHaveBeenCalled();
      expect(component.chart.setUpToTheRootHighlighted).toHaveBeenCalledWith(
        id
      );
      expect(component.chart.render).toHaveBeenCalled();
    });

    test('should clear highlights and set highlights to clicked node up to the root when header is clicked', () => {
      component.chart = {
        clearHighlighting: jest.fn(),
        setUpToTheRootHighlighted: jest.fn(),
        render: jest.fn(),
      } as any;
      const id = '123';
      component.chartData = [
        {
          nodeId: id,
        } as any,
      ];

      component.clickout({
        target: {
          classList: [`org-chart-header-${id}`],
          dataset: {},
        },
      });

      expect(component.chart.clearHighlighting).toHaveBeenCalled();
      expect(component.chart.setUpToTheRootHighlighted).toHaveBeenCalled();
      expect(component.chart.render).toHaveBeenCalled();
    });

    test('should clear highlights when no button is clicked', () => {
      component.chart = {
        clearHighlighting: jest.fn(),
      } as any;

      component.clickout({
        target: {
          id: '123',
          dataset: {
            id: '123',
          },
        },
      });

      expect(component.chart.clearHighlighting).toHaveBeenCalled();
    });
  });

  describe('ngAfterViewInit', () => {
    test('should call update start and init org chart if not initialized yet', fakeAsync(() => {
      component.updateChart = jest.fn();
      expect(component.chart).toBeUndefined();

      component.ngAfterViewInit();

      expect(component.chart).toBeDefined();
      tick();
      expect(component.updateChart).toHaveBeenCalled();
    }));

    test('should only call update start if chart already initialized', fakeAsync(() => {
      component.updateChart = jest.fn();
      const chart = { test: '123' };
      component.chart = chart;

      component.ngAfterViewInit();

      expect(component.chart).toEqual(chart);
      tick();
      expect(component.updateChart).toHaveBeenCalled();
    }));
  });

  describe('getDimensionFluctuationDataById', () => {
    test('should get dimension fluctuation data by id', () => {
      const id = 'AZ Alkmar';
      const expected = { id } as DimensionFluctuationData;
      component['_orgChartData'] = { data: [expected] } as OrgChartData;

      const result = component.getDimensionFluctuationDataById(id);

      expect(result).toBe(expected);
    });
  });

  describe('updateChart', () => {
    test('should do nothing when chart is not initialized yet', fakeAsync(() => {
      component.updateChart();

      tick();
      expect(component.chart).toBeUndefined();
    }));

    test('should do nothing when chart container is not available', fakeAsync(() => {
      component.chart = {} as any;
      component.updateChart();

      tick();
      expect(component.chart).toBeDefined();
    }));

    test('should do nothing when chart data is not available', fakeAsync(() => {
      component.chart = {} as any;
      component.chartContainer = {} as any;

      component.updateChart();

      tick();
      expect(component.chart).toBeDefined();
      expect(component.chartContainer).toBeDefined();
    }));

    test('should do nothing when chart data is empty', fakeAsync(() => {
      component.chart = {} as any;
      component.chartContainer = {} as any;
      component['_orgChartData'] = { data: [] } as OrgChartData;

      component.updateChart();

      tick();
      expect(component.chart).toBeDefined();
      expect(component.chartContainer).toBeDefined();
    }));

    test('should update chart', fakeAsync(() => {
      component.chart = {} as any;
      component.chartContainer = {} as any;
      component['_orgChartData'] = {
        data: [
          {
            id: '123',
            parentId: '321',
            dimension: 'Schaeffler_IT',
            managerOfOrgUnit: 'Hans',
            fluctuationRate: {},
            directFluctuationRate: {},
          } as DimensionFluctuationData,
        ],
        dimension: FilterDimension.ORG_UNIT,
        translation,
      } as OrgChartData;

      component.updateChart();

      tick();
      expect(component.chart).toBeDefined();
      expect(component.chartContainer).toBeDefined();
    }));
  });

  describe('updateDialogData', () => {
    test('should update data if dialog instance available', () => {
      const dialogRef = {
        componentInstance: {},
        data: {},
      } as any;
      const testData = {};

      component.createEmployeeListDialogMeta = jest.fn(() => testData as any);

      component['_dialogRef'] = dialogRef;

      component.updateDialogData();

      expect(dialogRef.data).toEqual(testData);
      expect(component.createEmployeeListDialogMeta).toHaveBeenCalledTimes(1);
    });

    test('should do nothing when instance not available', () => {
      const dialogRef = {
        componentInstance: undefined,
        data: undefined,
      } as any;
      const testData = {};

      component.createEmployeeListDialogMeta = jest.fn(() => testData as any);

      component['_dialogRef'] = dialogRef;

      component.updateDialogData();

      expect(dialogRef.data).toBeUndefined();
      expect(component.createEmployeeListDialogMeta).not.toHaveBeenCalled();
    });

    test('should do nothing when dialog ref not available', () => {
      const testData = {};

      component.createEmployeeListDialogMeta = jest.fn(() => testData as any);

      component.updateDialogData();

      expect(component.createEmployeeListDialogMeta).not.toHaveBeenCalled();
    });
  });

  describe('createEmployeeListDialogMeta', () => {
    test('should return dialog data for org unit', () => {
      const employees = [{} as any];
      const manager = 'Karl Ziegler';
      const dimension = 'HR';
      const dimensionLongName = 'Human Resources';
      component.selectedNodeEmployees = employees;
      component.selectedNodeEmployeesLoading = true;
      component.selectedDataNode = {
        filterDimension: FilterDimension.ORG_UNIT,
        directEmployees: 10,
        dimension,
        dimensionLongName,
        managerOfOrgUnit: manager,
      } as DimensionFluctuationData;
      component.timeRange = new IdValue(
        '1561990400|1593526399',
        TimePeriod.LAST_12_MONTHS
      );
      const customFilteres = new EmployeeListDialogMetaFilters(
        'translate it',
        `${dimension} (${dimensionLongName})`,
        'June 2020',
        manager
      );

      const result = component.createEmployeeListDialogMeta();

      expect(result).toEqual(
        new EmployeeListDialogMeta(
          new EmployeeListDialogMetaHeadings(
            'translate it',
            'people',
            false,
            customFilteres
          ),
          employees,
          true,
          true,
          'workforce',
          undefined,
          `translate it ${dimension} (${dimensionLongName}) ${customFilteres.timeRange}`
        )
      );
    });

    test('should return dialog data for board', () => {
      const employees = [{} as any];
      const dimension = 'Automotive';
      component.selectedNodeEmployees = employees;
      component.selectedNodeEmployeesLoading = true;
      component.selectedDataNode = {
        filterDimension: FilterDimension.BOARD,
        directEmployees: 10,
        dimension,
      } as DimensionFluctuationData;
      component.timeRange = new IdValue(
        '1561990400|1593526399',
        TimePeriod.LAST_12_MONTHS
      );
      const customFilteres = new EmployeeListDialogMetaFilters(
        'translate it',
        dimension,
        'June 2020'
      );

      const result = component.createEmployeeListDialogMeta();

      expect(result).toEqual(
        new EmployeeListDialogMeta(
          new EmployeeListDialogMetaHeadings(
            'translate it',
            'people',
            false,
            customFilteres
          ),
          employees,
          true,
          true,
          'workforce',
          undefined,
          `translate it ${dimension} ${customFilteres.timeRange}`
        )
      );
    });
  });

  describe('changeFluctuationType', () => {
    beforeEach(() => {
      component.chart = {
        data: jest.fn().mockReturnValue({ render: jest.fn() }),
      } as any;

      component.chartData = [
        {
          fluctuationRate: {
            fluctuationRate: 123,
            unforcedFluctuationRate: 234,
            forcedFluctuationRate: 345,
            remainingFluctuationRate: 456,
          },
          directFluctuationRate: {
            fluctuationRate: 321,
            unforcedFluctuationRate: 432,
            forcedFluctuationRate: 543,
            remainingFluctuationRate: 654,
          },
          absoluteFluctuation: {
            fluctuationRate: 789,
            unforcedFluctuationRate: 890,
            forcedFluctuationRate: 901,
            remainingFluctuationRate: 902,
          },
          directAbsoluteFluctuation: {
            fluctuationRate: 903,
            unforcedFluctuationRate: 904,
            forcedFluctuationRate: 905,
            remainingFluctuationRate: 906,
          },
        },
      ] as OrgChartNode[];
    });

    test('should set fluctuation type and render data', () => {
      component.fluctuationType = FluctuationType.REMAINING;

      component.changeFluctuationType({ value: FluctuationType.TOTAL } as any);

      expect(component.fluctuationType).toEqual(FluctuationType.TOTAL);
      expect(component.chart.data).toHaveBeenCalledWith(component.chartData);
      expect(
        component.chart.data(component.chartData).render
      ).toHaveBeenCalledTimes(1);
    });

    test('should set total as displayed fluctuation rate', () => {
      component.changeFluctuationType({ value: FluctuationType.TOTAL } as any);

      expect(component.chartData[0].displayedTotalFluctuationRate).toEqual(123);
      expect(component.chartData[0].displayedDirectFluctuationRate).toEqual(
        321
      );
      expect(component.chartData[0].displayedAbsoluteFluctuation).toEqual(789);
      expect(component.chartData[0].displayedDirectAbsoluteFluctuation).toEqual(
        903
      );
    });

    test('should set unforced as displayed fluctuation rate', () => {
      component.changeFluctuationType({
        value: FluctuationType.UNFORCED,
      } as any);

      expect(component.chartData[0].displayedTotalFluctuationRate).toEqual(234);
      expect(component.chartData[0].displayedDirectFluctuationRate).toEqual(
        432
      );
      expect(component.chartData[0].displayedAbsoluteFluctuation).toEqual(890);
      expect(component.chartData[0].displayedDirectAbsoluteFluctuation).toEqual(
        904
      );
    });

    test('should set forced as displayed fluctuation rate', () => {
      component.changeFluctuationType({ value: FluctuationType.FORCED } as any);

      expect(component.chartData[0].displayedTotalFluctuationRate).toEqual(345);
      expect(component.chartData[0].displayedDirectFluctuationRate).toEqual(
        543
      );
      expect(component.chartData[0].displayedAbsoluteFluctuation).toEqual(901);
      expect(component.chartData[0].displayedDirectAbsoluteFluctuation).toEqual(
        905
      );
    });

    test('should set remaining as displayed fluctuation rate', () => {
      component.changeFluctuationType({
        value: FluctuationType.REMAINING,
      } as any);

      expect(component.chartData[0].displayedTotalFluctuationRate).toEqual(456);
      expect(component.chartData[0].displayedDirectFluctuationRate).toEqual(
        654
      );
      expect(component.chartData[0].displayedAbsoluteFluctuation).toEqual(902);
      expect(component.chartData[0].displayedDirectAbsoluteFluctuation).toEqual(
        906
      );
    });
  });

  describe('findParentSVG', () => {
    test('should find parent SVG element', () => {
      const parent = {
        classList: {
          contains: jest.fn().mockReturnValue(true),
        },
        parentNode: {},
      };
      const node = {
        classList: {
          contains: jest.fn().mockReturnValue(false),
        },
        parentNode: parent,
      };
      const target = { parentNode: node };
      const event: Event = { target } as unknown as Event;

      component.d3s = {
        select: jest.fn().mockReturnValue({
          node: () => node,
        }),
      };

      const result = component.findParentSVG(event);

      expect(result).toEqual(parent);
    });

    test('should return undefined when no parent SVG element found', () => {
      const node = {
        classList: {
          contains: jest.fn().mockReturnValue(false),
        },
        parentNode: {},
      };
      const target = { parentNode: node };
      const event: Event = { target } as unknown as Event;

      component.d3s = {
        select: jest.fn().mockReturnValue({
          node: () => node,
        }),
      };

      const result = component.findParentSVG(event);

      expect(result).toBeUndefined();
    });
  });
});
