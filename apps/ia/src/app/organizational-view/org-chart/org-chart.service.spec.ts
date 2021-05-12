import { createServiceFactory, SpectatorService } from '@ngneat/spectator/jest';

import { HeatType } from '../models/heat-type.enum';
import { OrgChartEmployee } from './models/org-chart-employee.model';
import { OrgChartService } from './org-chart.service';

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
      const data: OrgChartEmployee[] = [
        {
          employeeId: '123',
          employeeName: 'Hans',
          attritionMeta: {},
        } as unknown as OrgChartEmployee,
      ];

      const result = service.mapEmployeesToNodes(data);

      expect(result.length).toEqual(1);
      expect(result[0].template).toContain(data[0].employeeName);
    });

    test('should include heat map info', () => {
      const data: OrgChartEmployee[] = [
        {
          employeeId: '123',
          parentEmployeeId: undefined,
          employeeName: 'Hans',
          attritionMeta: {
            attritionRate: 0.1,
          },
        } as unknown as OrgChartEmployee,
        {
          employeeId: '456',
          parentEmployeeId: '123',
          employeeName: 'Hans2',
          attritionMeta: {
            attritionRate: 0.09,
            heatType: HeatType.GREEN_HEAT,
          },
        } as unknown as OrgChartEmployee,
        {
          employeeId: '789',
          parentEmployeeId: '123',
          employeeName: 'Hans3',
          attritionMeta: {
            attritionRate: 0.12,
            heatType: HeatType.ORANGE_HEAT,
          },
        } as unknown as OrgChartEmployee,
        {
          employeeId: '999',
          parentEmployeeId: '123',
          employeeName: 'Hans4',
          attritionMeta: {
            attritionRate: 0.5,
            heatType: HeatType.RED_HEAT,
          },
        } as unknown as OrgChartEmployee,
      ];

      const result = service.mapEmployeesToNodes(data);

      expect(result.length).toEqual(4);
      expect(result[1].template).toContain('green-heat');
      expect(result[2].template).toContain('orange-heat');
      expect(result[3].template).toContain('red-heat');
    });
  });
});
