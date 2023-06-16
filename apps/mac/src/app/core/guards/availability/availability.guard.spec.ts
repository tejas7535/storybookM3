import { HttpResponse } from '@angular/common/http';
import {
  HttpClientTestingModule,
  HttpTestingController,
} from '@angular/common/http/testing';
import { ActivatedRouteSnapshot, Router } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';

import { createServiceFactory, SpectatorService } from '@ngneat/spectator/jest';

import { AvailabityGuard } from '@mac/core/guards';

describe('AvailabilityGuard', () => {
  let spectator: SpectatorService<AvailabityGuard>;
  let guard: AvailabityGuard;
  let httpMock: HttpTestingController;
  let router: Router;

  const mockBaseRoute: ActivatedRouteSnapshot = {
    path: 'some-path',
  } as unknown as ActivatedRouteSnapshot;

  const mockAvailabilityRoute: ActivatedRouteSnapshot = {
    ...mockBaseRoute,
    data: {
      availabilityCheck: {
        basePath: 'base',
        path: 'app',
        availabilityCheckUrl: 'some-url',
        isEmptyState: false,
      },
    },
  } as unknown as ActivatedRouteSnapshot;

  const mockEmptyStateRoute: ActivatedRouteSnapshot = {
    ...mockBaseRoute,
    data: {
      availabilityCheck: {
        basePath: 'base',
        path: 'app',
        availabilityCheckUrl: 'some-url',
        isEmptyState: true,
      },
    },
  } as unknown as ActivatedRouteSnapshot;

  const createService = createServiceFactory({
    service: AvailabityGuard,
    imports: [RouterTestingModule, HttpClientTestingModule],
  });

  beforeEach(() => {
    spectator = createService();
    guard = spectator.inject(AvailabityGuard);
    httpMock = spectator.inject(HttpTestingController);
    router = spectator.inject(Router);

    router.navigate = jest.fn();
  });

  test('should create', () => {
    expect(guard).toBeTruthy();
  });

  describe('canActivate', () => {
    it('should grant access, if service is available', (done) => {
      guard.canActivate(mockAvailabilityRoute).subscribe((result) => {
        expect(result).toBe(true);
        expect(router.navigate).not.toHaveBeenCalled();
        done();
      });
      const response = new HttpResponse({ status: 200 });

      const req = httpMock.expectOne(`${guard['BASE_URL']}some-url`);
      expect(req.request.method).toEqual('GET');
      req.flush(response);
    });

    it('should grant access and navigate, if service is not available and not emptyState', (done) => {
      guard.canActivate(mockAvailabilityRoute).subscribe((result) => {
        expect(result).toBe(true);
        expect(router.navigate).toHaveBeenCalledWith([
          `base${guard['MAINTENANCE_PATH']}`,
        ]);
        done();
      });

      const req = httpMock.expectOne(`${guard['BASE_URL']}some-url`);
      expect(req.request.method).toEqual('GET');
      req.error(new ProgressEvent('error'));
    });

    it('should grant access and navigate, if service is available in emptyState', (done) => {
      guard.canActivate(mockEmptyStateRoute).subscribe((result) => {
        expect(result).toBe(true);
        expect(router.navigate).toHaveBeenCalledWith(['base/app']);
        done();
      });
      const response = new HttpResponse({ status: 200 });

      const req = httpMock.expectOne(`${guard['BASE_URL']}some-url`);
      expect(req.request.method).toEqual('GET');
      req.flush(response);
    });

    it('should grant access, if service is not available and in emptyState', (done) => {
      guard.canActivate(mockEmptyStateRoute).subscribe((result) => {
        expect(result).toBe(true);
        expect(router.navigate).not.toHaveBeenCalled();
        done();
      });

      const req = httpMock.expectOne(`${guard['BASE_URL']}some-url`);
      expect(req.request.method).toEqual('GET');
      req.error(new ProgressEvent('error'));
    });
  });
});
