import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';

import { of } from 'rxjs';

import { UserRoles } from '@gq/shared/constants';
import { SharedPipesModule } from '@gq/shared/pipes/shared-pipes.module';
import * as pricingUtils from '@gq/shared/utils/pricing.utils';
import {
  createComponentFactory,
  mockProvider,
  Spectator,
} from '@ngneat/spectator/jest';
import {
  TranslocoCurrencyPipe,
  TranslocoDatePipe,
  TranslocoDecimalPipe,
  TranslocoPercentPipe,
} from '@ngneat/transloco-locale';
import { PushModule } from '@ngrx/component';
import { MockStore, provideMockStore } from '@ngrx/store/testing';
import { marbles } from 'rxjs-marbles';

import { provideTranslocoTestingModule } from '@schaeffler/transloco/testing';

import {
  AUTH_STATE_MOCK,
  MATERIAL_COMPARABLE_COST_MOCK,
} from '../../../../../testing/mocks';
import { MaterialComparableCostDetailsComponent } from './material-comparable-cost-details.component';

describe('MaterialComparableCostDetailsComponent', () => {
  let component: MaterialComparableCostDetailsComponent;
  let spectator: Spectator<MaterialComparableCostDetailsComponent>;
  let store: MockStore;

  const createComponent = createComponentFactory({
    component: MaterialComparableCostDetailsComponent,
    imports: [
      provideTranslocoTestingModule({ en: {} }),
      PushModule,
      SharedPipesModule,
    ],
    providers: [
      mockProvider(TranslocoCurrencyPipe),
      mockProvider(TranslocoDatePipe),
      mockProvider(TranslocoPercentPipe),
      mockProvider(TranslocoDecimalPipe),
      provideMockStore({
        initialState: {
          materialComparableCosts: {
            materialComparableCosts: [MATERIAL_COMPARABLE_COST_MOCK],
          },
          'azure-auth': AUTH_STATE_MOCK,
        },
      }),
    ],
    schemas: [CUSTOM_ELEMENTS_SCHEMA],
  });

  beforeEach(() => {
    spectator = createComponent();
    component = spectator.debugElement.componentInstance;
    store = spectator.inject(MockStore);
    jest.clearAllMocks();
  });

  test('should create', () => {
    expect(component).toBeTruthy();
  });

  describe('roles check', () => {
    test(
      'should not have needed regional role for margins if no REGION_AMERICAS and no REGION_WORLD available',
      marbles((m) => {
        store.setState({
          'azure-auth': {
            accountInfo: {
              idTokenClaims: {
                roles: [UserRoles.COST_GPC, UserRoles.COST_SQV],
              },
            },
          },
        });

        component['processMaterialComparableCosts'] = jest.fn();
        component.ngOnInit();

        m.expect(component.userHasNeededRegionalRoleForMargins$).toBeObservable(
          '(a|)',
          {
            a: false,
          }
        );
      })
    );

    test(
      'should have needed regional role for margins if REGION_AMERICAS available',
      marbles((m) => {
        store.setState({
          'azure-auth': {
            accountInfo: {
              idTokenClaims: {
                roles: [UserRoles.REGION_AMERICAS],
              },
            },
          },
        });

        component['processMaterialComparableCosts'] = jest.fn();
        component.ngOnInit();

        m.expect(component.userHasNeededRegionalRoleForMargins$).toBeObservable(
          '(a|)',
          {
            a: true,
          }
        );
      })
    );

    test(
      'should have needed regional role for margins if REGION_WORLD available',
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

        component['processMaterialComparableCosts'] = jest.fn();
        component.ngOnInit();

        m.expect(component.userHasNeededRegionalRoleForMargins$).toBeObservable(
          '(a|)',
          {
            a: true,
          }
        );
      })
    );

    test(
      'should have COST_GPC role',
      marbles((m) => {
        store.setState({
          'azure-auth': {
            accountInfo: {
              idTokenClaims: {
                roles: [UserRoles.COST_GPC],
              },
            },
          },
        });

        component['processMaterialComparableCosts'] = jest.fn();
        component.ngOnInit();

        m.expect(component.userHasGPCRole$).toBeObservable('a', {
          a: true,
        });
      })
    );

    test(
      'should have COST_SQV role',
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

        component['processMaterialComparableCosts'] = jest.fn();
        component.ngOnInit();

        m.expect(component.userHasSQVRole$).toBeObservable('a', {
          a: true,
        });
      })
    );
  });

  describe('calculate margins', () => {
    test(
      'should not calculate margins if user does not have the needed regional role',
      marbles((m) => {
        component['checkUserRoles'] = jest.fn();
        component.userHasNeededRegionalRoleForMargins$ = of(false);
        component.ngOnInit();

        m.expect(component.materialComparableCosts$).toBeObservable('(a|)', {
          a: [MATERIAL_COMPARABLE_COST_MOCK],
        });
        m.flush();
        expect(
          jest.spyOn(pricingUtils, 'calculateMargin')
        ).not.toHaveBeenCalled();
      })
    );

    test(
      'should calculate margins if user has all needed roles',
      marbles((m) => {
        const price = 500;
        const margin = 25;

        const calculateMarginSpy = jest.spyOn(pricingUtils, 'calculateMargin');
        calculateMarginSpy.mockReturnValue(margin);

        component['checkUserRoles'] = jest.fn();
        component.userHasNeededRegionalRoleForMargins$ = of(true);
        component.userHasGPCRole$ = of(true);
        component.userHasSQVRole$ = of(true);
        component.price = price;

        component.ngOnInit();

        m.expect(component.materialComparableCosts$).toBeObservable('(a|)', {
          a: [{ ...MATERIAL_COMPARABLE_COST_MOCK, gpi: margin, gpm: margin }],
        });
        m.flush();
        expect(calculateMarginSpy).toBeCalledTimes(2);
        expect(calculateMarginSpy).toHaveBeenCalledWith(
          price,
          MATERIAL_COMPARABLE_COST_MOCK.gpc
        );
        expect(calculateMarginSpy).toHaveBeenCalledWith(
          price,
          MATERIAL_COMPARABLE_COST_MOCK.sqv
        );
      })
    );

    test(
      'should calculate only GPI if user has GPC role but no SQV role',
      marbles((m) => {
        const price = 500;
        const margin = 25;

        const calculateMarginSpy = jest.spyOn(pricingUtils, 'calculateMargin');
        calculateMarginSpy.mockReturnValue(margin);

        component['checkUserRoles'] = jest.fn();
        component.userHasNeededRegionalRoleForMargins$ = of(true);
        component.userHasGPCRole$ = of(true);
        component.userHasSQVRole$ = of(false);
        component.price = price;

        component.ngOnInit();

        m.expect(component.materialComparableCosts$).toBeObservable('(a|)', {
          a: [{ ...MATERIAL_COMPARABLE_COST_MOCK, gpi: margin }],
        });
        m.flush();
        expect(calculateMarginSpy).toBeCalledTimes(1);
        expect(calculateMarginSpy).toHaveBeenCalledWith(
          price,
          MATERIAL_COMPARABLE_COST_MOCK.gpc
        );
      })
    );

    test(
      'should calculate only GPM if user has SQV role but no GPC role',
      marbles((m) => {
        const price = 500;
        const margin = 25;

        const calculateMarginSpy = jest.spyOn(pricingUtils, 'calculateMargin');
        calculateMarginSpy.mockReturnValue(margin);

        component['checkUserRoles'] = jest.fn();
        component.userHasNeededRegionalRoleForMargins$ = of(true);
        component.userHasGPCRole$ = of(false);
        component.userHasSQVRole$ = of(true);
        component.price = price;

        component.ngOnInit();

        m.expect(component.materialComparableCosts$).toBeObservable('(a|)', {
          a: [{ ...MATERIAL_COMPARABLE_COST_MOCK, gpm: margin }],
        });
        m.flush();
        expect(calculateMarginSpy).toBeCalledTimes(1);
        expect(calculateMarginSpy).toHaveBeenCalledWith(
          price,
          MATERIAL_COMPARABLE_COST_MOCK.sqv
        );
      })
    );
  });
});
