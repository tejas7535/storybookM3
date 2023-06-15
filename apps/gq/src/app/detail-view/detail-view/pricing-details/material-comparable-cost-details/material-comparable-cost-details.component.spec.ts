import { CUSTOM_ELEMENTS_SCHEMA, SimpleChange } from '@angular/core';

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
        const gpcRounded = 2.56;
        const sqvRounded = 9.25;

        const calculateMarginSpy = jest.spyOn(pricingUtils, 'calculateMargin');
        calculateMarginSpy.mockReturnValue(margin);

        const roundToTwoDecimalsSpy = jest.spyOn(
          pricingUtils,
          'roundToTwoDecimals'
        );
        roundToTwoDecimalsSpy.mockImplementation((value: number) =>
          value === MATERIAL_COMPARABLE_COST_MOCK.gpc ? gpcRounded : sqvRounded
        );

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

        expect(roundToTwoDecimalsSpy).toBeCalledTimes(2);
        expect(roundToTwoDecimalsSpy).toHaveBeenNthCalledWith(
          1,
          MATERIAL_COMPARABLE_COST_MOCK.gpc
        );
        expect(roundToTwoDecimalsSpy).toHaveBeenNthCalledWith(
          2,
          MATERIAL_COMPARABLE_COST_MOCK.sqv
        );

        expect(calculateMarginSpy).toBeCalledTimes(2);
        expect(calculateMarginSpy).toHaveBeenNthCalledWith(
          1,
          price,
          gpcRounded
        );
        expect(calculateMarginSpy).toHaveBeenNthCalledWith(
          2,
          price,
          sqvRounded
        );
      })
    );

    test(
      'should calculate only GPI if user has GPC role but no SQV role',
      marbles((m) => {
        const price = 500;
        const margin = 25;
        const gpcRounded = 9.99;

        const calculateMarginSpy = jest.spyOn(pricingUtils, 'calculateMargin');
        calculateMarginSpy.mockReturnValue(margin);

        const roundToTwoDecimalsSpy = jest.spyOn(
          pricingUtils,
          'roundToTwoDecimals'
        );
        roundToTwoDecimalsSpy.mockReturnValue(gpcRounded);

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

        expect(roundToTwoDecimalsSpy).toBeCalledTimes(1);
        expect(roundToTwoDecimalsSpy).toHaveBeenCalledWith(
          MATERIAL_COMPARABLE_COST_MOCK.gpc
        );

        expect(calculateMarginSpy).toBeCalledTimes(1);
        expect(calculateMarginSpy).toHaveBeenCalledWith(price, gpcRounded);
      })
    );

    test(
      'should calculate only GPM if user has SQV role but no GPC role',
      marbles((m) => {
        const price = 500;
        const margin = 25;
        const sqvRounded = 1.99;

        const calculateMarginSpy = jest.spyOn(pricingUtils, 'calculateMargin');
        calculateMarginSpy.mockReturnValue(margin);

        const roundToTwoDecimalsSpy = jest.spyOn(
          pricingUtils,
          'roundToTwoDecimals'
        );
        roundToTwoDecimalsSpy.mockReturnValue(sqvRounded);

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

        expect(roundToTwoDecimalsSpy).toBeCalledTimes(1);
        expect(roundToTwoDecimalsSpy).toHaveBeenCalledWith(
          MATERIAL_COMPARABLE_COST_MOCK.sqv
        );

        expect(calculateMarginSpy).toBeCalledTimes(1);
        expect(calculateMarginSpy).toHaveBeenCalledWith(price, sqvRounded);
      })
    );
  });

  describe('recalculate margins', () => {
    test('should recalculate', () => {
      const processMaterialComparableCostsSpy = jest.spyOn(
        component as any,
        'processMaterialComparableCosts'
      );

      component.ngOnChanges({
        price: {
          currentValue: 83.69,
          firstChange: false,
          previousValue: 5.25,
        } as SimpleChange,
      });

      expect(processMaterialComparableCostsSpy).toHaveBeenCalledTimes(1);
    });

    test('should not recalculate, if not the price has been changed', () => {
      const processMaterialComparableCostsSpy = jest.spyOn(
        component as any,
        'processMaterialComparableCosts'
      );

      component.ngOnChanges({
        sapPriceUnit: {
          currentValue: 10,
          firstChange: false,
          previousValue: 1,
        } as SimpleChange,
      });

      expect(processMaterialComparableCostsSpy).not.toHaveBeenCalled();
    });

    test('should not recalculate, if price has not been changed', () => {
      const processMaterialComparableCostsSpy = jest.spyOn(
        component as any,
        'processMaterialComparableCosts'
      );

      component.ngOnChanges({
        price: {
          currentValue: 999,
          firstChange: true,
          previousValue: undefined,
        } as SimpleChange,
      });

      expect(processMaterialComparableCostsSpy).not.toHaveBeenCalled();
    });
  });
});
