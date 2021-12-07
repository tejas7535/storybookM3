import { TestBed } from '@angular/core/testing';

import { RouteNames } from '../../../app-routing.enum';
import { BreadcrumbsService } from './breadcrumbs.service';

describe('BreadcrumbsService', () => {
  let service: BreadcrumbsService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(BreadcrumbsService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should update the current breadcrumb', () => {
    const newPosition = RouteNames.HardnessConverter;
    service.currentBreadcrumbs.subscribe((breadcrumb) => {
      expect(breadcrumb[1].label).toEqual(newPosition);
    });

    service.updateBreadcrumb(newPosition);
  });
});
