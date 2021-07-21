import { HttpClient } from '@angular/common/http';
import {
  HttpClientTestingModule,
  HttpTestingController,
} from '@angular/common/http/testing';
import { waitForAsync } from '@angular/core/testing';

import { of } from 'rxjs';

import { createServiceFactory, SpectatorService } from '@ngneat/spectator/jest';

import { environment } from '../../environments/environment';
import { salesSummaryMock } from '../../testing/mocks/sales-summary.mock';
import { DataService } from './data.service';
import { UpdateDatesParams } from './models/dates-update.model';

describe('DataService', () => {
  let dataService: DataService;
  let spectator: SpectatorService<DataService>;
  let httpMock: HttpTestingController;
  let httpClient: HttpClient;

  const createService = createServiceFactory({
    service: DataService,
    imports: [HttpClientTestingModule],
    providers: [DataService],
  });

  beforeEach(() => {
    spectator = createService();
    dataService = spectator.service;
    httpMock = spectator.inject(HttpTestingController);
    httpClient = spectator.inject(HttpClient);
  });

  it('should be created', () => {
    expect(dataService).toBeTruthy();
  });

  describe('getAllSales', () => {
    it(
      'should get all sales data',
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
    it('should resolve', async () => {
      const updateDates = new UpdateDatesParams('key', 'date1', 'date2');
      httpClient.put = jest.fn().mockReturnValue(of({}));

      const url = `${environment.apiBaseUrl}/sales/update-dates`;
      await dataService.updateDates(updateDates);

      expect(httpClient.put).toHaveBeenCalledTimes(1);
      expect(httpClient.put).toHaveBeenCalledWith(url, updateDates);
    });
  });
});
