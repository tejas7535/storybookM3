import { createServiceFactory, SpectatorService } from '@ngneat/spectator/jest';
import d3Selection from 'd3-selection';

import { DimensionFluctuationData } from '../models/dimension-fluctuation-data.model';
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

  describe('mapOrgUnitsToNodes', () => {
    const translations = {
      columnDirect: 'translate it',
      rowEmployees: 'translate it',
      rowAttrition: 'translate it',
      columnOverall: 'translate it',
    };

    test('should map org unit data', () => {
      const data: DimensionFluctuationData[] = [
        {
          id: '123',
          dimension: 'Hans',
          attritionMeta: {},
          managerOfOrgUnit: 'Helmut',
          parentId: OrgChartService.ROOT_ID,
        } as unknown as DimensionFluctuationData,
      ];

      const result = service.mapOrgUnitsToNodes(data, translations);

      expect(result.length).toEqual(1);
      expect(result[0]).toEqual({
        nodeId: data[0].id,
        name: data[0].managerOfOrgUnit,
        expanded: false,
        organization: data[0].dimension,
        directSubordinates: data[0].directEmployees,
        totalSubordinates: data[0].totalEmployees,
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

    test('should sort data alphabetically', () => {
      const data: DimensionFluctuationData[] = [
        {
          id: '123',
          dimension: 'Hans',
          attritionMeta: {},
        } as unknown as DimensionFluctuationData,
        {
          id: '1234',
          dimension: 'Abel',
          attritionMeta: {},
        } as unknown as DimensionFluctuationData,
        {
          id: '12345',
          dimension: 'Georg',
          attritionMeta: {},
        } as unknown as DimensionFluctuationData,
        {
          id: '123456',
          dimension: 'Zorro',
          attritionMeta: {},
        } as unknown as DimensionFluctuationData,
      ];

      const result = service.mapOrgUnitsToNodes(data, translations);

      expect(result.length).toEqual(4);
      expect(result[0].organization).toEqual('Abel');
      expect(result[1].organization).toEqual('Georg');
      expect(result[2].organization).toEqual('Hans');
      expect(result[3].organization).toEqual('Zorro');
    });

    test('should set showUpperButton to false if parent of one org unit is null', () => {
      const data: DimensionFluctuationData[] = [
        {
          id: '123',
          dimension: 'Hans',
          attritionMeta: {},
          parentId: OrgChartService.ROOT_ID,
        } as unknown as DimensionFluctuationData,
      ];

      const result = service.mapOrgUnitsToNodes(data, translations);

      expect(result[0].showUpperParentBtn).toBeFalsy();
    });

    test('should set showUpperButton to true if parent of one org unit is not null', () => {
      const data: DimensionFluctuationData[] = [
        {
          id: '123',
          dimension: 'Hans',
          parentId: '456',
          attritionMeta: {},
        } as unknown as DimensionFluctuationData,
      ];

      const result = service.mapOrgUnitsToNodes(data, translations);

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
