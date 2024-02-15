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

  describe('getRectBorderStyles', () => {
    test('should get highlighted border when node is highlighted up to the root', () => {
      const data = { _upToTheRootHighlighted: true };

      const result = service.getRectBorderStyles(data);

      expect(result).toEqual(`border: 2px solid ${service.HIGHLIGHT_COLOR}`);
    });

    test('should get highlighted border when single node is highlighted', () => {
      const data = { _highlighted: true };

      const result = service.getRectBorderStyles(data);

      expect(result).toEqual(`border: 2px solid ${service.HIGHLIGHT_COLOR}`);
    });

    test('should get normal border when node is not highlighted', () => {
      const data = { _upToTheRootHighlighted: false };

      const result = service.getRectBorderStyles(data);

      expect(result).toEqual(`border: 1px solid rgba(0, 0, 0, 0.32)`);
    });
  });

  describe('getHeaderBorderStyles', () => {
    test('should get highlighted border when node is highlighted up to the root', () => {
      const data = { _upToTheRootHighlighted: true };

      const result = service.getHeaderBorderStyles(data);

      expect(result).toEqual(`border: 1px solid ${service.HIGHLIGHT_COLOR}`);
    });

    test('should get highlighted border when single node is highlighted', () => {
      const data = { _highlighted: true };

      const result = service.getHeaderBorderStyles(data);

      expect(result).toEqual(`border: 1px solid ${service.HIGHLIGHT_COLOR}`);
    });

    test('should unset border when node is not highlighted', () => {
      const data = { _upToTheRootHighlighted: false };

      const result = service.getHeaderBorderStyles(data);

      expect(result).toEqual(`border: none`);
    });
  });

  describe('getPeopleIconSvg', () => {
    test('should get people icon svg', () => {
      const nodeId = 'people-icon';

      const result = service.getPeopleIconSvg(nodeId);

      expect(result).toContain(
        `d="M7.82663 5.33331C7.82663 6.43998 6.93996 7.33331 5.83329 7.33331C4.72663 7.33331 3.83329 6.43998 3.83329 5.33331C3.83329 4.22665 4.72663 3.33331 5.83329 3.33331C6.93996 3.33331 7.82663 4.22665 7.82663 5.33331ZM13.16 5.33331C13.16 6.43998 12.2733 7.33331 11.1666 7.33331C10.06 7.33331 9.16663 6.43998 9.16663 5.33331C9.16663 4.22665 10.06 3.33331 11.1666 3.33331C12.2733 3.33331 13.16 4.22665 13.16 5.33331ZM5.83329 8.66665C4.27996 8.66665 1.16663 9.44665 1.16663 11V12.6666H10.5V11C10.5 9.44665 7.38663 8.66665 5.83329 8.66665ZM10.52 8.69998C10.7533 8.67998 10.9733 8.66665 11.1666 8.66665C12.72 8.66665 15.8333 9.44665 15.8333 11V12.6666H11.8333V11C11.8333 10.0133 11.2933 9.25998 10.52 8.69998Z"`
      );
      expect(result).toContain(nodeId);
      expect(result).toContain('group-hover:fill-primary');
    });
  });

  describe('getFluctuationIconSvg', () => {
    test('should get fluctuation icon svg', () => {
      const nodeId = 'fluctuation-icon';

      const result = service.getFluctuationIconSvg(nodeId);

      expect(result).toContain(
        `d="M3.33333 2H12.6667C13.4 2 14 2.6 14 3.33333V12.6667C14 13.4 13.4 14 12.6667 14H3.33333C2.6 14 2 13.4 2 12.6667V3.33333C2 2.6 2.6 2 3.33333 2ZM4.66667 11.3333H6V6.66667H4.66667V11.3333ZM8.66667 11.3333H7.33333V4.66667H8.66667V11.3333ZM10 11.3333H11.3333V8.66667H10V11.3333Z"`
      );
      expect(result).toContain(nodeId);
      expect(result).toContain('group-hover:fill-primary');
    });
  });
});
