import { HttpClientTestingModule } from '@angular/common/http/testing';
import { MATERIAL_SANITY_CHECKS } from '@angular/material/core';

import { of } from 'rxjs';

import { AppRoutePath } from '@gq/app-route-path.enum';
import { activeCaseFeature } from '@gq/core/store/active-case/active-case.reducer';
import { Customer } from '@gq/shared/models/customer';
import {
  MaterialTableItem,
  MaterialValidation,
  ValidationDescription,
} from '@gq/shared/models/table';
import { MaterialService } from '@gq/shared/services/rest/material/material.service';
import { MaterialValidationRequest } from '@gq/shared/services/rest/material/models';
import { createServiceFactory, SpectatorService } from '@ngneat/spectator/jest';
import { Actions } from '@ngrx/effects';
import { provideMockActions } from '@ngrx/effects/testing';
import { ROUTER_NAVIGATED } from '@ngrx/router-store';
import { MockStore, provideMockStore } from '@ngrx/store/testing';
import { marbles } from 'rxjs-marbles/jest';

import { CurrencyFacade } from '../currency/currency.facade';
import { ProcessCaseActions } from './process-case.action';
import { ProcessCaseEffects } from './process-case.effects';
import { getAddMaterialRowData } from './process-case.selectors';

describe('ProcessCaseEffects', () => {
  let spectator: SpectatorService<ProcessCaseEffects>;
  let action: any;
  let actions$: any;
  let effects: ProcessCaseEffects;
  let currencyFacade: CurrencyFacade;
  let materialService: MaterialService;

  let store: any;

  const errorMessage = 'An error occurred';

  const createService = createServiceFactory({
    service: ProcessCaseEffects,
    imports: [HttpClientTestingModule],
    providers: [
      { provide: MATERIAL_SANITY_CHECKS, useValue: false },
      provideMockActions(() => actions$),
      provideMockStore(),
    ],
  });

  beforeEach(() => {
    spectator = createService();
    actions$ = spectator.inject(Actions);
    effects = spectator.inject(ProcessCaseEffects);
    currencyFacade = spectator.inject(CurrencyFacade);
    materialService = spectator.inject(MaterialService);
    store = spectator.inject(MockStore);
  });

  describe('Validation of Materials', () => {
    it(
      'Should call action by add dataItems',
      marbles((m) => {
        action = ProcessCaseActions.addNewItemsToMaterialTable({ items: [] });
        actions$ = m.hot('-a', { a: action });

        const result = ProcessCaseActions.validateMaterialTableItems();

        const expected = m.cold('-b', { b: result });

        m.expect(effects.validateAfterItemAdded$).toBeObservable(expected);
        m.flush();
      })
    );
  });

  describe('validateMaterialsOnCustomerAndSalesOrg$', () => {
    const tableData: MaterialTableItem[] = [
      {
        materialNumber: '1234',
        quantity: 20,
        info: {
          valid: false,
          description: [ValidationDescription.Not_Validated],
        },
      },
    ];

    const request: MaterialValidationRequest = {
      customerId: { customerId: '12345', salesOrg: '0815' },
      materialNumbers: ['1234'],
    };
    beforeEach(() => {
      store.overrideSelector(getAddMaterialRowData, tableData);
      store.overrideSelector(activeCaseFeature.selectCustomer, {
        identifier: { customerId: '12345', salesOrg: '0815' },
      } as Customer);
    });

    test(
      'should return validateAddMaterialsOnCustomerAndSalesOrgSuccess when REST call is successful',
      marbles((m) => {
        action = ProcessCaseActions.validateMaterialTableItems();

        materialService.validateMaterials = jest.fn(() => response);
        const materialValidations: MaterialValidation[] = [];
        const result = ProcessCaseActions.validateMaterialTableItemsSuccess({
          materialValidations,
        });

        actions$ = m.hot('-a', { a: action });
        const response = m.cold('-a|', {
          a: {
            customerId: { customerId: '1234', salesOrg: '0815' },
            validatedMaterials: materialValidations,
          },
        });
        const expected = m.cold('--b', { b: result });
        m.expect(
          effects.validateMaterialsOnCustomerAndSalesOrg$
        ).toBeObservable(expected);
        m.flush();
        expect(materialService.validateMaterials).toHaveBeenCalledTimes(1);
        expect(materialService.validateMaterials).toHaveBeenCalledWith(request);
      })
    );

    test(
      'should return validateFailure on REST error',
      marbles((m) => {
        const result = ProcessCaseActions.validateMaterialTableItemsFailure({
          errorMessage,
        });

        actions$ = m.hot('-a', { a: action });
        const response = m.cold('-#|', undefined, errorMessage);
        const expected = m.cold('--b', { b: result });

        materialService.validateMaterials = jest.fn(() => response);

        m.expect(
          effects.validateMaterialsOnCustomerAndSalesOrg$
        ).toBeObservable(expected);
        m.flush();
        expect(materialService.validateMaterials).toHaveBeenCalledTimes(1);
      })
    );
  });

  describe('loadAvailableCurrencies', () => {
    beforeEach(() => {
      action = {
        type: ROUTER_NAVIGATED,
        payload: {
          routerState: {
            queryParams: {},
            url: `/${AppRoutePath.ProcessCaseViewPath}`,
          },
        },
      };
    });

    test(
      'should return loadAvailableCurrencies',
      marbles((m) => {
        currencyFacade.availableCurrencies$ = of([]);
        currencyFacade.loadCurrencies = jest.fn();
        actions$ = m.hot('-a', { a: action });
        const expected = m.cold('-b', { b: undefined });

        expect(true).toBeTruthy();
        m.expect(effects.loadAvailableCurrencies$).toBeObservable(expected);
        m.flush();
        expect(currencyFacade.loadCurrencies).toHaveBeenCalledTimes(1);
      })
    );

    test(
      'should NOT call the service if currencies are already set',
      marbles((m) => {
        currencyFacade.availableCurrencies$ = of(['EUR', 'USD']);
        currencyFacade.loadCurrencies = jest.fn();
        actions$ = m.hot('-a', { a: action });
        const expected = m.cold('-b', { b: undefined });

        expect(true).toBeTruthy();
        m.expect(effects.loadAvailableCurrencies$).toBeObservable(expected);
        m.flush();
        expect(currencyFacade.loadCurrencies).toHaveBeenCalledTimes(0);
      })
    );
  });
});
