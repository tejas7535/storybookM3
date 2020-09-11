import { TestBed } from '@angular/core/testing';

import { SearchService } from './search.service';

describe('SearchService', (): void => {
  let service: SearchService;

  beforeEach((): void => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(SearchService);
  });

  test('should be created', (): void => {
    expect(service).toBeTruthy();
  });
});
