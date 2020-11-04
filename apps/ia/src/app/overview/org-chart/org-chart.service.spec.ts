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
        new Employee('123', undefined, 'ABC', 'Hans', 0, 0, 0),
      ];

      const result = service.mapEmployeesToNodes(data);

      expect(result.length).toEqual(1);
      expect(result[0].template).toContain(data[0].name);
    });
  });
});
