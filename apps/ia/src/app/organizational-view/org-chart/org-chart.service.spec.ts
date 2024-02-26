import { createServiceFactory, SpectatorService } from '@ngneat/spectator/jest';

import { FilterDimension, HeatType } from '../../shared/models';
import { FluctuationType } from '../../shared/tables/employee-list-table/models';
import { DimensionFluctuationData, OrgChartFluctuationRate } from '../models';
import { BUTTON_CSS, OrgChartNode } from './models';
import { OrgChartService } from './org-chart.service';

const mock: any = {
  attr: jest.fn(() => mock),
};

describe('OrgChartService', () => {
  let service: OrgChartService;
  let spectator: SpectatorService<OrgChartService>;

  const createService = createServiceFactory({
    service: OrgChartService,
    providers: [OrgChartService],
  });

  beforeEach(() => {
    spectator = createService();
    service = spectator.service;
  });

  describe('createAttritionDialogMeta', () => {
    test('should create meta', () => {
      const node: DimensionFluctuationData = {
        fluctuationRate: {
          fluctuationRate: 32,
          forcedFluctuationRate: 10,
          remainingFluctuationRate: 8,
          unforcedFluctuationRate: 22,
        },
        attritionMeta: {
          employeesLost: 20,
          unforcedFluctuation: 2,
          forcedFluctuation: 10,
          remainingFluctuation: 1,
          resignationsReceived: 1,
          employeesAdded: 33,
          openPositions: 12,
          responseModified: false,
        },
        dimension: 'Europe',
      } as DimensionFluctuationData;
      const timeRange = '2023 May';

      const result = service.createAttritionDialogMeta(node, timeRange, true);

      expect(result.data).toEqual({
        fluctuationRate: node.fluctuationRate.fluctuationRate,
        unforcedFluctuationRate: node.fluctuationRate.unforcedFluctuationRate,
        forcedFluctuationRate: node.fluctuationRate.forcedFluctuationRate,
        remainingFluctuationRate: node.fluctuationRate.remainingFluctuationRate,
        employeesLost: node.attritionMeta.employeesLost,
        unforcedFluctuation: node.attritionMeta.unforcedFluctuation,
        forcedFluctuation: node.attritionMeta.forcedFluctuation,
        remainingFluctuation: node.attritionMeta.remainingFluctuation,
        resignationsReceived: node.attritionMeta.resignationsReceived,
        employeesAdded: node.attritionMeta.employeesAdded,
        openPositions: node.attritionMeta.openPositions,
        title: node.dimension,
        hideDetailedLeaverStats: node.attritionMeta.responseModified,
        openPositionsAvailable: true,
        heatType: HeatType.NONE,
      });
      expect(result.showAttritionRates).toBeTruthy();
      expect(result.selectedTimeRange).toEqual(timeRange);
    });
  });

  describe('mapDimensionDataToNodes', () => {
    const translations = {
      directOverall: 'directOverall',
      employees: 'employees',
      fluctuation: 'fluctuation',
      relativeFluctuation: 'relativeFluctuation',
      absoluteFluctuation: 'absoluteFluctuation',
    };

    test('should map org unit data', () => {
      const data: DimensionFluctuationData[] = [
        {
          id: '123',
          dimension: 'Hans',
          attritionMeta: {},
          managerOfOrgUnit: 'Helmut',
          parentId: service.ROOT_ID,
          directFluctuationRate: {
            fluctuationRate: 10,
            forcedFluctuationRate: 4,
            remainingFluctuationRate: 2,
            unforcedFluctuationRate: 6,
          },
          fluctuationRate: {
            fluctuationRate: 12,
            forcedFluctuationRate: 3,
            remainingFluctuationRate: 1,
            unforcedFluctuationRate: 7,
          },
          absoluteFluctuation: {
            fluctuationRate: 12,
            forcedFluctuationRate: 3,
            remainingFluctuationRate: 1,
            unforcedFluctuationRate: 7,
          },
          directAbsoluteFluctuation: {
            fluctuationRate: 10,
            forcedFluctuationRate: 4,
            remainingFluctuationRate: 2,
            unforcedFluctuationRate: 6,
          },
        } as DimensionFluctuationData,
      ];

      const result = service.mapDimensionDataToNodes(
        data,
        translations,
        FluctuationType.UNFORCED
      );

      expect(result.length).toEqual(1);
      expect(result[0]).toEqual({
        nodeId: data[0].id,
        name: data[0].managerOfOrgUnit,
        expanded: false,
        organization: data[0].dimension,
        directSubordinates: data[0].directEmployees,
        totalSubordinates: data[0].totalEmployees,
        directFluctuationRate: {
          fluctuationRate: 10,
          forcedFluctuationRate: 4,
          remainingFluctuationRate: 2,
          unforcedFluctuationRate: 6,
        },
        fluctuationRate: {
          fluctuationRate: 12,
          forcedFluctuationRate: 3,
          remainingFluctuationRate: 1,
          unforcedFluctuationRate: 7,
        },
        absoluteFluctuation: {
          fluctuationRate: 12,
          forcedFluctuationRate: 3,
          remainingFluctuationRate: 1,
          unforcedFluctuationRate: 7,
        },
        directAbsoluteFluctuation: {
          fluctuationRate: 10,
          forcedFluctuationRate: 4,
          remainingFluctuationRate: 2,
          unforcedFluctuationRate: 6,
        },
        textDirectOverall: 'directOverall',
        textEmployees: 'employees',
        textFluctuation: 'fluctuation',
        textRelativeFluctuation: 'relativeFluctuation',
        textAbsoluteFluctuation: 'absoluteFluctuation',
        heatMapClass: 'bg-secondary-900',
        showUpperParentBtn: false,
        displayedDirectFluctuationRate: 6,
        displayedTotalFluctuationRate: 7,
        displayedAbsoluteFluctuation: 7,
        displayedDirectAbsoluteFluctuation: 6,
      });
    });

    test('should sort data alphabetically', () => {
      const data: DimensionFluctuationData[] = [
        {
          id: '123',
          dimension: 'Hans',
          attritionMeta: {},
          directFluctuationRate: {
            fluctuationRate: 10,
            forcedFluctuationRate: 4,
            remainingFluctuationRate: 2,
            unforcedFluctuationRate: 6,
          },
          fluctuationRate: {
            fluctuationRate: 12,
            forcedFluctuationRate: 3,
            remainingFluctuationRate: 1,
            unforcedFluctuationRate: 7,
          },
          absoluteFluctuation: {
            fluctuationRate: 12,
            forcedFluctuationRate: 3,
            remainingFluctuationRate: 1,
            unforcedFluctuationRate: 7,
          },
          directAbsoluteFluctuation: {
            fluctuationRate: 10,
            forcedFluctuationRate: 4,
            remainingFluctuationRate: 2,
            unforcedFluctuationRate: 6,
          },
        } as DimensionFluctuationData,
        {
          id: '1234',
          dimension: 'Abel',
          attritionMeta: {},
          directFluctuationRate: {
            fluctuationRate: 10,
            forcedFluctuationRate: 4,
            remainingFluctuationRate: 2,
            unforcedFluctuationRate: 6,
          },
          fluctuationRate: {
            fluctuationRate: 12,
            forcedFluctuationRate: 3,
            remainingFluctuationRate: 1,
            unforcedFluctuationRate: 7,
          },
          absoluteFluctuation: {
            fluctuationRate: 12,
            forcedFluctuationRate: 3,
            remainingFluctuationRate: 1,
            unforcedFluctuationRate: 7,
          },
          directAbsoluteFluctuation: {
            fluctuationRate: 10,
            forcedFluctuationRate: 4,
            remainingFluctuationRate: 2,
            unforcedFluctuationRate: 6,
          },
        } as unknown as DimensionFluctuationData,
        {
          id: '12345',
          dimension: 'Georg',
          attritionMeta: {},
          directFluctuationRate: {
            fluctuationRate: 10,
            forcedFluctuationRate: 4,
            remainingFluctuationRate: 2,
            unforcedFluctuationRate: 6,
          },
          fluctuationRate: {
            fluctuationRate: 12,
            forcedFluctuationRate: 3,
            remainingFluctuationRate: 1,
            unforcedFluctuationRate: 7,
          },
          absoluteFluctuation: {
            fluctuationRate: 12,
            forcedFluctuationRate: 3,
            remainingFluctuationRate: 1,
            unforcedFluctuationRate: 7,
          },
          directAbsoluteFluctuation: {
            fluctuationRate: 10,
            forcedFluctuationRate: 4,
            remainingFluctuationRate: 2,
            unforcedFluctuationRate: 6,
          },
        } as unknown as DimensionFluctuationData,
        {
          id: '123456',
          dimension: 'Zorro',
          attritionMeta: {},
          directFluctuationRate: {
            fluctuationRate: 10,
            forcedFluctuationRate: 4,
            remainingFluctuationRate: 2,
            unforcedFluctuationRate: 6,
          },
          fluctuationRate: {
            fluctuationRate: 12,
            forcedFluctuationRate: 3,
            remainingFluctuationRate: 1,
            unforcedFluctuationRate: 7,
          },
          absoluteFluctuation: {
            fluctuationRate: 12,
            forcedFluctuationRate: 3,
            remainingFluctuationRate: 1,
            unforcedFluctuationRate: 7,
          },
          directAbsoluteFluctuation: {
            fluctuationRate: 10,
            forcedFluctuationRate: 4,
            remainingFluctuationRate: 2,
            unforcedFluctuationRate: 6,
          },
        } as unknown as DimensionFluctuationData,
      ];

      const result = service.mapDimensionDataToNodes(
        data,
        translations,
        FluctuationType.UNFORCED
      );

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
          parentId: service.ROOT_ID,
          directFluctuationRate: {
            fluctuationRate: 10,
            forcedFluctuationRate: 4,
            remainingFluctuationRate: 2,
            unforcedFluctuationRate: 6,
          },
          fluctuationRate: {
            fluctuationRate: 12,
            forcedFluctuationRate: 3,
            remainingFluctuationRate: 1,
            unforcedFluctuationRate: 7,
          },
          absoluteFluctuation: {
            fluctuationRate: 12,
            forcedFluctuationRate: 3,
            remainingFluctuationRate: 1,
            unforcedFluctuationRate: 7,
          },
          directAbsoluteFluctuation: {
            fluctuationRate: 10,
            forcedFluctuationRate: 4,
            remainingFluctuationRate: 2,
            unforcedFluctuationRate: 6,
          },
        } as unknown as DimensionFluctuationData,
      ];

      const result = service.mapDimensionDataToNodes(
        data,
        translations,
        FluctuationType.FORCED
      );

      expect(result[0].showUpperParentBtn).toBeFalsy();
    });

    test('should set showUpperButton to true if parent of one org unit is not null', () => {
      const data: DimensionFluctuationData[] = [
        {
          id: '123',
          dimension: 'Hans',
          parentId: '456',
          attritionMeta: {},
          directFluctuationRate: {
            fluctuationRate: 10,
            forcedFluctuationRate: 4,
            remainingFluctuationRate: 2,
            unforcedFluctuationRate: 6,
          },
          fluctuationRate: {
            fluctuationRate: 12,
            forcedFluctuationRate: 3,
            remainingFluctuationRate: 1,
            unforcedFluctuationRate: 7,
          },
          absoluteFluctuation: {
            fluctuationRate: 12,
            forcedFluctuationRate: 3,
            remainingFluctuationRate: 1,
            unforcedFluctuationRate: 7,
          },
          directAbsoluteFluctuation: {
            fluctuationRate: 10,
            forcedFluctuationRate: 4,
            remainingFluctuationRate: 2,
            unforcedFluctuationRate: 6,
          },
        } as unknown as DimensionFluctuationData,
      ];

      const result = service.mapDimensionDataToNodes(
        data,
        translations,
        FluctuationType.REMAINING
      );

      expect(result[0].showUpperParentBtn).toBeTruthy();
      expect(result[0].parentNodeId).toBeUndefined();
    });
  });

  describe('createOrgChartFluctuationRate', () => {
    test('should create fluctuation rate', () => {
      const data: OrgChartFluctuationRate = {
        fluctuationRate: 32,
        forcedFluctuationRate: 10,
        remainingFluctuationRate: 8,
        unforcedFluctuationRate: 22,
      };

      const result = service.createOrgChartFluctuationRate(data);

      expect(result).toEqual({
        fluctuationRate: 32,
        forcedFluctuationRate: 10,
        remainingFluctuationRate: 8,
        unforcedFluctuationRate: 22,
      });
    });
  });

  describe('updateLinkStyles', () => {
    test('should set stroke', () => {
      const highlightedLink = {
        __data__: { data: { _upToTheRootHighlighted: true } },
        setAttribute: jest.fn(),
      };
      const link = {
        __data__: { data: { _upToTheRootHighlighted: false } },
        setAttribute: jest.fn(),
      };
      const links = [highlightedLink, link];

      service.updateLinkStyles(links);

      expect(highlightedLink.setAttribute).toHaveBeenCalledWith(
        'stroke',
        service.HIGHLIGHT_COLOR
      );
      expect(highlightedLink.setAttribute).toHaveBeenCalledWith(
        'stroke-width',
        '2px'
      );
      expect(link.setAttribute).toHaveBeenCalledWith(
        'stroke',
        'rgba(0,0,0,0.11)'
      );
      expect(link.setAttribute).toHaveBeenCalledWith('stroke-width', '1px');
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
      const data: OrgChartNode = {
        showUpperParentBtn: false,
        heatMapClass: 'bg-green',
        organization: 'Schaeffler_IT',
        organizationLongName: 'Schaeffler_IT Long',
        name: 'Hans',
        dimensionKey: 'F01',
        textDirectOverall: 'Test',
        textEmployees: 'Test3',
        directSubordinates: 10,
        totalSubordinates: 200,
        textFluctuation: 'Test4',
        directFluctuationRate: {
          fluctuationRate: 10,
          forcedFluctuationRate: 4,
          remainingFluctuationRate: 2,
          unforcedFluctuationRate: 6,
        },
        fluctuationRate: {
          fluctuationRate: 12,
          forcedFluctuationRate: 3,
          remainingFluctuationRate: 1,
          unforcedFluctuationRate: 7,
        },
        absoluteFluctuation: {
          fluctuationRate: 12,
          forcedFluctuationRate: 3,
          remainingFluctuationRate: 1,
          unforcedFluctuationRate: 7,
        },
        directAbsoluteFluctuation: {
          fluctuationRate: 10,
          forcedFluctuationRate: 4,
          remainingFluctuationRate: 2,
          unforcedFluctuationRate: 6,
        },
        displayedAbsoluteFluctuation: 12,
        displayedDirectAbsoluteFluctuation: 10,
        textAbsoluteFluctuation: 'Test5',
        textRelativeFluctuation: 'Test6',
        nodeId: '1',
        parentNodeId: '12',
        expanded: true,
        displayedDirectFluctuationRate: 4,
        displayedTotalFluctuationRate: 3,
      };

      const result = service.getNodeContent(
        data,
        150,
        150,
        FilterDimension.ORG_UNIT
      );

      expect(result).not.toContain('show-parent');
      expect(result).toContain(data.name);
    });

    test('should return node content with layout for dimension org unit', () => {
      const data: OrgChartNode = {
        showUpperParentBtn: false,
        heatMapClass: 'bg-green',
        organization: 'Schaeffler_IT',
        organizationLongName: 'Schaeffler_IT Long',
        name: 'Hans',
        dimensionKey: 'F01',
        textDirectOverall: 'Test',
        textEmployees: 'Test3',
        directSubordinates: 10,
        totalSubordinates: 200,
        textFluctuation: 'Test4',
        directFluctuationRate: {
          fluctuationRate: 10,
          forcedFluctuationRate: 4,
          remainingFluctuationRate: 2,
          unforcedFluctuationRate: 6,
        },
        fluctuationRate: {
          fluctuationRate: 12,
          forcedFluctuationRate: 3,
          remainingFluctuationRate: 1,
          unforcedFluctuationRate: 7,
        },
        absoluteFluctuation: {
          fluctuationRate: 12,
          forcedFluctuationRate: 3,
          remainingFluctuationRate: 1,
          unforcedFluctuationRate: 7,
        },
        directAbsoluteFluctuation: {
          fluctuationRate: 10,
          forcedFluctuationRate: 4,
          remainingFluctuationRate: 2,
          unforcedFluctuationRate: 6,
        },
        displayedAbsoluteFluctuation: 12,
        displayedDirectAbsoluteFluctuation: 10,
        textAbsoluteFluctuation: 'Test5',
        textRelativeFluctuation: 'Test6',
        nodeId: '1',
        parentNodeId: '12',
        expanded: true,
        displayedDirectFluctuationRate: 4,
        displayedTotalFluctuationRate: 3,
      };

      const result = service.getNodeContent(
        data,
        150,
        150,
        FilterDimension.ORG_UNIT
      );

      expect(result).not.toContain('show-parent');
      expect(result).toContain(data.organization);
    });

    test('should return node content with layout for general dimensions', () => {
      const data: OrgChartNode = {
        showUpperParentBtn: false,
        heatMapClass: 'bg-green',
        organization: 'Schaeffler_IT',
        organizationLongName: 'Schaeffler_IT Long',
        name: 'Hans',
        dimensionKey: 'F01',
        textDirectOverall: 'Test',
        textEmployees: 'Test3',
        directSubordinates: 10,
        totalSubordinates: 200,
        textFluctuation: 'Test4',
        directFluctuationRate: {
          fluctuationRate: 10,
          forcedFluctuationRate: 4,
          remainingFluctuationRate: 2,
          unforcedFluctuationRate: 6,
        },
        fluctuationRate: {
          fluctuationRate: 12,
          forcedFluctuationRate: 3,
          remainingFluctuationRate: 1,
          unforcedFluctuationRate: 7,
        },
        absoluteFluctuation: {
          fluctuationRate: 12,
          forcedFluctuationRate: 3,
          remainingFluctuationRate: 1,
          unforcedFluctuationRate: 7,
        },
        directAbsoluteFluctuation: {
          fluctuationRate: 10,
          forcedFluctuationRate: 4,
          remainingFluctuationRate: 2,
          unforcedFluctuationRate: 6,
        },
        displayedAbsoluteFluctuation: 12,
        displayedDirectAbsoluteFluctuation: 10,
        textAbsoluteFluctuation: 'Test5',
        textRelativeFluctuation: 'Test6',
        nodeId: '1',
        parentNodeId: '12',
        expanded: true,
        displayedDirectFluctuationRate: 4,
        displayedTotalFluctuationRate: 3,
      };

      const result = service.getNodeContent(
        data,
        150,
        150,
        FilterDimension.SEGMENT
      );

      expect(result).not.toContain('show-parent');
      expect(result).toContain(data.organization);
    });

    test('should return node content with upwards button', () => {
      const data: OrgChartNode = {
        showUpperParentBtn: true,
        heatMapClass: 'bg-green',
        organization: 'Schaeffler_IT',
        organizationLongName: 'Schaeffler_IT Long',
        name: 'Hans',
        dimensionKey: 'F01',
        textDirectOverall: 'Test',
        textEmployees: 'Test3',
        directSubordinates: 10,
        totalSubordinates: 200,
        textFluctuation: 'Test4',
        directFluctuationRate: {
          fluctuationRate: 10,
          forcedFluctuationRate: 4,
          remainingFluctuationRate: 2,
          unforcedFluctuationRate: 6,
        },
        fluctuationRate: {
          fluctuationRate: 12,
          forcedFluctuationRate: 3,
          remainingFluctuationRate: 1,
          unforcedFluctuationRate: 7,
        },
        absoluteFluctuation: {
          fluctuationRate: 12,
          forcedFluctuationRate: 3,
          remainingFluctuationRate: 1,
          unforcedFluctuationRate: 7,
        },
        directAbsoluteFluctuation: {
          fluctuationRate: 10,
          forcedFluctuationRate: 4,
          remainingFluctuationRate: 2,
          unforcedFluctuationRate: 6,
        },
        displayedAbsoluteFluctuation: 12,
        displayedDirectAbsoluteFluctuation: 10,
        textAbsoluteFluctuation: 'Test5',
        textRelativeFluctuation: 'Test6',
        nodeId: '1',
        parentNodeId: '12',
        expanded: true,
        displayedDirectFluctuationRate: 4,
        displayedTotalFluctuationRate: 3,
      };

      const result = service.getNodeContent(
        data,
        150,
        150,
        FilterDimension.ORG_UNIT
      );

      expect(result).toContain('show-parent');
      expect(result).toContain(data.organization);
    });
  });

  describe('getGeneralDimensionGrid', () => {
    test('should correct data', () => {
      const data = {
        textEmployees: 'test row emp',
        directSubordinates: 99,
        textFluctuation: 'text row attr',
        directAttrition: 200,
      } as any;

      const result = service.getGeneralNodeContent(data, 100, 100);

      expect(result).toContain(data.textEmployees);
      expect(result).toContain(`${data.directSubordinates}`);
      expect(result).toContain(data.textFluctuation);
      expect(result).toContain(`${data.directAttrition}`);
      expect(result).toContain(`id="${BUTTON_CSS.people}"`);
      expect(result).toContain(`id="${BUTTON_CSS.attrition}"`);
    });
  });

  describe('getOrgUnitNodeContent', () => {
    test('should correct data', () => {
      const data: OrgChartNode = {
        textDirectOverall: 'text column direct',
        textEmployees: 'test row emp',
        directSubordinates: 99,
        totalSubordinates: 99,
        textFluctuation: 'text row attr',
        directFluctuationRate: {
          fluctuationRate: 10,
          forcedFluctuationRate: 4,
          remainingFluctuationRate: 2,
          unforcedFluctuationRate: 6,
        },
        fluctuationRate: {
          fluctuationRate: 12,
          forcedFluctuationRate: 3,
          remainingFluctuationRate: 1,
          unforcedFluctuationRate: 7,
        },
        displayedDirectFluctuationRate: 10,
        displayedTotalFluctuationRate: 12,
      } as OrgChartNode;

      const result = service.getOrgUnitNodeContent(data, 100, 100);

      expect(result).toContain(data.textEmployees);
      expect(result).toContain(`${data.directSubordinates}`);
      expect(result).toContain(`${data.totalSubordinates}`);
      expect(result).toContain(data.textFluctuation);
      expect(result).toContain(`${data.directFluctuationRate.fluctuationRate}`);
      expect(result).toContain(`${data.fluctuationRate.fluctuationRate}`);
      expect(result).toContain(`id="${BUTTON_CSS.people}"`);
      expect(result).toContain(`id="${BUTTON_CSS.attrition}"`);
    });
  });

  describe('setFluctuationRatesToDisplay', () => {
    let chartData: OrgChartNode[];

    beforeEach(() => {
      chartData = [
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

    test('should set total as displayed fluctuation rate', () => {
      service.setFluctuationRatesToDisplay(chartData, FluctuationType.TOTAL);

      expect(chartData[0].displayedTotalFluctuationRate).toEqual(123);
      expect(chartData[0].displayedDirectFluctuationRate).toEqual(321);
      expect(chartData[0].displayedAbsoluteFluctuation).toEqual(789);
      expect(chartData[0].displayedDirectAbsoluteFluctuation).toEqual(903);
    });

    test('should set unforced as displayed fluctuation rate', () => {
      service.setFluctuationRatesToDisplay(chartData, FluctuationType.UNFORCED);

      expect(chartData[0].displayedTotalFluctuationRate).toEqual(234);
      expect(chartData[0].displayedDirectFluctuationRate).toEqual(432);
      expect(chartData[0].displayedAbsoluteFluctuation).toEqual(890);
      expect(chartData[0].displayedDirectAbsoluteFluctuation).toEqual(904);
    });

    test('should set forced as displayed fluctuation rate', () => {
      service.setFluctuationRatesToDisplay(chartData, FluctuationType.FORCED);

      expect(chartData[0].displayedTotalFluctuationRate).toEqual(345);
      expect(chartData[0].displayedDirectFluctuationRate).toEqual(543);
      expect(chartData[0].displayedAbsoluteFluctuation).toEqual(901);
      expect(chartData[0].displayedDirectAbsoluteFluctuation).toEqual(905);
    });

    test('should set remaining as displayed fluctuation rate', () => {
      service.setFluctuationRatesToDisplay(
        chartData,
        FluctuationType.REMAINING
      );

      expect(chartData[0].displayedTotalFluctuationRate).toEqual(456);
      expect(chartData[0].displayedDirectFluctuationRate).toEqual(654);
      expect(chartData[0].displayedAbsoluteFluctuation).toEqual(902);
      expect(chartData[0].displayedDirectAbsoluteFluctuation).toEqual(906);
    });
  });
});
