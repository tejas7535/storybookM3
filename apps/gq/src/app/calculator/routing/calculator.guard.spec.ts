import { RouterModule } from '@angular/router';

import { BehaviorSubject } from 'rxjs';

import { RolesFacade } from '@gq/core/store/facades';
import { FeatureToggleConfigService } from '@gq/shared/services/feature-toggle/feature-toggle-config.service';
import {
  createServiceFactory,
  mockProvider,
  SpectatorService,
} from '@ngneat/spectator/jest';
import { marbles } from 'rxjs-marbles';

import { CalculatorGuard } from './calculator.guard';

describe('CalculatorGuard', () => {
  let guard: CalculatorGuard;
  let spectator: SpectatorService<CalculatorGuard>;
  const isCalculatorSubject: BehaviorSubject<boolean> =
    new BehaviorSubject<boolean>(false);

  const createService = createServiceFactory({
    service: CalculatorGuard,
    imports: [RouterModule.forRoot([])],
    providers: [
      mockProvider(FeatureToggleConfigService),
      mockProvider(RolesFacade, {
        userIsCalculator$: isCalculatorSubject.asObservable(),
      }),
    ],
  });
  beforeEach(() => {
    spectator = createService();
    guard = spectator.inject(CalculatorGuard);
  });

  describe('should be created', () => {
    test('should be created', () => {
      expect(guard).toBeTruthy();
    });
  });

  describe('canActivate', () => {
    test(
      'should return false if feature is disabled not not isCalculator',
      marbles((m) => {
        guard['featureToggleService'].isEnabled = jest
          .fn()
          .mockReturnValue(false);
        guard['router'].navigate = jest.fn().mockImplementation();
        const value = guard.canActivate();
        m.expect(value).toBeObservable(m.cold('a', { a: false }));
      })
    );
    test(
      'should return true if feature is enabled and is Calculator',
      marbles((m) => {
        guard['featureToggleService'].isEnabled = jest
          .fn()
          .mockReturnValue(true);
        guard['router'].navigate = jest.fn().mockImplementation();
        isCalculatorSubject.next(true);
        const value = guard.canActivate();
        m.expect(value).toBeObservable(m.cold('a', { a: true }));
      })
    );
    test(
      'should return false if feature is enabled and not isCalculator',
      marbles((m) => {
        guard['featureToggleService'].isEnabled = jest
          .fn()
          .mockReturnValue(true);
        guard['router'].navigate = jest.fn().mockImplementation();
        isCalculatorSubject.next(false);
        const value = guard.canActivate();
        m.expect(value).toBeObservable(m.cold('a', { a: false }));
      })
    );
    test(
      'should return false, when feature is disabled and user isCalculator',
      marbles((m) => {
        guard['featureToggleService'].isEnabled = jest
          .fn()
          .mockReturnValue(false);
        guard['router'].navigate = jest.fn().mockImplementation();
        isCalculatorSubject.next(true);
        const value = guard.canActivate();
        m.expect(value).toBeObservable(m.cold('a', { a: false }));
      })
    );
    test('should navigate to forbidden path if user is not a calculator', () => {
      guard['featureToggleService'].isEnabled = jest
        .fn()
        .mockReturnValue(false);
      guard['router'].navigate = jest.fn().mockImplementation();
      isCalculatorSubject.next(false);
      guard.canActivate().subscribe();
      expect(guard['router'].navigate).toHaveBeenCalledWith(['forbidden']);
    });
  });
  describe('canActivateChild', () => {
    test('should call canActivate', () => {
      const canActivateSpy = jest.spyOn(guard, 'canActivate');
      guard.canActivateChild();
      expect(canActivateSpy).toHaveBeenCalled();
    });
  });
});
