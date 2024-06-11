import { HTTP_INTERCEPTORS, HttpClient } from '@angular/common/http';
import {
  HttpClientTestingModule,
  HttpTestingController,
} from '@angular/common/http/testing';
import { Injectable } from '@angular/core';
import { waitForAsync } from '@angular/core/testing';

import { Observable } from 'rxjs';

import { environment } from '@mm/environments/environment';
import { createServiceFactory, SpectatorService } from '@ngneat/spectator/jest';
import { MockModule } from 'ng-mocks';

import { SharedTranslocoModule } from '@schaeffler/transloco';

import { HttpHostMappingInterceptor } from './http-host-mapping.interceptor';

@Injectable()
class ExampleService {
  private readonly apiUrl = environment.baseUrl;
  private readonly wrongUrl = 'http://10.0.1.22:80/MountingManager/v1';

  constructor(private readonly http: HttpClient) {}

  public getPosts(): Observable<string> {
    return this.http.get<string>(`${this.apiUrl}/test`);
  }

  public getReportPdf(): Observable<string> {
    return this.http.get<string>(`${this.wrongUrl}/report`);
  }
}

describe(`HttpHostMappingInterceptor`, () => {
  let service: ExampleService;
  let spectator: SpectatorService<ExampleService>;
  let httpMock: HttpTestingController;

  const createService = createServiceFactory({
    service: ExampleService,
    imports: [HttpClientTestingModule, MockModule(SharedTranslocoModule)],
    providers: [
      ExampleService,
      {
        provide: HTTP_INTERCEPTORS,
        useClass: HttpHostMappingInterceptor,
        multi: true,
      },
    ],
  });

  beforeEach(() => {
    spectator = createService();
    service = spectator.service;
    httpMock = spectator.inject(HttpTestingController);
  });

  it('should be truthy', () => {
    expect(service).toBeTruthy();
  });

  describe('intercept', () => {
    it('should not adjust request URLs', waitForAsync(() => {
      service.getPosts().subscribe((response: any) => {
        expect(response).toBeTruthy();
      });

      const httpRequest = httpMock.expectOne(`${environment.baseUrl}/test`);

      expect(httpRequest.request.url).toBe(`${environment.baseUrl}/test`);
    }));

    it('should replace wrong url with environment base one', waitForAsync(() => {
      service.getReportPdf().subscribe((response: any) => {
        expect(response).toBeTruthy();
      });
      const httpRequest = httpMock.expectOne(`${environment.baseUrl}/report`);
      expect(httpRequest).toBeTruthy();
    }));
  });
});
