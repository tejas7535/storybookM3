import {
  HttpClientTestingModule,
  HttpTestingController
} from '@angular/common/http/testing';
import { getTestBed, TestBed } from '@angular/core/testing';

import { configureTestSuite } from 'ng-bullet';

import { TaggingService } from './tagging.service';

import { InputText } from './models';

describe('TaggingService', () => {
  let injector: TestBed;
  let service: TaggingService;
  let httpMock: HttpTestingController;

  configureTestSuite(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [TaggingService]
    });
  });

  beforeEach(() => {
    injector = getTestBed();
    service = injector.get(TaggingService);
    httpMock = injector.get(HttpTestingController);
  });

  afterEach(() => {
    httpMock.verify();
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  describe('getTags()', () => {
    test('should post text and map tags', () => {
      const text = 'Get me some tags please.';
      const expectedTags = ['First', 'Tag', 'Artificial'];
      const url = 'https://dev.sta.dp.schaeffler/api/v1/tagging';

      service
        .getTags(new InputText(text))
        .subscribe((tags: string[]) => expect(tags).toEqual(expect));

      const req = httpMock.expectOne(url);
      expect(req.request.method).toBe('POST');
      req.flush({ text });
    });
  });
});
