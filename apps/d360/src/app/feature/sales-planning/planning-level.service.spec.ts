import { take } from 'rxjs';

import {
  createHttpFactory,
  HttpMethod,
  SpectatorHttp,
} from '@ngneat/spectator/jest';

import { PlanningLevelMaterial } from './model';
import { PlanningLevelService } from './planning-level.service';

describe('PlanningLevelService', () => {
  let spectator: SpectatorHttp<PlanningLevelService>;

  const createService = createHttpFactory({
    service: PlanningLevelService,
  });

  beforeEach(() => {
    spectator = createService();
  });

  it('should fetch material type by customer number', (done) => {
    const mockData: PlanningLevelMaterial = {
      customerNumber: '1230',
      planningLevelMaterialType: 'PL',
      isDefaultPlanningLevelMaterialType: true,
    };
    const customerNumber = '12345';

    spectator.service
      .getMaterialTypeByCustomerNumber(customerNumber)
      .pipe(take(1))
      .subscribe((data) => {
        expect(data).toEqual(mockData);
        done();
      });

    spectator
      .expectOne(
        `api/sales-planning/planning-level?customerNumber=${customerNumber}`,
        HttpMethod.GET
      )
      .flush(mockData);
  });

  it('should delete material type by customer number', (done) => {
    const customerNumber = '12345';

    spectator.service
      .deleteMaterialTypeByCustomerNumber(customerNumber)
      .pipe(take(1))
      .subscribe((response) => {
        expect(response).toBeNull();
        done();
      });

    spectator
      .expectOne(
        `api/sales-planning/planning-level?customerNumber=${customerNumber}`,
        HttpMethod.DELETE
      )
      .flush(null);
  });
});
