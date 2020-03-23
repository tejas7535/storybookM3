import {
  HttpClientTestingModule,
  HttpTestingController
} from '@angular/common/http/testing';
import { getTestBed, TestBed } from '@angular/core/testing';
import { provideTranslocoTestingModule } from '@schaeffler/shared/transloco';

import { configureTestSuite } from 'ng-bullet';

import { FunFactsLoadingBarService } from './fun-facts-loading-bar.service';

describe('FunFactsLoadingBarService', () => {
  let service: FunFactsLoadingBarService;
  let injector: TestBed;
  let httpMock: HttpTestingController;

  configureTestSuite(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule, provideTranslocoTestingModule({})],
      providers: [FunFactsLoadingBarService]
    });
  });

  beforeEach(() => {
    injector = getTestBed();
    httpMock = injector.inject(HttpTestingController);
    service = injector.inject(FunFactsLoadingBarService);
  });

  afterEach(() => {
    httpMock.verify();
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  describe('getFunFact', () => {
    test('should return response as promise', () => {
      const expcetedFunFact = 'abc fact';
      const url =
        'https://sta-d.dev.dp.schaeffler/api/v1/fun-facts?language=en';
      service.getFunFact().subscribe(funFact => {
        expect(funFact).toEqual(expcetedFunFact);
      });

      const req = httpMock.expectOne(url);
      expect(req.request.method).toBe('GET');
      req.flush({ funFact: expcetedFunFact });
    });
  });
});
