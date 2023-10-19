import { RouterTestingModule } from '@angular/router/testing';

import { of } from 'rxjs';

import { createServiceFactory, SpectatorService } from '@ngneat/spectator/jest';
import { MockProvider } from 'ng-mocks';

import { RolesFacade } from '../store/facades';
import { ComparableTransactionsGuard } from './comparable-transactions.guard';

describe('ComparableTransactionsGuard', () => {
  let guard: ComparableTransactionsGuard;
  let spectator: SpectatorService<ComparableTransactionsGuard>;

  const createService = createServiceFactory({
    service: ComparableTransactionsGuard,
    imports: [RouterTestingModule],
    providers: [MockProvider(RolesFacade)],
  });

  beforeEach(() => {
    spectator = createService();
    guard = spectator.inject(ComparableTransactionsGuard);
  });

  test('should be created', () => {
    expect(guard).toBeTruthy();
  });

  describe('canActivateChild', () => {
    test('should return true if user has comparable transactions', () => {
      guard['rolesFacade'].userHasAccessToComparableTransactions$ = of(true);
      guard.canActivateChild().subscribe((result) => {
        expect(result).toEqual(true);
      });
    });

    test('should return false if user has no comparable transactions', () => {
      guard['rolesFacade'].userHasAccessToComparableTransactions$ = of(false);
      guard['router'].navigate = jest.fn().mockImplementation();

      guard.canActivateChild().subscribe((result) => {
        expect(result).toEqual(false);
      });

      expect(guard['router'].navigate).toHaveBeenCalledWith(['forbidden']);
    });
  });
});
