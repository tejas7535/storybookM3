import { HttpClient } from '@angular/common/http';
import {
  HttpClientTestingModule,
  HttpTestingController,
} from '@angular/common/http/testing';
import { waitForAsync } from '@angular/core/testing';

import { of } from 'rxjs';

import { createServiceFactory, SpectatorService } from '@ngneat/spectator/jest';

import { environment } from '../../../../environments/environment';
import { salesSummaryMock } from '../../../../testing/mocks/sales-summary.mock';
import { IgnoreFlag } from '../../../sales-summary/sales-row-details/enums/ignore-flag.enum';
import { UpdateDatesParams } from '../../models/dates-update.model';
import { UpdateIgnoreFlagParams } from '../../models/ignore-flag-update.model';
import { DataService } from './data.service';

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
    it('should get all sales data', waitForAsync(() => {
      const url = `${environment.apiBaseUrl}/sales/all-with-key-users`;

      dataService.getAllSales().then((result) => {
        expect(result).toEqual([salesSummaryMock]);
      });

      const req = httpMock.expectOne(url);
      expect(req.request.method).toBe('GET');
      req.flush([salesSummaryMock]);
    }));
  });

  describe('getSuperUser', () => {
    it('should return the superuser', waitForAsync(() => {
      const url = `${environment.apiBaseUrl}/sales/super-user`;

      dataService.getSuperUser().then((result) => {
        expect(result).toEqual('superUser');
      });

      const req = httpMock.expectOne(url);
      expect(req.request.method).toBe('GET');
      req.flush('superUser');
    }));
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

  describe('updateIgnoreFlag', () => {
    it('should resolve', async () => {
      const updateIgnoreFlagParams = new UpdateIgnoreFlagParams(
        '123',
        IgnoreFlag.CustomerNumberChange
      );
      httpClient.put = jest.fn().mockReturnValue(of({}));

      const url = `${environment.apiBaseUrl}/sales/update-ignore-flag`;
      await dataService.updateIgnoreFlag(updateIgnoreFlagParams);

      expect(httpClient.put).toHaveBeenCalledTimes(1);
      expect(httpClient.put).toHaveBeenCalledWith(url, updateIgnoreFlagParams);
    });
  });
});
