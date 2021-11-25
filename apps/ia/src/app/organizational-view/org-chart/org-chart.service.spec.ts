import { createServiceFactory, SpectatorService } from '@ngneat/spectator/jest';
import d3Selection from 'd3-selection';

import { Employee, HeatType } from '../../shared/models';
import { OrgChartService } from './org-chart.service';

const mock: any = {
  attr: jest.fn(() => mock),
};

jest.mock('d3-selection', () => ({
  select: jest.fn(() => mock),
}));

describe('OrgChartService', () => {
  let service: OrgChartService;
  let spectator: SpectatorService<OrgChartService>;

  const createService = createServiceFactory({
    service: OrgChartService,
    imports: [],
    providers: [OrgChartService],
  });

  beforeEach(() => {
    spectator = createService();
    service = spectator.service;
  });

  describe('mapEmployeesToNodes', () => {
    test('should mapped employee data', () => {
      const data: Employee[] = [
        {
          employeeId: '123',
          employeeName: 'Hans',
          attritionMeta: {},
        } as unknown as Employee,
      ];

      const result = service.mapEmployeesToNodes(data);

      expect(result.length).toEqual(1);
      expect(result[0]).toEqual({
        nodeId: data[0].employeeId,
        parentNodeId: data[0].parentEmployeeId,
        expanded: false,
        name: data[0].employeeName,
        organization: data[0].orgUnit,
        directSubordinates: data[0].directSubordinates,
        totalSubordinates: data[0].totalSubordinates,
        directAttrition: data[0].directAttrition,
        totalAttrition: data[0].totalAttrition,
        textColumnDirect: 'translate it',
        textColumnOverall: 'translate it',
        textRowEmployees: 'translate it',
        textRowAttrition: 'translate it',
        heatMapClass: '',
        showUpperParentBtn: true,
      });
    });

    test('should include heat map info', () => {
      const data: Employee[] = [
        {
          employeeId: '123',
          parentEmployeeId: undefined,
          employeeName: 'Hans',
          attritionMeta: {
            attritionRate: 0.1,
          },
        } as unknown as Employee,
        {
          employeeId: '456',
          parentEmployeeId: '123',
          employeeName: 'Hans2',
          attritionMeta: {
            attritionRate: 0.09,
            heatType: HeatType.GREEN_HEAT,
          },
        } as unknown as Employee,
        {
          employeeId: '789',
          parentEmployeeId: '123',
          employeeName: 'Hans3',
          attritionMeta: {
            attritionRate: 0.12,
            heatType: HeatType.ORANGE_HEAT,
          },
        } as unknown as Employee,
        {
          employeeId: '999',
          parentEmployeeId: '123',
          employeeName: 'Hans4',
          attritionMeta: {
            attritionRate: 0.5,
            heatType: HeatType.RED_HEAT,
          },
        } as unknown as Employee,
      ];

      const result = service.mapEmployeesToNodes(data);

      expect(result.length).toEqual(4);
      expect(result[1].heatMapClass).toContain('bg-success');
      expect(result[2].heatMapClass).toContain('bg-warning');
      expect(result[3].heatMapClass).toContain('bg-error');
    });
  });

  describe('updateLinkStyles', () => {
    test('should set stroke', () => {
      service.updateLinkStyles();

      expect(d3Selection.select).toHaveBeenCalledWith('.svg-chart-container');
      expect(mock.attr).toHaveBeenCalledWith('stroke', 'rgba(0,0,0,0.11)');
      expect(mock.attr).toHaveBeenCalledWith('stroke-width', 1);
    });
  });

  describe('getButtonContent', () => {
    test('should return node btn with arrow up', () => {
      const node = {
        data: {
          _directSubordinates: 10,
        },
      };
      const result = service.getButtonContent(node);
      expect(result).toContain("before:content-['keyboard_arrow_up']");
    });
    test('should return node btn with arrow down', () => {
      const node = {
        data: {
          _directSubordinates: 10,
        },
        children: {},
      };
      const result = service.getButtonContent(node);
      expect(result).toContain("before:content-['keyboard_arrow_down']");
    });
  });

  describe('getNodeContent', () => {
    test('should return node content without upwards button', () => {
      const data = {
        showUpperParentBtn: false,
        heatMapClass: 'bg-green',
        organization: 'Schaeffler_IT',
        name: 'Hans',
        textColumnDirect: 'Test',
        textColumnOverall: 'Test2',
        textRowEmployees: 'Test3',
        directSubordinates: 10,
        totalSubordinates: 200,
        textRowAttrition: 'Test4',
        directAttrition: 10,
        totalAttrition: 400,
        nodeId: '1',
        parentNodeId: '12',
        expanded: true,
      };

      const result = service.getNodeContent(data);

      expect(result).not.toContain('show-parent');
      expect(result).toContain(data.heatMapClass);
      expect(result).toContain(data.name);
    });

    test('should return node content with upwards button', () => {
      const data = {
        showUpperParentBtn: true,
        heatMapClass: 'bg-green',
        organization: 'Schaeffler_IT',
        name: 'Hans',
        textColumnDirect: 'Test',
        textColumnOverall: 'Test2',
        textRowEmployees: 'Test3',
        directSubordinates: 10,
        totalSubordinates: 200,
        textRowAttrition: 'Test4',
        directAttrition: 10,
        totalAttrition: 400,
        nodeId: '1',
        parentNodeId: '12',
        expanded: true,
      };

      const result = service.getNodeContent(data);

      expect(result).toContain('show-parent');
      expect(result).toContain(data.heatMapClass);
      expect(result).toContain(data.name);
    });
  });
});
