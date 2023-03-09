import { createServiceFactory, SpectatorService } from '@ngneat/spectator';
import { MockStore, provideMockStore } from '@ngrx/store/testing';

import { AutocompleteRequestDialog } from '../../../shared/components/autocomplete-input/autocomplete-request-dialog.enum';
import { FilterNames } from '../../../shared/components/autocomplete-input/filter-names.enum';
import { AutocompleteSearch, IdValue } from '../../../shared/models/search';
import {
  autocomplete,
  clearProcessCaseRowData,
  resetAutocompleteMaterials,
  resetRequestingAutoCompleteDialog,
  selectAutocompleteOption,
  setRequestingAutoCompleteDialog,
  setSelectedAutocompleteOption,
  unselectAutocompleteOptions,
} from '../actions';
import { AutoCompleteFacade } from './autocomplete.facade';

describe('autocompleteFacade', () => {
  let service: AutoCompleteFacade;
  let spectator: SpectatorService<AutoCompleteFacade>;
  let mockStore: MockStore;

  const createService = createServiceFactory({
    service: AutoCompleteFacade,
    providers: [provideMockStore({})],
  });
  beforeEach(() => {
    spectator = createService();
    service = spectator.service;
    mockStore = spectator.inject(MockStore);
  });

  test('should be created', () => {
    expect(service).toBeTruthy();
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
  });
  describe('unselectQuotationOptions', () => {
    test('should dispatch unselectQuotationOptions action', () => {
      mockStore.dispatch = jest.fn();

      service.unselectOptions(FilterNames.CUSTOMER);

      expect(mockStore.dispatch).toHaveBeenCalledWith(
        unselectAutocompleteOptions({ filter: FilterNames.CUSTOMER })
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

  describe('setSelectedAutocompleteOption', () => {
    test('should dispatch setSelectedAutocompleteOption action', () => {
      mockStore.dispatch = jest.fn();
      const option = new IdValue('aud', 'Audi', true);
      const filter = FilterNames.CUSTOMER;
      service.selectMaterialNumberOrDescription(option, filter);

      expect(mockStore.dispatch).toHaveBeenCalledWith(
        setSelectedAutocompleteOption({ option, filter })
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
        clearProcessCaseRowData()
      );
    });
  });
});
