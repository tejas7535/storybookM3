import { skip } from 'rxjs/operators';

import {
  HttpClientTestingModule,
  HttpTestingController
} from '@angular/common/http/testing';
import { getTestBed, TestBed } from '@angular/core/testing';

import { configureTestSuite } from 'ng-bullet';

import { DataService } from './data.service';

describe('DataService', () => {
  let injector: TestBed;
  let service: DataService;
  let httpMock: HttpTestingController;

  configureTestSuite(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [DataService]
    });
  });

  beforeEach(() => {
    injector = getTestBed();
    service = injector.get(DataService);
    httpMock = injector.get(HttpTestingController);
  });

  afterEach(() => {
    httpMock.verify();
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  describe('Getter tags', () => {
    test('should be defined', () => {
      expect(service.tags).toBeDefined();
    });
  });

  describe('postTaggingText', () => {
    test('should get tags from server', () => {
      const text = 'Get me some tags please.';
      const expectedTags = ['First', 'Tag', 'Artificial'];
      const url = 'https://dev.sta.dp.schaeffler/api/v1/tagging/text';

      service.tags.pipe(skip(1)).subscribe(newTags => {
        expect(newTags).toEqual(expectedTags);
      });

      service.postTaggingText(text);
      const req = httpMock.expectOne(url);
      expect(req.request.method).toBe('POST');
      req.flush({ tags: expectedTags });
    });
  });

  describe('isDataAvailable', () => {
    test('should return true when tags are there', done => {
      service['tags$'].next(['tags']);
      service.isDataAvailable().subscribe(isDataAvl => {
        expect(isDataAvl).toBeTruthy();
        done();
      });
    });

    test('should return false when no tags avl', done => {
      service.isDataAvailable().subscribe(isDataAvl => {
        expect(isDataAvl).toBeFalsy();
        done();
      });
    });
  });

  describe('isInitialEmptyState', () => {
    beforeEach(() => {
      service['tags$'].next(undefined);
    });

    test('should return true when initialState', done => {
      service.isInitialEmptyState().subscribe(isInitial => {
        expect(isInitial).toBeTruthy();
        done();
      });
    });

    test('should return false when initialState already changed', done => {
      service['tags$'].next(['tags']);
      service.isInitialEmptyState().subscribe(isInitial => {
        expect(isInitial).toBeFalsy();
        done();
      });
    });
  });
});
