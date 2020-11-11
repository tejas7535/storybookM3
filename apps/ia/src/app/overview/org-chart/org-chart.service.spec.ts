import { createServiceFactory, SpectatorService } from '@ngneat/spectator';

import { Employee } from '../../shared/models';
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
      const data: Employee[] = [
        ({
          employeeId: '123',
          employeeName: 'Hans',
        } as unknown) as Employee,
      ];

      const result = service.mapEmployeesToNodes(data);

      expect(result.length).toEqual(1);
      expect(result[0].template).toContain(data[0].employeeName);
    });
  });
});
