import { HttpClientTestingModule } from '@angular/common/http/testing';
import { MATERIAL_SANITY_CHECKS } from '@angular/material/core';

import { MaterialValidationRequest } from '@gq/shared/services/rest/material/models';
import { createServiceFactory, SpectatorService } from '@ngneat/spectator/jest';
import { Actions } from '@ngrx/effects';
import { provideMockActions } from '@ngrx/effects/testing';
import { ROUTER_NAVIGATED } from '@ngrx/router-store';
import { MockStore, provideMockStore } from '@ngrx/store/testing';
import { marbles } from 'rxjs-marbles/jest';

import { AppRoutePath } from '../../../../app-route-path.enum';
import { Customer } from '../../../../shared/models/customer';
import {
  MaterialTableItem,
  MaterialValidation,
  ValidationDescription,
} from '../../../../shared/models/table';
import { MaterialService } from '../../../../shared/services/rest/material/material.service';
import { QuotationService } from '../../../../shared/services/rest/quotation/quotation.service';
import {
  addMaterialRowDataItems,
  loadAvailableCurrenciesSuccess,
  validateAddMaterialsOnCustomerAndSalesOrg,
  validateAddMaterialsOnCustomerAndSalesOrgFailure,
  validateAddMaterialsOnCustomerAndSalesOrgSuccess,
} from '../../actions';
import { activeCaseFeature } from '../../active-case/active-case.reducer';
import { getAddMaterialRowData, getAvailableCurrencies } from '../../selectors';
import { ProcessCaseEffects } from './process-case.effects';

describe('ProcessCaseEffectss', () => {
  let spectator: SpectatorService<ProcessCaseEffects>;
  let action: any;
  let actions$: any;
  let effects: ProcessCaseEffects;
  let quotationService: QuotationService;
  let materialService: MaterialService;

  let store: any;

  const errorMessage = 'An error occured';

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
    quotationService = spectator.inject(QuotationService);
    materialService = spectator.inject(MaterialService);
    store = spectator.inject(MockStore);
  });

  describe('Validation of Materials', () => {
    it(
      'Should call action by add dataItems',
      marbles((m) => {
        action = addMaterialRowDataItems({ items: [] });
        actions$ = m.hot('-a', { a: action });

        const result = validateAddMaterialsOnCustomerAndSalesOrg();

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
        action = validateAddMaterialsOnCustomerAndSalesOrg();

        materialService.validateMaterials = jest.fn(() => response);
        const materialValidations: MaterialValidation[] = [];
        const result = validateAddMaterialsOnCustomerAndSalesOrgSuccess({
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
        const result = validateAddMaterialsOnCustomerAndSalesOrgFailure({
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
      store.overrideSelector(getAvailableCurrencies, []);
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
        quotationService.getCurrencies = jest.fn(() => response);
        const currencies = [{ currency: 'USD' }, { currency: 'EUR' }];

        actions$ = m.hot('-a', { a: action });

        const response = m.cold('-a|', { a: currencies });
        const expected = m.cold('--b', {
          b: loadAvailableCurrenciesSuccess({ currencies: ['EUR', 'USD'] }),
        });

        m.expect(effects.loadAvailableCurrencies$).toBeObservable(expected);
        m.flush();
        expect(quotationService.getCurrencies).toHaveBeenCalledTimes(1);
      })
    );

    test(
      'should NOT call the service if currencies are already set',
      marbles((m) => {
        store.overrideSelector(getAvailableCurrencies, [
          { currency: 'EUR' },
          { currency: 'USD' },
        ]);

        quotationService.getCurrencies = jest.fn(() => response);
        const currencies = [{ currency: 'EUR' }, { currency: 'USD' }];

        actions$ = m.hot('-a', { a: action });

        const response = m.cold('-a|', { a: currencies });

        m.flush();
        expect(quotationService.getCurrencies).toHaveBeenCalledTimes(0);
      })
    );
  });
});
