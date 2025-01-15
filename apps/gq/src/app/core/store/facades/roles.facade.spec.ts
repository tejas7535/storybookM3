import { of } from 'rxjs';

import { ColumnFields } from '@gq/shared/ag-grid/constants/column-fields.enum';
import { UserRoles } from '@gq/shared/constants';
import { createServiceFactory, SpectatorService } from '@ngneat/spectator/jest';
import { MockStore, provideMockStore } from '@ngrx/store/testing';
import { ColDef } from 'ag-grid-enterprise';
import { marbles } from 'rxjs-marbles';

import { getUserUniqueIdentifier } from '@schaeffler/azure-auth';

import {
  userHasGPCRole,
  userHasManualPriceRole,
  userHasRegionAmericasRole,
  userHasRegionGreaterChinaRole,
  userHasRegionWorldRole,
  userHasSQVRole,
} from '../selectors';
import { RolesFacade } from './roles.facade';

describe('RolesFacade', () => {
  let service: RolesFacade;
  let spectator: SpectatorService<RolesFacade>;
  let mockStore: MockStore;

  const createService = createServiceFactory({
    service: RolesFacade,
    providers: [provideMockStore({})],
  });

  beforeEach(() => {
    spectator = createService();
    service = spectator.service;
    mockStore = spectator.inject(MockStore);

    jest.resetAllMocks();
  });

  describe('should provide userHasManualPriceRole', () => {
    it('should return true', () => {
      marbles((m) => {
        mockStore.overrideSelector(userHasManualPriceRole, of(true));
        m.expect(service.userHasManualPriceRole$).toBeObservable(
          m.cold('a', { a: true })
        );
      });
    });
  });

  describe('should provide userHasGPCRole', () => {
    it('should return false', () => {
      marbles((m) => {
        mockStore.overrideSelector(userHasGPCRole, of(false));
        m.expect(service.userHasGPCRole$).toBeObservable(
          m.cold('a', { a: false })
        );
      });
    });
  });

  describe('should provide userHasSQVRole', () => {
    it('should return true', () => {
      marbles((m) => {
        mockStore.overrideSelector(userHasSQVRole, of(true));
        m.expect(service.userHasSQVRole$).toBeObservable(
          m.cold('a', { a: true })
        );
      });
    });
  });

  describe('should provide userHasRegionGreaterChinaRole', () => {
    it('should return true', () => {
      marbles((m) => {
        mockStore.overrideSelector(userHasRegionGreaterChinaRole, of(true));
        m.expect(service.userHasRegionGreaterChinaRole$).toBeObservable(
          m.cold('a', { a: true })
        );
      });
    });
  });

  describe('userHasRegionAmericas$', () => {
    it('should return true', () => {
      marbles((m) => {
        mockStore.overrideSelector(userHasRegionAmericasRole, of(true));
        m.expect(service.userHasRegionAmericasRole$).toBeObservable(
          m.cold('a', { a: true })
        );
      });
    });
  });

  describe('userHasRegionWorld$', () => {
    it('should return true', () => {
      marbles((m) => {
        mockStore.overrideSelector(userHasRegionWorldRole, of(true));
        m.expect(service.userHasRegionWorldRole$).toBeObservable(
          m.cold('a', { a: true })
        );
      });
    });
  });

  describe('loggedInUserId$', () => {
    it('should return the userId', () => {
      marbles((m) => {
        mockStore.overrideSelector(getUserUniqueIdentifier, 'userName');
        m.expect(service.loggedInUserId$).toBeObservable(
          m.cold('a', { a: 'userName' })
        );
      });
    });
  });

  describe('userHasAccessToComparableTransactions$', () => {
    test(
      'should provide true when NOT Greater_China',
      marbles((m) => {
        mockStore.setState({
          'azure-auth': {
            accountInfo: {
              idTokenClaims: {
                roles: [UserRoles.REGION_AMERICAS],
              },
            },
          },
        });
        m.expect(service.userHasAccessToComparableTransactions$).toBeObservable(
          m.cold('a', { a: true })
        );
      })
    );

    test(
      'should provide true when Greater_China and all cost roles',
      marbles((m) => {
        mockStore.setState({
          'azure-auth': {
            accountInfo: {
              idTokenClaims: {
                roles: [
                  UserRoles.REGION_GREATER_CHINA,
                  UserRoles.COST_SQV,
                  UserRoles.COST_GPC,
                ],
              },
            },
          },
        });
        m.expect(service.userHasAccessToComparableTransactions$).toBeObservable(
          m.cold('a', { a: true })
        );
      })
    );

    test(
      'should provide false when not  Greater_China and no cost roles',
      marbles((m) => {
        mockStore.setState({
          'azure-auth': {
            accountInfo: {
              idTokenClaims: {
                roles: [UserRoles.REGION_GREATER_CHINA, UserRoles.COST_SQV],
              },
            },
          },
        });
        m.expect(service.userHasAccessToComparableTransactions$).toBeObservable(
          m.cold('a', { a: false })
        );
      })
    );
  });

  describe('userHasDeletePositions$', () => {
    test(
      'should provide true when RegionAmericas',
      marbles((m) => {
        mockStore.setState({
          'azure-auth': {
            accountInfo: {
              idTokenClaims: {
                roles: [UserRoles.REGION_AMERICAS],
              },
            },
          },
        });
        m.expect(service.userHasGeneralDeletePositionsRole$).toBeObservable(
          m.cold('a', { a: true })
        );
      })
    );
    test(
      'should provide true when RegionWorld',
      marbles((m) => {
        mockStore.setState({
          'azure-auth': {
            accountInfo: {
              idTokenClaims: {
                roles: [UserRoles.REGION_WORLD],
              },
            },
          },
        });
        m.expect(service.userHasGeneralDeletePositionsRole$).toBeObservable(
          m.cold('a', { a: true })
        );
      })
    );
    test(
      'should provide false when neither RegionWorld nor  RegionAmericas',
      marbles((m) => {
        mockStore.setState({
          'azure-auth': {
            accountInfo: {
              idTokenClaims: {
                roles: [UserRoles.BASIC],
              },
            },
          },
        });
        m.expect(service.userHasGeneralDeletePositionsRole$).toBeObservable(
          m.cold('a', { a: false })
        );
      })
    );
  });

  describe('userHasEditPriceSourceRole', () => {
    test(
      'should provide true when NOT GREATER_CHINA',
      marbles((m) => {
        mockStore.setState({
          'azure-auth': {
            accountInfo: {
              idTokenClaims: {
                roles: [UserRoles.REGION_AMERICAS],
              },
            },
          },
        });
        m.expect(service.userHasEditPriceSourceRole$).toBeObservable(
          m.cold('a', { a: true })
        );
      })
    );

    test(
      'should provide true when GREATER_CHINA and MANUAL_PRICE_ROLE',
      marbles((m) => {
        mockStore.setState({
          'azure-auth': {
            accountInfo: {
              idTokenClaims: {
                roles: [UserRoles.REGION_GREATER_CHINA, UserRoles.MANUAL_PRICE],
              },
            },
          },
        });
        m.expect(service.userHasEditPriceSourceRole$).toBeObservable(
          m.cold('a', { a: true })
        );
      })
    );

    test(
      'should provide false when GREATER_CHINA and ##NOT## MANUAL_PRICE_ROLE',
      marbles((m) => {
        mockStore.setState({
          'azure-auth': {
            accountInfo: {
              idTokenClaims: {
                roles: [UserRoles.REGION_GREATER_CHINA],
              },
            },
          },
        });
        m.expect(service.userHasEditPriceSourceRole$).toBeObservable(
          m.cold('a', { a: false })
        );
      })
    );
  });

  describe('userHasRegionWorldOrGreaterChinaRole$', () => {
    test(
      'should provide true when RegionWorld',
      marbles((m) => {
        mockStore.setState({
          'azure-auth': {
            accountInfo: {
              idTokenClaims: {
                roles: [UserRoles.REGION_WORLD],
              },
            },
          },
        });
        m.expect(service.userHasRegionWorldOrGreaterChinaRole$).toBeObservable(
          m.cold('a', { a: true })
        );
      })
    );

    test(
      'should provide true when RegionGreaterChina',
      marbles((m) => {
        mockStore.setState({
          'azure-auth': {
            accountInfo: {
              idTokenClaims: {
                roles: [UserRoles.REGION_GREATER_CHINA],
              },
            },
          },
        });
        m.expect(service.userHasRegionWorldOrGreaterChinaRole$).toBeObservable(
          m.cold('a', { a: true })
        );
      })
    );

    test(
      'should provide false when neither RegionWorld nor RegionGreaterChina',
      marbles((m) => {
        mockStore.setState({
          'azure-auth': {
            accountInfo: {
              idTokenClaims: {
                roles: [UserRoles.BASIC],
              },
            },
          },
        });
        m.expect(service.userHasRegionWorldOrGreaterChinaRole$).toBeObservable(
          m.cold('a', { a: false })
        );
      })
    );
  });

  describe('methods', () => {
    test(
      'should provide userHasRole',
      marbles((m) => {
        mockStore.setState({
          'azure-auth': {
            accountInfo: {
              idTokenClaims: {
                roles: [UserRoles.BASIC],
              },
            },
          },
        });
        m.expect(service.userHasRole$(UserRoles.BASIC)).toBeObservable(
          m.cold('a', { a: true })
        );
      })
    );

    test(
      'should provide userHasRoles true when user has all roles',
      marbles((m) => {
        mockStore.setState({
          'azure-auth': {
            accountInfo: {
              idTokenClaims: {
                roles: [UserRoles.BASIC, UserRoles.COST_GPC],
              },
            },
          },
        });
        m.expect(
          service.userHasRoles$([UserRoles.BASIC, UserRoles.COST_GPC])
        ).toBeObservable(m.cold('a', { a: true }));
      })
    );
    test(
      'should provide userHasRoles true when user has not all roles',
      marbles((m) => {
        mockStore.setState({
          'azure-auth': {
            accountInfo: {
              idTokenClaims: {
                roles: [UserRoles.BASIC],
              },
            },
          },
        });
        m.expect(
          service.userHasRoles$([UserRoles.BASIC, UserRoles.COST_GPC])
        ).toBeObservable(m.cold('a', { a: false }));
      })
    );

    describe('getColumnDefsForRolesOnQuotationDetailsTable', () => {
      test(
        'should return the column definitions for the given roles',
        marbles((m) => {
          mockStore.setState({
            'azure-auth': {
              accountInfo: {
                idTokenClaims: {
                  roles: [UserRoles.BASIC],
                },
              },
            },
          });
          const colDef: ColDef[] = [
            {
              headerName: 'Column 1',
              field: ColumnFields.GPC,
            },
            {
              headerName: 'Column 2',
              field: ColumnFields.PRICE,
            },
            {
              headerName: 'Column 3',
              field: ColumnFields.NEXT_FREE_ATP,
            },
          ];

          const expectedColDefs: ColDef[] = [
            {
              headerName: 'Column 2',
              field: ColumnFields.PRICE,
            },
            {
              headerName: 'Column 3',
              field: ColumnFields.NEXT_FREE_ATP,
            },
          ];

          // gpcColumnsAre Filtered out
          m.expect(
            service.getColumnDefsForRolesOnQuotationDetailsTable(colDef)
          ).toBeObservable(m.cold('a', { a: expectedColDefs }));
        })
      );
    });
  });
});
