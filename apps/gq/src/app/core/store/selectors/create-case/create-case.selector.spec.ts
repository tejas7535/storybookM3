import { AutocompleteRequestDialog } from '@gq/shared/components/autocomplete-input/autocomplete-request-dialog.enum';
import { FilterNames } from '@gq/shared/components/autocomplete-input/filter-names.enum';
import { IdValue } from '@gq/shared/models/search';
import { ValidationDescription } from '@gq/shared/models/table';
import { CreateCustomerCase } from '@gq/shared/services/rest/search/models/create-customer-case.model';

import {
  CreateCaseState,
  initialState,
} from '../../reducers/create-case/create-case.reducer';
import { SalesIndication } from '../../reducers/transactions/models/sales-indication.enum';
import * as createSelectors from './create-case.selector';

describe('Create Case Selector', () => {
  const salesOrgs = ['048', '651', '123'];
  const fakeState = {
    case: {
      ...initialState,
      autocompleteLoading: FilterNames.CUSTOMER,
      autocompleteItems: [
        {
          filter: FilterNames.CUSTOMER,
          options: [new IdValue('1', '1', true)],
        },
        {
          filter: FilterNames.CUSTOMER_AND_SHIP_TO_PARTY,
          options: [new IdValue('1', '1', true)],
        },
        {
          filter: FilterNames.MATERIAL_DESCRIPTION,
          options: [new IdValue('1', '1', true)],
        },
        {
          filter: FilterNames.SAP_QUOTATION,
          options: [new IdValue('1', '1', true)],
        },
        {
          filter: FilterNames.MATERIAL_NUMBER_OR_DESCRIPTION,
          options: [new IdValue('1', '1', true)],
        },
      ],
      customer: {
        ...initialState.customer,
        salesOrgs,
      },
      rowData: [
        {
          materialNumber: '1234',
          quantity: 20,
          info: {
            valid: true,
            description: ValidationDescription.Valid,
          },
        },
      ],
      purchaseOrderType: { type: 'ZOR', name: 'ZOR_name' },
    } as unknown as CreateCaseState,
  };

  describe('getCaseQuotation', () => {
    test('should return quotation', () => {
      expect(
        createSelectors.getCaseQuotation.projector(fakeState.case)
      ).toEqual(
        fakeState.case.autocompleteItems.find(
          (elm) => elm.filter === FilterNames.SAP_QUOTATION
        )
      );
    });
  });
  describe('getCaseMaterialDesc', () => {
    test('should return materialdescription', () => {
      expect(
        createSelectors
          .getCaseMaterialDesc(AutocompleteRequestDialog.EMPTY)
          .projector(fakeState.case)
      ).toEqual(
        fakeState.case.autocompleteItems.find(
          (elm) => elm.filter === FilterNames.MATERIAL_DESCRIPTION
        )
      );
    });

    test('should return empty options', () => {
      expect(
        createSelectors
          .getCaseMaterialDesc(AutocompleteRequestDialog.ADD_ENTRY)
          .projector(fakeState.case)
      ).toEqual({ filter: FilterNames.MATERIAL_DESCRIPTION, options: [] });
    });
  });
  describe('getCaseMaterialNumberOrDesc', () => {
    test('should return materialNumberOrDesc', () => {
      expect(
        createSelectors
          .getCaseMaterialNumberOrDesc(AutocompleteRequestDialog.EMPTY)
          .projector(fakeState.case)
      ).toEqual(
        fakeState.case.autocompleteItems.find(
          (elm) => elm.filter === FilterNames.MATERIAL_NUMBER_OR_DESCRIPTION
        )
      );
    });

    test('should return empty options', () => {
      expect(
        createSelectors
          .getCaseMaterialNumberOrDesc(AutocompleteRequestDialog.ADD_ENTRY)
          .projector(fakeState.case)
      ).toEqual({
        filter: FilterNames.MATERIAL_NUMBER_OR_DESCRIPTION,
        options: [],
      });
    });
  });
  describe('getCustomerAndShipToParty', () => {
    test('should return customerAndShipToParty', () => {
      expect(
        createSelectors
          .getCaseCustomerAndShipToParty(AutocompleteRequestDialog.EMPTY)
          .projector(fakeState.case)
      ).toEqual(
        fakeState.case.autocompleteItems.find(
          (elm) => elm.filter === FilterNames.CUSTOMER_AND_SHIP_TO_PARTY
        )
      );
    });

    test('should return empty options', () => {
      expect(
        createSelectors
          .getCaseCustomerAndShipToParty(AutocompleteRequestDialog.ADD_ENTRY)
          .projector(fakeState.case)
      ).toEqual({
        filter: FilterNames.CUSTOMER_AND_SHIP_TO_PARTY,
        options: [],
      });
    });
  });
  describe('getSelectedQuotation', () => {
    test('should return quotation number', () => {
      expect(
        createSelectors.getSelectedQuotation.projector(fakeState.case)
      ).toBeTruthy();
    });
  });
  describe('getCustomer', () => {
    test('should return customer', () => {
      expect(
        createSelectors
          .getCaseCustomer(AutocompleteRequestDialog.EMPTY)
          .projector(fakeState.case)
      ).toEqual(
        fakeState.case.autocompleteItems.find(
          (elm) => elm.filter === FilterNames.CUSTOMER
        )
      );
    });
  });
  describe('getMaterialNumber', () => {
    test('should return material numbers', () => {
      expect(
        createSelectors
          .getCaseMaterialNumber(AutocompleteRequestDialog.EMPTY)
          .projector(fakeState.case)
      ).toEqual(
        fakeState.case.autocompleteItems.find(
          (elm) => elm.filter === FilterNames.MATERIAL_NUMBER
        )
      );
    });

    test('should return empty options', () => {
      expect(
        createSelectors
          .getCaseMaterialNumber(AutocompleteRequestDialog.ADD_ENTRY)
          .projector(fakeState.case)
      ).toEqual({ filter: FilterNames.MATERIAL_NUMBER, options: [] });
    });
  });

  describe('getRowData', () => {
    test('should return row data', () => {
      expect(createSelectors.getCaseRowData.projector(fakeState.case)).toEqual(
        fakeState.case.rowData
      );
    });
  });

  describe('getAutocompleteLoading', () => {
    test('should return true if autocomplete is currently loading', () => {
      expect(
        createSelectors
          .getCaseAutocompleteLoading(FilterNames.CUSTOMER)
          .projector(fakeState.case)
      ).toBeTruthy();
    });
  });
  describe('getCustomerConditionsValid', () => {
    test('should return true if row Data Valid', () => {
      expect(
        createSelectors.getCustomerConditionsValid.projector(fakeState.case)
      ).toBeTruthy();
    });
  });

  describe('getCreateCaseData', () => {
    test('should return data to create a case', () => {
      expect(
        createSelectors.getCreateCaseData.projector(fakeState.case)
      ).toBeTruthy();
    });
  });
  describe('getCreatedCase', () => {
    test('should return createdCase', () => {
      expect(createSelectors.getCreatedCase.projector(fakeState.case)).toEqual(
        undefined
      );
    });
  });
  describe('getSalesOrgs', () => {
    test('should return salesOrgs', () => {
      expect(createSelectors.getSalesOrgs.projector(fakeState.case)).toEqual(
        salesOrgs
      );
    });
  });

  describe('getCreateCaseLoading', () => {
    test('should return createCaseLoading', () => {
      expect(
        createSelectors.getCreateCaseLoading.projector(fakeState.case)
      ).toBeFalsy();
    });
  });
  describe('getProductLinesAndSeries', () => {
    test('should return getProductLinesAndSeries', () => {
      expect(
        createSelectors.getProductLinesAndSeries.projector(fakeState.case)
      ).toEqual(fakeState.case.plSeries.plsAndSeries);
    });
  });
  describe('getProductLinesAndSeriesLoading', () => {
    test('should return getProductLinesAndSeriesLoading', () => {
      expect(
        createSelectors.getProductLinesAndSeriesLoading.projector(
          fakeState.case
        )
      ).toEqual(fakeState.case.plSeries.loading);
    });
  });
  describe('getCreateCustomerCaseDisabled', () => {
    test('should return true', () => {
      const mockState = {
        ...fakeState.case,
        customer: {
          customerId: '1234',
          salesOrgs: [{ id: '1', selected: true }],
        },
        plSeries: {
          ...fakeState.case.plSeries,
          plsAndSeries: {
            pls: [{ value: '1', name: '1', series: ['1'], selected: true }],
            series: [{ value: '1', selected: false }],
            gpsdGroupIds: [{ value: '1', selected: false }],
          },
        },
      } as unknown as CreateCaseState;

      expect(
        createSelectors.getCreateCustomerCaseDisabled.projector(mockState)
      ).toBeTruthy();
    });
    test('should return false', () => {
      const mockState = {
        ...fakeState.case,
        customer: {
          customerId: '1234',
          salesOrgs: [{ id: '1', selected: true }],
        },
        plSeries: {
          ...fakeState.case.plSeries,
          materialSelection: {
            includeQuotationHistory: true,
            salesIndications: [SalesIndication.INVOICE],
          },
          plsAndSeries: {
            pls: [{ value: '1', name: '1', series: ['1'], selected: true }],
            series: [{ value: '1', selected: true }],
            gpsdGroupIds: [{ value: '1', selected: true }],
          },
        },
      } as unknown as CreateCaseState;

      expect(
        createSelectors.getCreateCustomerCaseDisabled.projector(mockState)
      ).toBeFalsy();
    });
  });

  describe('getCreateCustomerCasePayload', () => {
    test('should return create customer case payload', () => {
      const mockState = {
        ...fakeState.case,
        customer: {
          customerId: '1234',
          salesOrgs: [{ id: '1', selected: true }],
        },
        plSeries: {
          ...fakeState.case.plSeries,
          plsAndSeries: {
            pls: [{ value: '1', name: '1', series: ['1'], selected: true }],
            series: [{ value: '1', selected: true }],
            gpsdGroupIds: [{ value: 'F02', selected: true }],
          },
          materialSelection: {
            includeQuotationHistory: true,
            salesIndications: [SalesIndication.INVOICE],
          },
          historicalDataLimitInYear: 2,
        },
      } as unknown as CreateCaseState;

      const expected: CreateCustomerCase = {
        customer: {
          customerId: '1234',
          salesOrg: '1',
        },
        includeQuotationHistory: true,
        productLines: ['1'],
        series: ['1'],
        gpsdGroupIds: ['F02'],
        salesIndications: [SalesIndication.INVOICE],
        historicalDataLimitInYear: 2,
      };
      expect(
        createSelectors.getCreateCustomerCasePayload.projector(mockState)
      ).toEqual(expected);
    });
  });

  describe('getSelectedPurchaseOrderTypeFromCreateCase', () => {
    test('should return purchaseOrderType', () => {
      expect(
        createSelectors.getSelectedPurchaseOrderTypeFromCreateCase.projector(
          fakeState.case
        )
      ).toEqual(fakeState.case.purchaseOrderType);
    });
  });
});
