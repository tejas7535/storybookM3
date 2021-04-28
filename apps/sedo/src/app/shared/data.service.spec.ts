import {
  HttpClientTestingModule,
  HttpTestingController,
} from '@angular/common/http/testing';
import { waitForAsync } from '@angular/core/testing';

import { createServiceFactory, SpectatorService } from '@ngneat/spectator/jest';

import { environment } from '../../environments/environment';
import { salesSummaryMock } from '../../testing/mocks/sales-summary.mock';
import { DataService } from './data.service';
import { UpdateDatesParams } from './models/dates-update.model';

describe('DataService', () => {
  let dataService: DataService;
  let spectator: SpectatorService<DataService>;
  let httpMock: HttpTestingController;

  const createService = createServiceFactory({
    service: DataService,
    imports: [HttpClientTestingModule],
    providers: [DataService],
  });

  beforeEach(() => {
    spectator = createService();
    dataService = spectator.service;
    httpMock = spectator.inject(HttpTestingController);
  });

  it('should be created', () => {
    expect(dataService).toBeTruthy();
  });

  describe('updateDates', () => {
    it(
      'getAllSales',
      waitForAsync(() => {
        const url = `${environment.apiBaseUrl}/sales/all`;

        dataService.getAllSales().then((result) => {
          expect(result).toEqual([salesSummaryMock]);
        });

        const req = httpMock.expectOne(url);
        expect(req.request.method).toBe('GET');
        req.flush([salesSummaryMock]);
      })
    );
  });

  describe('updateDates', () => {
    it('should resolve', () => {
      const updateDates = new UpdateDatesParams('key', 'date1', 'date2');

      const url = `${environment.apiBaseUrl}/sales/update-dates`;

      expect(dataService.updateDates(updateDates)).resolves.not.toThrow();

      const req = httpMock.expectOne(url);
      expect(req.request.method).toBe('PUT');
      req.flush({});
    });
  });
});
