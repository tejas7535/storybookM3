import { TestBed } from '@angular/core/testing';

import { ParamsCreatorService } from './params-creator.service';

describe('ParamsCreatorService', () => {
  let service: ParamsCreatorService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ParamsCreatorService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
