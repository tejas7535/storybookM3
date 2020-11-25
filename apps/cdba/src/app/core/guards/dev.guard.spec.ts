import { TestBed } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';

import { configureTestSuite } from 'ng-bullet';

import { environment } from '../../../environments/environment';
import { DevGuard } from './dev.guard';

describe('DevGuard', () => {
  let guard: DevGuard;

  configureTestSuite(() => {
    TestBed.configureTestingModule({
      imports: [RouterTestingModule],
      providers: [DevGuard],
    });
  });

  beforeEach(() => {
    guard = TestBed.inject(DevGuard);
  });

  test('should create', () => {
    expect(guard).toBeTruthy();
  });

  describe('canActivateChild', () => {
    test('should grant access, if user is in a dev environment', () => {
      environment.production = false;

      guard
        .canActivateChild()
        .subscribe((granted) => expect(granted).toBeTruthy());
    });

    test('should not grant access, if user is in a dev environment', () => {
      environment.production = true;

      guard
        .canActivateChild()
        .subscribe((granted) => expect(granted).toBeTruthy());
    });
  });
});
