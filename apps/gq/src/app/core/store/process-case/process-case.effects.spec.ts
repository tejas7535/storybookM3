import { provideHttpClientTesting } from '@angular/common/http/testing';
import { MATERIAL_SANITY_CHECKS } from '@angular/material/core';

import { activeCaseFeature } from '@gq/core/store/active-case/active-case.reducer';
import { Customer } from '@gq/shared/models/customer';
import {
  MaterialTableItem,
  MaterialValidation,
  VALIDATION_CODE,
  ValidationDescription,
} from '@gq/shared/models/table';
import { FeatureToggleConfigService } from '@gq/shared/services/feature-toggle/feature-toggle-config.service';
import { MaterialService } from '@gq/shared/services/rest/material/material.service';
import {
  AddDetailsValidationRequest,
  AddDetailsValidationResponse,
  Severity,
} from '@gq/shared/services/rest/material/models';
import { createServiceFactory, SpectatorService } from '@ngneat/spectator/jest';
import { Actions } from '@ngrx/effects';
import { provideMockActions } from '@ngrx/effects/testing';
import { MockStore, provideMockStore } from '@ngrx/store/testing';
import { MockProvider } from 'ng-mocks';
import { marbles } from 'rxjs-marbles/jest';

import { ProcessCaseActions } from './process-case.action';
import { ProcessCaseEffects } from './process-case.effects';
import { getAddMaterialRowData } from './process-case.selectors';

describe('ProcessCaseEffects', () => {
  let spectator: SpectatorService<ProcessCaseEffects>;
  let action: any;
  let actions$: any;
  let effects: ProcessCaseEffects;

  let store: any;

  const errorMessage = 'An error occurred';

  const createService = createServiceFactory({
    service: ProcessCaseEffects,
    imports: [],
    providers: [
      MockProvider(MaterialService),
      provideHttpClientTesting(),
      { provide: MATERIAL_SANITY_CHECKS, useValue: false },
      provideMockActions(() => actions$),
      provideMockStore(),
      MockProvider(FeatureToggleConfigService, {
        isEnabled: jest.fn().mockReturnValue(false),
      }),
    ],
  });

  beforeEach(() => {
    spectator = createService();
    actions$ = spectator.inject(Actions);
    effects = spectator.inject(ProcessCaseEffects);
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
        id: 1,
        materialNumber: '1234',
        materialDescription: 'matDESC',
        customerMaterialNumber: '1234_customer',
        quantity: 20,
        info: {
          valid: false,
          description: [ValidationDescription.Not_Validated],
        },
      },
    ];

    const request: AddDetailsValidationRequest = {
      customerId: { customerId: '12345', salesOrg: '0615' },
      details: [
        {
          id: 1,
          data: {
            materialNumber15: '1234',
            customerMaterial: '1234_customer',
            quantity: 20,
          },
        },
      ],
    };
    beforeEach(() => {
      store.overrideSelector(getAddMaterialRowData, tableData);
      store.overrideSelector(activeCaseFeature.selectCustomer, {
        identifier: { customerId: '12345', salesOrg: '0615' },
      } as Customer);
    });

    test(
      'should return validateAddMaterialsOnCustomerAndSalesOrgSuccess when REST call is successful',
      marbles((m) => {
        action = ProcessCaseActions.validateMaterialTableItems();
        const materialValidations: MaterialValidation[] = [
          {
            id: 1,
            valid: true,
            materialNumber15: tableData[0].materialNumber,
            materialDescription: tableData[0].materialDescription,
            materialPriceUnit: 1,
            materialUoM: 'PC',
            customerMaterial: tableData[0].customerMaterialNumber,
            correctedQuantity: 7,
            deliveryUnit: 5,
            validationCodes: [
              {
                code: VALIDATION_CODE.QDV001,
                description: 'quantatiy updated',
                severity: Severity.INFO,
              },
            ],
            targetPriceSource: undefined,
          },
        ];
        effects['materialService'].validateDetailsToAdd = jest.fn(
          () => response
        );
        effects['materialService'].mapToAddDetailsValidationRequest = jest
          .fn()
          .mockReturnValue(request);
        effects['materialService'].mapValidatedDetailToMaterialValidation = jest
          .fn()
          .mockReturnValue(materialValidations[0]);

        const result = ProcessCaseActions.validateMaterialTableItemsSuccess({
          materialValidations,
          isNewCaseCreation: false,
        });

        const correctedQuantity = 7;
        actions$ = m.hot('-a', { a: action });
        const response = m.cold('-a|', {
          a: {
            customerId: { customerId: '12345', salesOrg: '0615' },
            validatedDetails: [
              {
                id: 1,
                userInput: {
                  materialNumber15: tableData[0].materialNumber,
                  quantity: tableData[0].quantity,
                  customerMaterial: tableData[0].customerMaterialNumber,
                },
                materialData: {
                  materialNumber15: tableData[0].materialNumber,
                  materialDescription: tableData[0].materialDescription,
                  materialPriceUnit: 1,
                  materialUoM: 'PC',
                },
                customerData: {
                  correctedQuantity,
                  customerMaterial: tableData[0].customerMaterialNumber,
                  deliveryUnit: 5,
                  targetPrice: undefined,
                  targetPriceSource: undefined,
                },
                valid: true,
                validationCodes: [
                  {
                    code: VALIDATION_CODE.QDV001,
                    description: 'quantatiy updated',
                    severity: Severity.INFO,
                  },
                ],
              },
            ],
          } as AddDetailsValidationResponse,
        });
        const expected = m.cold('--b', { b: result });
        m.expect(
          effects.validateMaterialsOnCustomerAndSalesOrg$
        ).toBeObservable(expected);
        m.flush();
        expect(
          effects['materialService'].validateDetailsToAdd
        ).toHaveBeenCalledTimes(1);
        expect(
          effects['materialService'].validateDetailsToAdd
        ).toHaveBeenCalledWith(request);
      })
    );

    test(
      'should return validateFailure on REST error',
      marbles((m) => {
        effects['materialService'].mapToAddDetailsValidationRequest = jest
          .fn()
          .mockReturnValue(request);

        effects['materialService'].mapValidatedDetailToMaterialValidation =
          jest.fn();

        const result = ProcessCaseActions.validateMaterialTableItemsFailure({
          errorMessage,
        });

        actions$ = m.hot('-a', { a: action });
        const response = m.cold('-#|', undefined, errorMessage);
        const expected = m.cold('--b', { b: result });

        effects['materialService'].validateDetailsToAdd = jest.fn(
          () => response
        );

        m.expect(
          effects.validateMaterialsOnCustomerAndSalesOrg$
        ).toBeObservable(expected);
        m.flush();
        expect(
          effects['materialService'].validateDetailsToAdd
        ).toHaveBeenCalledTimes(1);
      })
    );
  });
});
