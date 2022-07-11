import { createServiceFactory, SpectatorService } from '@ngneat/spectator/jest';
import d3Selection from 'd3-selection';

import { Employee } from '../../shared/models';
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
    test('should map employee data', () => {
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
        heatMapClass: 'bg-secondary-900',
        showUpperParentBtn: false,
      });
    });

    test('should set showUpperButton to false if parent of one employee is null', () => {
      const data: Employee[] = [
        {
          employeeId: '123',
          employeeName: 'Hans',
          attritionMeta: {},
        } as unknown as Employee,
      ];

      const result = service.mapEmployeesToNodes(data);

      expect(result[0].showUpperParentBtn).toBeFalsy();
    });

    test('should set showUpperButton to true if parent of one employee is not null', () => {
      const data: Employee[] = [
        {
          employeeId: '123',
          employeeName: 'Hans',
          parentEmployeeId: '456',
          attritionMeta: {},
        } as unknown as Employee,
      ];

      const result = service.mapEmployeesToNodes(data);

      expect(result[0].showUpperParentBtn).toBeTruthy();
      expect(result[0].parentNodeId).toBeUndefined();
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
      expect(result).toContain("before:content-['\\e316']");
    });
    test('should return node btn with arrow down', () => {
      const node = {
        data: {
          _directSubordinates: 10,
        },
        children: {},
      };
      const result = service.getButtonContent(node);
      expect(result).toContain("before:content-['\\e313']");
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
