import { provideRouter } from '@angular/router';

import {
  createServiceFactory,
  mockProvider,
  SpectatorService,
} from '@ngneat/spectator/jest';
import { marbles } from 'rxjs-marbles/jest';

import { RoleFacade } from '../../role-facade/role.facade';
import { BasicRoleGuard } from './basic-role.guard';

describe('BasicRoleGuard', () => {
  let spectator: SpectatorService<BasicRoleGuard>;
  let guard: BasicRoleGuard;
  let roleFacade: RoleFacade;

  const createService = createServiceFactory({
    service: BasicRoleGuard,
    providers: [mockProvider(RoleFacade), provideRouter([])],
  });

  beforeEach(() => {
    spectator = createService();
    guard = spectator.inject(BasicRoleGuard);
    roleFacade = spectator.inject(RoleFacade);
  });

  it('should create', () => {
    expect(guard).toBeTruthy();
  });

  describe('canActivateChild', () => {
    it(
      'should grant access, if user has base role',
      marbles((m) => {
        roleFacade.hasBasicRole$ = m.cold('a', { a: true });

        guard
          .canActivateChild()
          .subscribe((granted) => expect(granted).toBeTruthy());
      })
    );

    it(
      'should not grant access if user is lacking base role',
      marbles((m) => {
        roleFacade.hasBasicRole$ = m.cold('a', { a: false });
        guard['router'].navigate = jest.fn().mockImplementation();

        guard
          .canActivateChild()
          .subscribe((granted) => expect(granted).toBeFalsy());
      })
    );

    it(
      'should redirect to no-access page if user is not authorized',
      marbles((m) => {
        roleFacade.hasBasicRole$ = m.cold('a', { a: false });
        guard['router'].navigate = jest.fn().mockImplementation();

        guard.canActivateChild().subscribe((granted) => {
          expect(granted).toBeFalsy();
          expect(guard['router'].navigate).toHaveBeenCalledWith([
            'empty-states',
            'no-access',
          ]);
        });
      })
    );
  });
});
