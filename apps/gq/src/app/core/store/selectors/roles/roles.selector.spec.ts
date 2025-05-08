import { TestBed } from '@angular/core/testing';

import { ColumnUtilityService } from '@gq/shared/ag-grid/services';
import { UserRoles } from '@gq/shared/constants';
import { RoleGroup } from '@gq/shared/models';
import { MockStore, provideMockStore } from '@ngrx/store/testing';
import { ColDef } from 'ag-grid-enterprise';
import { marbles } from 'rxjs-marbles';

import {
  filterRoles,
  getAllSalesRoles,
  getColumnDefsForRoles,
  userHasGPCRole,
  userHasManualPriceRole,
  userHasRegionAmericasRole,
  userHasRegionGreaterChinaRole,
  userHasRegionWorldRole,
  userHasRole,
  userHasSQVRole,
  userIsCalculator,
  userIsSalesUser,
} from './roles.selector';

describe('shared selector', () => {
  let store: MockStore;
  beforeEach(() =>
    TestBed.configureTestingModule({
      providers: [
        provideMockStore({
          initialState: {
            'azure-auth': {
              accountInfo: {
                idTokenClaims: {
                  roles: [
                    UserRoles.BASIC,
                    UserRoles.COST_GPC,
                    UserRoles.REGION_WORLD,
                    UserRoles.REGION_AMERICAS,
                    UserRoles.SECTOR_ALL,
                    UserRoles.MANUAL_PRICE,
                  ],
                },
              },
            },
          },
        }),
      ],
    })
  );
  beforeEach(() => {
    store = TestBed.inject(MockStore);
  });
  describe('get all sales roles', () => {
    test(
      'should return list of role groups',
      marbles((m) => {
        const expectedValue: RoleGroup[] = [
          {
            key: 'geoRoles',
            roles: [UserRoles.REGION_WORLD, UserRoles.REGION_AMERICAS],
          },
          {
            key: 'sectoralRoles',
            roles: [UserRoles.SECTOR_ALL],
          },
          {
            key: 'costRoles',
            roles: [UserRoles.COST_GPC],
          },
          {
            key: 'priceRoles',
            roles: [UserRoles.MANUAL_PRICE],
          },
        ];

        const expected = m.cold('a', { a: expectedValue });

        const result = store.pipe(getAllSalesRoles);

        m.expect(result).toBeObservable(expected);
      })
    );
  });

  describe('getColumnDefsForRoles', () => {
    test(
      'should call ColumnUtilityService with roles',
      marbles((m) => {
        ColumnUtilityService.createColumnDefs = jest.fn((): ColDef[] => []);
        const expected = m.cold('a', { a: [] });
        const colDef: ColDef[] = [];

        const result = store.pipe(getColumnDefsForRoles(colDef));

        m.expect(result).toBeObservable(expected);
        result.subscribe(() => {
          expect(ColumnUtilityService.createColumnDefs).toHaveBeenCalledTimes(
            1
          );
        });
      })
    );
  });
  describe('filter roles', () => {
    test('should filter roles', () => {
      const roles = [UserRoles.COST_SQV, UserRoles.MANUAL_PRICE];
      const result = filterRoles(roles, UserRoles.COST_PREFIX);
      expect(result).toEqual([UserRoles.COST_SQV]);
    });
  });
  describe('userHasGPCRole', () => {
    test(
      'should return true',
      marbles((m) => {
        const expected = m.cold('a', { a: true });

        const result = store.pipe(userHasGPCRole);

        m.expect(result).toBeObservable(expected);
      })
    );
    test(
      'should return false',
      marbles((m) => {
        store.setState({
          'azure-auth': {
            accountInfo: {
              idTokenClaims: {
                roles: [],
              },
            },
          },
        });

        const expected = m.cold('a', { a: false });
        const result = store.pipe(userHasGPCRole);

        m.expect(result).toBeObservable(expected);
      })
    );
  });

  describe('userHasSQVRole', () => {
    test(
      'should return true',
      marbles((m) => {
        store.setState({
          'azure-auth': {
            accountInfo: {
              idTokenClaims: {
                roles: [UserRoles.COST_SQV],
              },
            },
          },
        });
        const expected = m.cold('a', { a: true });

        const result = store.pipe(userHasSQVRole);

        m.expect(result).toBeObservable(expected);
      })
    );
    test(
      'should return false',
      marbles((m) => {
        const expected = m.cold('a', { a: false });

        const result = store.pipe(userHasSQVRole);

        m.expect(result).toBeObservable(expected);
      })
    );
  });
  describe('userHasManualPriceRole', () => {
    test(
      'should return true',
      marbles((m) => {
        const expected = m.cold('a', { a: true });

        const result = store.pipe(userHasManualPriceRole);

        m.expect(result).toBeObservable(expected);
      })
    );
    test(
      'should return false',
      marbles((m) => {
        store.setState({
          'azure-auth': {
            accountInfo: {
              idTokenClaims: {
                roles: [],
              },
            },
          },
        });
        const expected = m.cold('a', { a: false });

        const result = store.pipe(userHasManualPriceRole);

        m.expect(result).toBeObservable(expected);
      })
    );
  });

  describe('userHasRegionAmericasRole', () => {
    test(
      'should return true',
      marbles((m) => {
        const expected = m.cold('a', { a: true });

        const result = store.pipe(userHasRegionAmericasRole);

        m.expect(result).toBeObservable(expected);
      })
    );
    test(
      'should return false',
      marbles((m) => {
        store.setState({
          'azure-auth': {
            accountInfo: {
              idTokenClaims: {
                roles: [],
              },
            },
          },
        });
        const expected = m.cold('a', { a: false });

        const result = store.pipe(userHasRegionAmericasRole);

        m.expect(result).toBeObservable(expected);
      })
    );
  });

  describe('userHasRegionWorldRole', () => {
    test(
      'should return true',
      marbles((m) => {
        const expected = m.cold('a', { a: true });

        const result = store.pipe(userHasRegionWorldRole);

        m.expect(result).toBeObservable(expected);
      })
    );
    test(
      'should return false',
      marbles((m) => {
        store.setState({
          'azure-auth': {
            accountInfo: {
              idTokenClaims: {
                roles: [
                  UserRoles.BASIC,
                  UserRoles.COST_GPC,
                  UserRoles.REGION_AMERICAS,
                  UserRoles.SECTOR_ALL,
                  UserRoles.MANUAL_PRICE,
                ],
              },
            },
          },
        });
        const expected = m.cold('a', { a: false });

        const result = store.pipe(userHasRegionWorldRole);

        m.expect(result).toBeObservable(expected);
      })
    );
  });

  describe('userHasRegionGreaterChinaRole', () => {
    test(
      'should return true',
      marbles((m) => {
        store.setState({
          'azure-auth': {
            accountInfo: {
              idTokenClaims: {
                roles: [UserRoles.REGION_GREATER_CHINA],
              },
            },
          },
        });
        const expected = m.cold('a', { a: true });

        const result = store.pipe(userHasRegionGreaterChinaRole);

        m.expect(result).toBeObservable(expected);
      })
    );
    test(
      'should return false',
      marbles((m) => {
        store.setState({
          'azure-auth': {
            accountInfo: {
              idTokenClaims: {
                roles: [
                  UserRoles.BASIC,
                  UserRoles.COST_GPC,
                  UserRoles.REGION_AMERICAS,
                  UserRoles.SECTOR_ALL,
                  UserRoles.MANUAL_PRICE,
                ],
              },
            },
          },
        });
        const expected = m.cold('a', { a: false });

        const result = store.pipe(userHasRegionGreaterChinaRole);

        m.expect(result).toBeObservable(expected);
      })
    );
  });

  describe('userIsSalesUser', () => {
    test(
      'should return true when user has any sales role',
      marbles((m) => {
        store.setState({
          'azure-auth': {
            accountInfo: {
              idTokenClaims: {
                roles: [UserRoles.REGION_WORLD],
              },
            },
          },
        });
        const expected = m.cold('a', { a: true });

        const result = store.pipe(userIsSalesUser);

        m.expect(result).toBeObservable(expected);
      })
    );

    test(
      'should return false, if the user has no salesRule',
      marbles((m) => {
        store.setState({
          'azure-auth': {
            accountInfo: {
              idTokenClaims: {
                roles: [UserRoles.CALC],
              },
            },
          },
        });
        const expected = m.cold('a', { a: false });

        const result = store.pipe(userIsSalesUser);

        m.expect(result).toBeObservable(expected);
      })
    );
  });

  describe('userIsCalculator', () => {
    test(
      'should return true when user has calculator role',
      marbles((m) => {
        store.setState({
          'azure-auth': {
            accountInfo: {
              idTokenClaims: {
                roles: [UserRoles.CALC],
              },
            },
          },
        });
        const expected = m.cold('a', { a: true });

        const result = store.pipe(userIsCalculator);

        m.expect(result).toBeObservable(expected);
      })
    );
    test(
      'should return false when user has no calculator role',
      marbles((m) => {
        store.setState({
          'azure-auth': {
            accountInfo: {
              idTokenClaims: {
                roles: [],
              },
            },
          },
        });
        const expected = m.cold('a', { a: false });

        const result = store.pipe(userIsCalculator);

        m.expect(result).toBeObservable(expected);
      })
    );
  });
  describe('userHasRole', () => {
    test(
      'should return true',
      marbles((m) => {
        const expected = m.cold('a', { a: true });

        const result = store.pipe(userHasRole(UserRoles.BASIC));

        m.expect(result).toBeObservable(expected);
      })
    );
    test(
      'should return false',
      marbles((m) => {
        store.setState({
          'azure-auth': {
            accountInfo: {
              idTokenClaims: {
                roles: [],
              },
            },
          },
        });
        const expected = m.cold('a', { a: false });

        const result = store.pipe(userHasRole(UserRoles.BASIC));

        m.expect(result).toBeObservable(expected);
      })
    );
  });
});
