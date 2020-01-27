import {
  HttpClientTestingModule,
  HttpTestingController
} from '@angular/common/http/testing';
import { getTestBed, TestBed } from '@angular/core/testing';

import { configureTestSuite } from 'ng-bullet';

import { RestService } from './rest.service';

import { Extension } from '../../home/extension/extension.model';

describe('RestService', () => {
  let myProvider: RestService;
  let httpMock: HttpTestingController;

  configureTestSuite(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [RestService]
    });

    const testBed = getTestBed();
    myProvider = testBed.get(RestService);
    httpMock = testBed.get(HttpTestingController);
  });

  afterEach(() => {
    httpMock.verify();
  });

  it('should be created', () => {
    expect(myProvider).toBeTruthy();
  });

  describe('getExtensions', () => {
    it('should return an Observable<Extensions[]>', () => {
      const mockedExtensions: Extension[] = [
        {
          name: 'Live Refresh',
          description:
            'Allows for continous live refresh in of live data connections in Tableau',
          WIP: false
        },
        {
          name: 'Save Filter',
          description: 'Will allow to store your filter settings',
          WIP: true
        }
      ];

      myProvider.getExtensions().subscribe(models => {
        expect(models.length).toBe(2);
        expect(models).toEqual(mockedExtensions);
      });

      const req = httpMock.expectOne(`assets/extensions.json`);
      expect(req.request.method).toBe('GET');
      req.flush(mockedExtensions);
    });
  });
});
