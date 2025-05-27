import { AutocompleteRequestDialog } from '@gq/shared/components/autocomplete-input/autocomplete-request-dialog.enum';
import { FilterNames } from '@gq/shared/components/autocomplete-input/filter-names.enum';
import { AutocompleteSearch, IdValue } from '@gq/shared/models/search';
import { createServiceFactory, SpectatorService } from '@ngneat/spectator/jest';
import { Actions } from '@ngrx/effects';
import { provideMockActions } from '@ngrx/effects/testing';
import { MockStore, provideMockStore } from '@ngrx/store/testing';
import { marbles } from 'rxjs-marbles';

import {
  autocomplete,
  autocompleteSuccess,
  resetAutocompleteMaterials,
  resetRequestingAutoCompleteDialog,
  selectAutocompleteOption,
  setRequestingAutoCompleteDialog,
  setSelectedAutocompleteOption,
  unselectAutocompleteOptions,
} from '../actions';
import { ProcessCaseActions } from '../process-case';
import {
  getCaseCustomerAndShipToParty,
  getCaseMaterialDesc,
  getCustomerMaterialNumber,
  getSelectedAutocompleteMaterialNumber,
  getSelectedAutocompleteRequestDialog,
} from '../selectors/create-case/create-case.selector';
import { AutoCompleteFacade } from './autocomplete.facade';

