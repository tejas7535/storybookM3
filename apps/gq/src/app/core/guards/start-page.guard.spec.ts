import { RouterModule } from '@angular/router';

import { BehaviorSubject } from 'rxjs';

import {
  createServiceFactory,
  mockProvider,
  SpectatorService,
} from '@ngneat/spectator/jest';

import { RolesFacade } from '../store/facades';
import { StartPageGuard } from './start-page.guard';

describe('StartPageGuard', () => {
  let guard: StartPageGuard;
  // let store: MockStore;
  let spectator: SpectatorService<StartPageGuard>;
  const isCalcSubject$$: BehaviorSubject<boolean> =
    new BehaviorSubject<boolean>(false);
  const isSalesUserSubject$$: BehaviorSubject<boolean> =
    new BehaviorSubject<boolean>(false);

  const createService = createServiceFactory({
    service: StartPageGuard,
    imports: [RouterModule.forRoot([])],
    providers: [
      mockProvider(RolesFacade, {
        userIsCalculator$: isCalcSubject$$.asObservable(),
        userIsSalesUser$: isSalesUserSubject$$.asObservable(),
      }),
    ],
  });

  beforeEach(() => {
    spectator = createService();
    guard = spectator.inject(StartPageGuard);
  });

  test('should be created', () => {
    expect(guard).toBeTruthy();
  });
  describe('canActivate', () => {
    test('should navigate to Forbidden path when neither SalesUser nor Calculator', () => {
      isCalcSubject$$.next(false);
      isSalesUserSubject$$.next(false);
      guard['router'].navigate = jest.fn().mockImplementation();
      guard.canActivate();
      expect(guard['router'].navigate).toHaveBeenCalledWith(['forbidden']);
    });

    test('should navigate to caseView when at is at minimum salesUSer', () => {
      isCalcSubject$$.next(true);
      isSalesUserSubject$$.next(true);
      guard['router'].navigate = jest.fn().mockImplementation();
      guard.canActivate();
      expect(guard['router'].navigate).toHaveBeenCalledWith(['case-view']);
    });

    test('should navigate to calculator when user is calculator but not salesUser', () => {
      isCalcSubject$$.next(true);
      isSalesUserSubject$$.next(false);
      guard['router'].navigate = jest.fn().mockImplementation();
      guard.canActivate();
      expect(guard['router'].navigate).toHaveBeenCalledWith([
        'calculator-overview',
      ]);
    });
  });
});
