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

import { SharedTranslocoModule } from '@schaeffler/transloco';

import { HttpLocaleInterceptor } from './http-locale.interceptor';

@Injectable()
class ExampleService {
  private readonly apiUrl = environment.baseUrl;

  constructor(private readonly http: HttpClient) {}

  public getPosts(): Observable<string> {
    return this.http.get<string>(`${this.apiUrl}/test`);
  }

  public getMessage(): Observable<string> {
    return this.http.get<string>('someOtherUrl/message');
  }
}

describe(`HttpLocaleInterceptor`, () => {
  let service: ExampleService;
  let spectator: SpectatorService<ExampleService>;
  let httpMock: HttpTestingController;

  const createService = createServiceFactory({
    service: ExampleService,
    imports: [
      HttpClientTestingModule,
      // Translation
      SharedTranslocoModule.forRoot(
        true,
        [
          { id: 'de', label: 'Deutsch' },
          { id: 'en', label: 'English' },
          { id: 'es', label: 'Español' },
          { id: 'fr', label: 'Français' },
          { id: 'ru', label: 'русский' },
          { id: 'zh', label: '中文' },
        ],
        'en', // default -> undefined would lead to browser detection
        'en',
        'language',
        true,
        false
      ),
    ],
    providers: [
      ExampleService,
      {
        provide: HTTP_INTERCEPTORS,
        useClass: HttpLocaleInterceptor,
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
    it('should not adjust header attributes for non based URLs', waitForAsync(() => {
      service.getMessage().subscribe((response: any) => {
        expect(response).toBeTruthy();
      });

      const httpRequest = httpMock.expectOne('someOtherUrl/message');
      expect(httpRequest.request.headers.get('Locale')).toBeNull();
    }));

    it('should change locale header attribute', waitForAsync(() => {
      service.getPosts().subscribe((response: any) => {
        expect(response).toBeTruthy();
      });
      const httpRequest = httpMock.expectOne(`${environment.baseUrl}/test`);
      expect(httpRequest.request.headers.get('Locale')).toBeDefined();
    }));
  });
});