describe('autocompleteFacade', () => {
  let service: AutoCompleteFacade;
  let spectator: SpectatorService<AutoCompleteFacade>;
  let mockStore: MockStore;
  let actions$: Actions;

  const createService = createServiceFactory({
    service: AutoCompleteFacade,
    providers: [provideMockStore({}), provideMockActions(() => actions$)],
  });
  beforeEach(() => {
    spectator = createService();
    service = spectator.service;
    mockStore = spectator.inject(MockStore);
  });

  test('should be created', () => {
    expect(service).toBeTruthy();
  });

  describe('Observables', () => {
    test('getSelectedAutocompleteRequestDialog$', () => {
      mockStore.setState({
        case: {
          selectedAutocompleteRequestDialog:
            AutocompleteRequestDialog.CREATE_CASE,
        },
      });
      mockStore.overrideSelector(
        getSelectedAutocompleteRequestDialog,
        AutocompleteRequestDialog.CREATE_CASE
      );
      service.getSelectedAutocompleteRequestDialog$.subscribe((result) => {
        expect(result).toEqual(AutocompleteRequestDialog.CREATE_CASE);
      });
    });
    test('getSelectedAutocompleteMaterialNumber$', () => {
      mockStore.setState({
        case: {
          selectedAutocompleteMaterialNumber: { id: '1', value: 'Audi' },
        },
      });
      mockStore.overrideSelector(
        getSelectedAutocompleteMaterialNumber([
          AutocompleteRequestDialog.CREATE_CASE,
          AutocompleteRequestDialog.ADD_ENTRY,
        ]),
        {
          id: '1',
          value: 'Audi',
          selected: false,
        }
      );
      service.getSelectedAutocompleteMaterialNumber$.subscribe((result) => {
        expect(result).toEqual({ id: '1', value: 'Audi' });
      });
    });

    test('getSelectedAutocompleteMaterialNumberForEditMaterial$', () => {
      mockStore.setState({
        case: {
          selectedAutocompleteMaterialNumberForEditMaterial: {
            id: '1',
            value: 'Audi',
          },
        },
      });
      mockStore.overrideSelector(
        getSelectedAutocompleteMaterialNumber([
          AutocompleteRequestDialog.EDIT_MATERIAL,
        ]),
        { id: '1', value: 'Audi', selected: false }
      );
      service.getSelectedAutocompleteMaterialNumberForEditMaterial$.subscribe(
        (result) => {
          expect(result).toEqual({ id: '1', value: 'Audi' });
        }
      );
    });

    describe('customerMaterialNumberForEditMaterial$', () => {
      test(
        'should provide customerMaterialNumberForEditMaterial$',
        marbles((m) => {
          mockStore.setState({
            case: {
              autocompleteItems: [
                {
                  filter: FilterNames.CUSTOMER_MATERIAL,
                  options: [],
                },
              ],
              requestingDialog: AutocompleteRequestDialog.EDIT_MATERIAL,
            },
          });
          mockStore.overrideSelector(
            getCustomerMaterialNumber(AutocompleteRequestDialog.EDIT_MATERIAL),
            { filter: FilterNames.CUSTOMER_MATERIAL, options: [] }
          );
          m.expect(
            service.customerMaterialNumberForEditMaterial$
          ).toBeObservable(
            m.cold('a', {
              a: { filter: FilterNames.CUSTOMER_MATERIAL, options: [] },
            })
          );
        })
      );
    });

    test(
      'shipToCustomerForEditCase$',
      marbles((m) => {
        mockStore.setState({
          case: {
            autocompleteItems: [
              {
                filter: FilterNames.CUSTOMER_AND_SHIP_TO_PARTY,
                options: [],
              },
            ],
            requestingDialog: AutocompleteRequestDialog.EDIT_CASE,
          },
        });
        mockStore.overrideSelector(
          getCaseCustomerAndShipToParty(AutocompleteRequestDialog.EDIT_CASE),
          { filter: FilterNames.CUSTOMER_AND_SHIP_TO_PARTY, options: [] }
        );
        m.expect(service.shipToCustomerForEditCase$).toBeObservable(
          m.cold('a', {
            a: { filter: FilterNames.CUSTOMER_AND_SHIP_TO_PARTY, options: [] },
          })
        );
      })
    );
    test(
      'shipToCustomerForCreateCase$',
      marbles((m) => {
        mockStore.setState({
          case: {
            autocompleteItems: [
              {
                filter: FilterNames.CUSTOMER_AND_SHIP_TO_PARTY,
                options: [],
              },
            ],
            requestingDialog: AutocompleteRequestDialog.CREATE_CASE,
          },
        });
        mockStore.overrideSelector(
          getCaseCustomerAndShipToParty(AutocompleteRequestDialog.CREATE_CASE),
          { filter: FilterNames.CUSTOMER_AND_SHIP_TO_PARTY, options: [] }
        );
        m.expect(service.shipToCustomerForEditCase$).toBeObservable(
          m.cold('a', {
            a: { filter: FilterNames.CUSTOMER_AND_SHIP_TO_PARTY, options: [] },
          })
        );
      })
    );

    test(
      'should provide materialDescForCreateCase$',
      marbles((m) => {
        mockStore.setState({
          case: {
            autocompleteItems: [
              {
                filter: FilterNames.MATERIAL_DESCRIPTION,
                options: [],
              },
            ],
            requestingDialog: AutocompleteRequestDialog.CREATE_CASE,
          },
        });
        mockStore.overrideSelector(
          getCaseMaterialDesc(AutocompleteRequestDialog.CREATE_CASE),
          { filter: FilterNames.MATERIAL_DESCRIPTION, options: [] }
        );
        m.expect(service.materialDescForCreateCase$).toBeObservable(
          m.cold('a', {
            a: { filter: FilterNames.MATERIAL_DESCRIPTION, options: [] },
          })
        );
      })
    );

    test(
      'should provide materialNumberForCreateCase$',
      marbles((m) => {
        mockStore.setState({
          case: {
            autocompleteItems: [
              {
                filter: FilterNames.MATERIAL_NUMBER,
                options: [],
              },
            ],
            requestingDialog: AutocompleteRequestDialog.CREATE_CASE,
          },
        });
        mockStore.overrideSelector(
          getCaseMaterialDesc(AutocompleteRequestDialog.CREATE_CASE),
          { filter: FilterNames.MATERIAL_NUMBER, options: [] }
        );
        m.expect(service.materialNumberForCreateCase$).toBeObservable(
          m.cold('a', {
            a: { filter: FilterNames.MATERIAL_NUMBER, options: [] },
          })
        );
      })
    );

    test(
      'should provide customerMaterialNumberForCreateCase$',
      marbles((m) => {
        mockStore.setState({
          case: {
            autocompleteItems: [
              {
                filter: FilterNames.CUSTOMER_MATERIAL,
                options: [],
              },
            ],
            requestingDialog: AutocompleteRequestDialog.CREATE_CASE,
          },
        });
        mockStore.overrideSelector(
          getCaseCustomerAndShipToParty(AutocompleteRequestDialog.CREATE_CASE),
          { filter: FilterNames.CUSTOMER_MATERIAL, options: [] }
        );
        m.expect(service.customerMaterialNumberForCreateCase$).toBeObservable(
          m.cold('a', {
            a: { filter: FilterNames.CUSTOMER_MATERIAL, options: [] },
          })
        );
      })
    );
    test(
      'should provide createCaseCustomerAddEntry$',
      marbles((m) => {
        mockStore.setState({
          case: {
            autocompleteItems: [
              {
                filter: FilterNames.CUSTOMER,
                options: [],
              },
            ],
            requestingDialog: AutocompleteRequestDialog.ADD_ENTRY,
          },
        });
        mockStore.overrideSelector(
          getCaseCustomerAndShipToParty(AutocompleteRequestDialog.ADD_ENTRY),
          { filter: FilterNames.CUSTOMER, options: [] }
        );
        m.expect(service.createCaseCustomerAddEntry$).toBeObservable(
          m.cold('a', {
            a: { filter: FilterNames.CUSTOMER, options: [] },
          })
        );
      })
    );

    test(
      'should provide optionSelectedForAutoCompleteFilter$',
      marbles((m) => {
        const action = setSelectedAutocompleteOption({
          filter: FilterNames.MATERIAL_NUMBER,
          option: new IdValue('1', 'Audi', true),
        });
        const expected = m.cold('b', {
          b: action,
        });

        actions$ = m.hot('a', { a: action });

        m.expect(service.optionSelectedForAutoCompleteFilter$).toBeObservable(
          expected as any
        );
      })
    );
    test(
      'should provide getAutocompleteOptionsSuccess$',
      marbles((m) => {
        const action = autocompleteSuccess({
          filter: FilterNames.MATERIAL_NUMBER,
          options: [],
        });
        const expected = m.cold('b', { b: action });
        actions$ = m.hot('a', { a: action });
        m.expect(service.getAutocompleteOptionsSuccess$).toBeObservable(
          expected as any
        );
      })
    );
  });
  describe('initFacade', () => {
    test('should dispatch resetRequestingAutoCompleteDialog action', () => {
      mockStore.dispatch = jest.fn();

      service.initFacade(AutocompleteRequestDialog.ADD_ENTRY);

      expect(mockStore.dispatch).toHaveBeenCalledWith(
        setRequestingAutoCompleteDialog({
          dialog: AutocompleteRequestDialog.ADD_ENTRY,
        })
      );
    });
  });
  describe('resetAutocompleteMaterials', () => {
    test('should dispatch resetAutocompleteMaterials action', () => {
      mockStore.dispatch = jest.fn();

      service.resetAutocompleteMaterials();

      expect(mockStore.dispatch).toHaveBeenCalledWith(
        resetAutocompleteMaterials()
      );
    });
  });
  describe('autocomplete', () => {
    test('should dispatch autocomplete action', () => {
      mockStore.dispatch = jest.fn();
      const autocompleteSearch = new AutocompleteSearch('name', 'Hans');

      service.autocomplete(autocompleteSearch);

      expect(mockStore.dispatch).toHaveBeenCalledWith(
        autocomplete({ autocompleteSearch })
      );
    });
    test('should not dispatch autoComplete option if filter is CustomerMaterial but customerID is not set', () => {
      mockStore.dispatch = jest.fn();
      const autocompleteSearch = new AutocompleteSearch(
        FilterNames.CUSTOMER_MATERIAL,
        'searchFor'
      );
      service.autocomplete(autocompleteSearch);
      expect(mockStore.dispatch).not.toHaveBeenCalled();
    });
  });
  describe('unselectQuotationOptions', () => {
    test('should dispatch unselectQuotationOptions action', () => {
      mockStore.dispatch = jest.fn();

      service.unselectOptions(FilterNames.CUSTOMER);

      expect(mockStore.dispatch).toHaveBeenCalledWith(
        unselectAutocompleteOptions({ filter: FilterNames.CUSTOMER })
      );
    });
    test('should call unselect options for MatNumber and MatDescription when FilterName is CustomerMaterail', () => {
      mockStore.dispatch = jest.fn();
      service.unselectOptions(FilterNames.CUSTOMER_MATERIAL);
      expect(mockStore.dispatch).not.toHaveBeenCalledWith(
        unselectAutocompleteOptions({ filter: FilterNames.MATERIAL_NUMBER })
      );
      expect(mockStore.dispatch).not.toHaveBeenCalledWith(
        unselectAutocompleteOptions({
          filter: FilterNames.MATERIAL_DESCRIPTION,
        })
      );
      expect(mockStore.dispatch).toHaveBeenCalledWith(
        unselectAutocompleteOptions({ filter: FilterNames.CUSTOMER_MATERIAL })
      );
    });
  });
  describe('selectAutocompleteOption', () => {
    test('should dispatch selectAutocompleteOption action', () => {
      mockStore.dispatch = jest.fn();
      const option = new IdValue('aud', 'Audi', true);
      const filter = FilterNames.CUSTOMER;
      service.selectCustomer(option, filter);

      expect(mockStore.dispatch).toHaveBeenCalledWith(
        selectAutocompleteOption({ option, filter })
      );
    });
  });

  describe('selectMaterialNumberDescriptionOrCustomerMaterial', () => {
    test('should dispatch setSelectedAutocompleteOption action for MaterialNumber', () => {
      mockStore.dispatch = jest.fn();
      const option = new IdValue('aud', 'Audi', true);
      const filter = FilterNames.MATERIAL_NUMBER;
      service.selectMaterialNumberDescriptionOrCustomerMaterial(option, filter);

      expect(mockStore.dispatch).toHaveBeenCalledWith(
        setSelectedAutocompleteOption({ option, filter })
      );
      expect(mockStore.dispatch).not.toHaveBeenCalledWith(
        unselectAutocompleteOptions({
          filter: FilterNames.MATERIAL_DESCRIPTION,
        })
      );
      expect(mockStore.dispatch).not.toHaveBeenCalledWith(
        unselectAutocompleteOptions({ filter: FilterNames.MATERIAL_NUMBER })
      );
    });
    test('should dispatch unselectAutocompleteOptions action for MaterialNumber and MaterialDescription', () => {
      mockStore.dispatch = jest.fn();
      const option = new IdValue('aud', 'Audi', true);
      const filter = FilterNames.CUSTOMER_MATERIAL;
      service.selectMaterialNumberDescriptionOrCustomerMaterial(option, filter);

      expect(mockStore.dispatch).toHaveBeenCalledWith(
        unselectAutocompleteOptions({ filter: FilterNames.MATERIAL_NUMBER })
      );
      expect(mockStore.dispatch).toHaveBeenCalledWith(
        unselectAutocompleteOptions({
          filter: FilterNames.MATERIAL_DESCRIPTION,
        })
      );
    });
    test('should reset all Options when resetAll is true and Filter is customerMaterial', () => {
      mockStore.dispatch = jest.fn();
      const option = new IdValue('aud', 'Audi', true);
      const filter = FilterNames.CUSTOMER_MATERIAL;
      service.selectMaterialNumberDescriptionOrCustomerMaterial(
        option,
        filter,
        true
      );

      expect(mockStore.dispatch).toHaveBeenCalledWith(
        unselectAutocompleteOptions({ filter: FilterNames.MATERIAL_NUMBER })
      );
      expect(mockStore.dispatch).toHaveBeenCalledWith(
        unselectAutocompleteOptions({
          filter: FilterNames.MATERIAL_DESCRIPTION,
        })
      );
      expect(mockStore.dispatch).toHaveBeenCalledWith(
        unselectAutocompleteOptions({ filter: FilterNames.CUSTOMER_MATERIAL })
      );
    });
    test('should reset all Options when resetAll is true and Filter is Material', () => {
      mockStore.dispatch = jest.fn();
      const option = new IdValue('aud', 'Audi', true);
      const filter = FilterNames.MATERIAL_NUMBER;
      service.selectMaterialNumberDescriptionOrCustomerMaterial(
        option,
        filter,
        true
      );

      expect(mockStore.dispatch).toHaveBeenCalledWith(
        unselectAutocompleteOptions({ filter: FilterNames.MATERIAL_NUMBER })
      );
      expect(mockStore.dispatch).toHaveBeenCalledWith(
        unselectAutocompleteOptions({
          filter: FilterNames.MATERIAL_DESCRIPTION,
        })
      );
      expect(mockStore.dispatch).toHaveBeenCalledWith(
        unselectAutocompleteOptions({ filter: FilterNames.CUSTOMER_MATERIAL })
      );
    });
  });
  describe('resetView', () => {
    test('should reset view', () => {
      mockStore.dispatch = jest.fn();

      service.resetView();

      expect(mockStore.dispatch).toHaveBeenCalledWith(
        resetAutocompleteMaterials()
      );
      expect(mockStore.dispatch).toHaveBeenCalledWith(
        resetRequestingAutoCompleteDialog()
      );
    });
  });

  describe('setRequestDialog', () => {
    test('should set request dialog', () => {
      mockStore.dispatch = jest.fn();

      service.setRequestDialog(AutocompleteRequestDialog.ADD_ENTRY);

      expect(mockStore.dispatch).toHaveBeenCalledWith(
        setRequestingAutoCompleteDialog({
          dialog: AutocompleteRequestDialog.ADD_ENTRY,
        })
      );
    });
  });
  describe('clearProcessCaseRowData', () => {
    test('should clearProcessCaseRowData', () => {
      mockStore.dispatch = jest.fn();

      service.clearProcessCaseRowData();

      expect(mockStore.dispatch).toHaveBeenCalledWith(
        ProcessCaseActions.clearRowData()
      );
    });
  });
});
