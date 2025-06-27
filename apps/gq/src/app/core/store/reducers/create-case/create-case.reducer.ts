import { AutocompleteRequestDialog } from '@gq/shared/components/autocomplete-input/autocomplete-request-dialog.enum';
import { FilterNames } from '@gq/shared/components/autocomplete-input/filter-names.enum';
import { MATERIAL_FILTERS } from '@gq/shared/constants';
import { PurchaseOrderType } from '@gq/shared/models';
import { OfferType } from '@gq/shared/models/offer-type.interface';
import { IdValue } from '@gq/shared/models/search';
import { SectorGpsd } from '@gq/shared/models/sector-gpsd.interface';
import {
  MaterialTableItem,
  ValidationDescription,
} from '@gq/shared/models/table';
import { MaterialAutoComplete } from '@gq/shared/services/rest/material/models/material-autocomplete-response.interface';
import { TableService } from '@gq/shared/services/table/table.service';
import {
  mapIdValueToMaterialAutoComplete,
  mapMaterialAutocompleteToIdValue,
} from '@gq/shared/utils/misc.utils';
import { Action, createReducer, on } from '@ngrx/store';

import {
  addRowDataItems,
  autocomplete,
  autocompleteFailure,
  autocompleteSuccess,
  clearCreateCaseRowData,
  clearCustomer,
  clearOfferType,
  clearPurchaseOrderType,
  clearSectorGpsd,
  clearShipToParty,
  createCase,
  createCaseFailure,
  createCaseSuccess,
  createCustomerCase,
  createCustomerCaseFailure,
  createCustomerCaseSuccess,
  deleteRowDataItem,
  duplicateRowDataItem,
  findDefaultCustomerMaterialNumberFor,
  getPLsAndSeries,
  getPLsAndSeriesFailure,
  getPLsAndSeriesSuccess,
  getSalesOrgsFailure,
  getSalesOrgsForShipToPartySuccess,
  getSalesOrgsSuccess,
  importCase,
  importCaseFailure,
  importCaseSuccess,
  resetAllAutocompleteOptions,
  resetAutocompleteMaterials,
  resetCustomerFilter,
  resetPLsAndSeries,
  resetProductLineAndSeries,
  resetRequestingAutoCompleteDialog,
  selectAutocompleteOption,
  selectOfferType,
  selectPurchaseOrderType,
  selectSalesOrg,
  selectSectorGpsd,
  setRequestingAutoCompleteDialog,
  setRowDataCurrency,
  setSelectedAutocompleteOption,
  setSelectedGpsdGroups,
  setSelectedProductLines,
  setSelectedSeries,
  unselectAutocompleteOptions,
  updateCurrencyOfPositionItems,
  updateRowDataItem,
  validateMaterialsOnCustomerAndSalesOrg,
  validateMaterialsOnCustomerAndSalesOrgFailure,
  validateMaterialsOnCustomerAndSalesOrgSuccess,
} from '../../actions';
import { SalesIndication } from '../../transactions/models/sales-indication.enum';
import {
  CaseFilterItem,
  CreateCaseResponse,
  PLsAndSeries,
  SalesOrg,
} from './models';

/* eslint-disable max-lines */
export interface CreateCaseState {
  autocompleteLoading: string;
  autocompleteItems: CaseFilterItem[];
  customerMaterialNumbersFromServer: MaterialAutoComplete[];
  autoSelectMaterial: CaseFilterItem;
  defaultCustomerMaterialNumber: string;
  requestingDialog: AutocompleteRequestDialog;
  customer: {
    customerId: string;
    salesOrgsLoading: boolean;
    salesOrgs: SalesOrg[];
    errorMessage: string;
  };
  shipToParty: {
    customerId: string;
    salesOrgsLoading: boolean;
    salesOrgs: SalesOrg[];
  };
  plSeries: {
    loading: boolean;
    errorMessage: string;
    plsAndSeries: PLsAndSeries;
    materialSelection: {
      includeQuotationHistory: boolean;
      salesIndications: SalesIndication[];
    };
    historicalDataLimitInYear: number;
  };
  purchaseOrderType: PurchaseOrderType;
  createdCase: CreateCaseResponse;
  createCaseLoading: boolean;
  errorMessage: string;
  rowData: MaterialTableItem[];
  rowDataCurrency: string;
  validationLoading: boolean;
  sectorGpsd: SectorGpsd;
  offerType: OfferType;
}
export const initialState: CreateCaseState = {
  autocompleteLoading: undefined,
  autoSelectMaterial: undefined,
  customerMaterialNumbersFromServer: [],
  defaultCustomerMaterialNumber: undefined,
  requestingDialog: AutocompleteRequestDialog.EMPTY,
  autocompleteItems: [
    {
      filter: FilterNames.SAP_QUOTATION,
      options: [],
    },
    {
      filter: FilterNames.CUSTOMER,
      options: [],
    },
    {
      filter: FilterNames.CUSTOMER_AND_SHIP_TO_PARTY,
      options: [],
    },
    {
      filter: FilterNames.MATERIAL_NUMBER,
      options: [],
    },
    {
      filter: FilterNames.MATERIAL_DESCRIPTION,
      options: [],
    },
    {
      filter: FilterNames.MATERIAL_NUMBER_OR_DESCRIPTION,
      options: [],
    },
    {
      filter: FilterNames.CUSTOMER_MATERIAL,
      options: [],
    },
  ],
  customer: {
    customerId: undefined,
    salesOrgsLoading: false,
    salesOrgs: [],
    errorMessage: undefined,
  },
  shipToParty: {
    customerId: undefined,
    salesOrgsLoading: false,
    salesOrgs: [],
  },
  plSeries: {
    loading: false,
    errorMessage: undefined,
    plsAndSeries: undefined,
    materialSelection: {
      includeQuotationHistory: undefined,
      salesIndications: [],
    },
    historicalDataLimitInYear: undefined,
  },
  purchaseOrderType: undefined,
  createdCase: undefined,
  createCaseLoading: false,
  errorMessage: undefined,
  rowData: [],
  rowDataCurrency: undefined,
  validationLoading: false,
  sectorGpsd: undefined,
  offerType: undefined,
};

const isOnlyOptionForMaterial = (options: any, filter: any): boolean =>
  MATERIAL_FILTERS.includes(filter) && options.length === 1;

export const createCaseReducer = createReducer(
  initialState,
  on(
    autocomplete,
    (state: CreateCaseState, { autocompleteSearch }): CreateCaseState => ({
      ...state,
      autocompleteLoading: autocompleteSearch.filter,
    })
  ),
  on(
    autocompleteFailure,
    (state: CreateCaseState): CreateCaseState => ({
      ...state,
      autocompleteLoading: initialState.autocompleteLoading,
    })
  ),
  on(
    autocompleteSuccess,
    (state: CreateCaseState, { options, filter }): CreateCaseState => ({
      ...state,
      autocompleteLoading: initialState.autocompleteLoading,
      customerMaterialNumbersFromServer: [
        ...state.customerMaterialNumbersFromServer,
        ...(MATERIAL_FILTERS.includes(filter)
          ? options.map((option) =>
              mapIdValueToMaterialAutoComplete(option, filter)
            )
          : []),
      ],
      // TODO: map the only option
      autoSelectMaterial: isOnlyOptionForMaterial(options, filter)
        ? { options, filter }
        : undefined,
      autocompleteItems: [...state.autocompleteItems].map((it) => {
        const tmp = { ...it };
        const itemOptions = [...options];
        if (tmp.filter === filter) {
          tmp.options = itemOptions;
        }

        return tmp;
      }),
    })
  ),
  on(
    findDefaultCustomerMaterialNumberFor,
    (
      state: CreateCaseState,
      { materialNumber, currentCustomerMaterialNumber }
    ): CreateCaseState => ({
      ...state,
      defaultCustomerMaterialNumber: findDefaultCustomerMaterialNumber(
        materialNumber,
        currentCustomerMaterialNumber,
        state
      ),
    })
  ),
  on(
    selectAutocompleteOption,
    (state: CreateCaseState, { option, filter }): CreateCaseState => ({
      ...state,
      customerMaterialNumbersFromServer: [], // customer material numbers are dependend on on the customer/sales org => clear
      autocompleteItems: [...state.autocompleteItems].map((it) => {
        const temp = { ...it };
        if (temp.filter === filter) {
          return { ...temp, options: selectOption(temp.options, option, true) };
        }

        return temp;
      }),
      customer: {
        ...state.customer,
        salesOrgsLoading: filter === FilterNames.CUSTOMER,
        salesOrgs:
          filter === FilterNames.CUSTOMER ? [] : state.customer.salesOrgs,
        customerId:
          filter === FilterNames.CUSTOMER
            ? option.id
            : state.customer.customerId,
      },
      shipToParty: {
        ...state.shipToParty,
        salesOrgsLoading: filter === FilterNames.CUSTOMER_AND_SHIP_TO_PARTY,
        salesOrgs:
          filter === FilterNames.CUSTOMER_AND_SHIP_TO_PARTY
            ? []
            : state.shipToParty.salesOrgs,
        customerId:
          filter === FilterNames.CUSTOMER_AND_SHIP_TO_PARTY
            ? option.id
            : state.shipToParty.customerId,
      },
    })
  ),
  on(
    setSelectedAutocompleteOption,
    (state: CreateCaseState, { filter, option }): CreateCaseState => ({
      ...state,
      defaultCustomerMaterialNumber: findDefaultCustomerMaterialNumberByIdValue(
        filter,
        state,
        option
      ),
      autocompleteItems: [...state.autocompleteItems].map((it) => {
        const temp = { ...it };
        if (temp.filter === filter) {
          return { ...temp, options: selectOption(temp.options, option, true) };
        }

        const setFor: string[] = MATERIAL_FILTERS.filter((f) => f !== filter);
        if (!setFor.includes(temp.filter)) {
          return temp;
        }

        const optionToSelect: IdValue = mapIdValueFromOneFilterToAnother(
          option,
          filter,
          temp.filter
        );

        let tempOptions = [...temp.options];

        // try to find additional further cmn options if material number/description were selected by checking already loaded items with the same material number
        if (
          temp.filter === FilterNames.CUSTOMER_MATERIAL &&
          MATERIAL_FILTERS.includes(filter)
        ) {
          // check if there are further options
          tempOptions = state.autocompleteItems
            .find((item) => item.filter === FilterNames.MATERIAL_NUMBER)
            ?.options.filter((op) => op.id === option.id)
            .map((op) => {
              const transformed = mapIdValueFromOneFilterToAnother(
                op,
                FilterNames.MATERIAL_NUMBER,
                temp.filter
              );

              // value2 is material number 15 or material description
              transformed.selected = op.value2 === option.value2;

              return transformed;
            });
        }

        return {
          ...temp,
          options: selectOption(tempOptions, optionToSelect, true),
        };
      }),
    })
  ),
  on(
    unselectAutocompleteOptions,
    (state: CreateCaseState, { filter }): CreateCaseState => ({
      ...state,
      autocompleteItems: [...state.autocompleteItems].map((it) => {
        const temp = { ...it };
        if (temp.filter === filter) {
          // when options have only 1 item, clear the complete array, otherwise the option will be reselected
          temp.options =
            temp.options.length > 1
              ? temp.options.map((opt) => ({
                  ...opt,
                  selected: false,
                }))
              : [];
        }

        return temp;
      }),
      customer: {
        ...state.customer,
        customerId:
          filter === FilterNames.CUSTOMER
            ? undefined
            : state.customer.customerId,
        salesOrgs:
          filter === FilterNames.CUSTOMER ? [] : state.customer.salesOrgs,
      },
    })
  ),
  on(
    resetAllAutocompleteOptions,
    (state: CreateCaseState): CreateCaseState => ({
      ...state,
      autocompleteItems: initialState.autocompleteItems,
    })
  ),
  on(
    resetAutocompleteMaterials,
    (state: CreateCaseState): CreateCaseState => ({
      ...state,
      defaultCustomerMaterialNumber: undefined,
      autocompleteItems: state.autocompleteItems.map((autocompleteItem, i) =>
        [
          FilterNames.CUSTOMER,
          FilterNames.CUSTOMER_AND_SHIP_TO_PARTY,
          FilterNames.SAP_QUOTATION,
        ].includes(autocompleteItem.filter)
          ? state.autocompleteItems[i]
          : initialState.autocompleteItems[i]
      ),
    })
  ),
  on(
    setRequestingAutoCompleteDialog,
    (state: CreateCaseState, { dialog }): CreateCaseState => ({
      ...state,
      requestingDialog: dialog,
    })
  ),
  on(
    resetRequestingAutoCompleteDialog,
    (state: CreateCaseState): CreateCaseState => ({
      ...state,
      requestingDialog: AutocompleteRequestDialog.EMPTY,
    })
  ),
  on(addRowDataItems, (state: CreateCaseState, { items }) => ({
    ...state,
    defaultCustomerMaterialNumber: undefined as any,
    rowData: TableService.addItems(
      TableService.addCurrencyToMaterialItems(items, state.rowDataCurrency),
      [...state.rowData]
    ),
    validationLoading: true,
  })),
  on(duplicateRowDataItem, (state: CreateCaseState, { itemId }) => ({
    ...state,
    rowData: TableService.duplicateItem(itemId, [...state.rowData]),
  })),
  on(updateRowDataItem, (state: CreateCaseState, { item, revalidate }) => ({
    ...state,
    defaultCustomerMaterialNumber: undefined as any,
    rowData: TableService.updateItem(
      TableService.addCurrencyToMaterialItem(item, state.rowDataCurrency),
      state.rowData,
      revalidate
    ),
  })),
  on(
    clearCreateCaseRowData,
    (state: CreateCaseState): CreateCaseState => ({
      ...state,
      rowData: initialState.rowData,
    })
  ),
  on(deleteRowDataItem, (state: CreateCaseState, { id }) => ({
    ...state,
    rowData: TableService.deleteItem(id, [...state.rowData]),
  })),
  on(
    validateMaterialsOnCustomerAndSalesOrg,
    (state: CreateCaseState): CreateCaseState => ({
      ...state,
      validationLoading: true,
    })
  ),
  on(
    validateMaterialsOnCustomerAndSalesOrgSuccess,
    (state: CreateCaseState, { materialValidations }) => ({
      ...state,
      rowData: [...state.rowData].map((el) =>
        TableService.validateData(
          { ...el },
          materialValidations.find((item) => item.id === el.id)
        )
      ),
      validationLoading: false,
    })
  ),
  on(
    validateMaterialsOnCustomerAndSalesOrgFailure,
    (state: CreateCaseState) => ({
      ...state,
      rowData: [...state.rowData].map((el) => {
        if (el.info.description[0] === ValidationDescription.Valid) {
          return el;
        }

        return {
          ...el,
          info: {
            ...el.info,
            description: [ValidationDescription.ValidationFailure],
          },
        };
      }),
      validationLoading: false,
    })
  ),
  on(
    createCase,
    (state: CreateCaseState): CreateCaseState => ({
      ...state,
      createCaseLoading: true,
    })
  ),
  on(
    createCaseSuccess,
    (state: CreateCaseState, { createdCase }): CreateCaseState => ({
      ...state,
      createdCase,
      createCaseLoading: false,
      autocompleteItems: initialState.autocompleteItems,
      customer: initialState.customer,
      rowData: initialState.rowData,
      purchaseOrderType: initialState.purchaseOrderType,
    })
  ),
  on(
    createCaseFailure,
    (state: CreateCaseState, { errorMessage }): CreateCaseState => ({
      ...state,
      errorMessage,
      createCaseLoading: false,
    })
  ),
  on(
    importCase,
    (state: CreateCaseState): CreateCaseState => ({
      ...state,
      createCaseLoading: true,
      errorMessage: initialState.errorMessage,
    })
  ),
  on(
    importCaseSuccess,
    (state: CreateCaseState): CreateCaseState => ({
      ...state,
      createCaseLoading: false,
      autocompleteItems: initialState.autocompleteItems,
    })
  ),
  on(
    importCaseFailure,
    (state: CreateCaseState, { errorMessage }): CreateCaseState => ({
      ...state,
      errorMessage,
      createCaseLoading: false,
    })
  ),
  on(
    getSalesOrgsSuccess,
    (state: CreateCaseState, { salesOrgs }): CreateCaseState => ({
      ...state,
      customer: {
        ...state.customer,
        salesOrgs,
        salesOrgsLoading: false,
      },
      rowData: TableService.updateStatusAndCurrencyOnCustomerOrSalesOrgChanged(
        [...state.rowData],
        getCurrencyOfSelectedSalesOrg(salesOrgs)
      ),
    })
  ),
  on(
    getSalesOrgsForShipToPartySuccess,
    (state: CreateCaseState, { salesOrgs }): CreateCaseState => ({
      ...state,
      shipToParty: {
        ...state.shipToParty,
        salesOrgs,
        salesOrgsLoading: false,
      },
    })
  ),
  on(
    getSalesOrgsFailure,
    (state: CreateCaseState, { errorMessage }): CreateCaseState => ({
      ...state,
      customer: {
        ...state.customer,
        errorMessage,
        salesOrgsLoading: false,
      },
    })
  ),
  on(
    selectSalesOrg,
    (state: CreateCaseState, { salesOrgId }): CreateCaseState => {
      const updatedSalesOrgs = [...state.customer.salesOrgs].map((el) => ({
        ...el,
        selected: el.id === salesOrgId,
      }));

      return {
        ...state,
        customerMaterialNumbersFromServer: [], // customer material numbers are dependend on on the customer/sales org => clear
        customer: {
          ...state.customer,
          salesOrgs: updatedSalesOrgs,
        },
        rowData:
          TableService.updateStatusAndCurrencyOnCustomerOrSalesOrgChanged(
            [...state.rowData],
            getCurrencyOfSelectedSalesOrg(updatedSalesOrgs)
          ),
      };
    }
  ),
  on(
    selectPurchaseOrderType,
    (state: CreateCaseState, { purchaseOrderType }): CreateCaseState => ({
      ...state,
      purchaseOrderType,
    })
  ),
  on(
    selectSectorGpsd,
    (state: CreateCaseState, { sectorGpsd }): CreateCaseState => ({
      ...state,
      sectorGpsd,
    })
  ),
  on(
    selectOfferType,
    (state: CreateCaseState, { offerType }): CreateCaseState => ({
      ...state,
      offerType,
    })
  ),
  on(
    clearCustomer,
    (state: CreateCaseState): CreateCaseState => ({
      ...state,
      customer: initialState.customer,
    })
  ),
  on(
    clearShipToParty,
    (state: CreateCaseState): CreateCaseState => ({
      ...state,
      shipToParty: initialState.shipToParty,
    })
  ),
  on(
    getPLsAndSeries,
    (state: CreateCaseState, { customerFilters }): CreateCaseState => ({
      ...state,
      plSeries: {
        errorMessage: initialState.plSeries.errorMessage,
        plsAndSeries: initialState.plSeries.plsAndSeries,
        loading: true,
        materialSelection: {
          includeQuotationHistory: customerFilters.includeQuotationHistory,
          salesIndications: customerFilters.salesIndications,
        },
        historicalDataLimitInYear: customerFilters.historicalDataLimitInYear,
      },
    })
  ),
  on(
    getPLsAndSeriesSuccess,
    (state: CreateCaseState, { plsAndSeries }): CreateCaseState => ({
      ...state,
      plSeries: {
        ...state.plSeries,
        plsAndSeries,
        loading: false,
      },
    })
  ),
  on(
    getPLsAndSeriesFailure,
    (state: CreateCaseState, { errorMessage }): CreateCaseState => ({
      ...state,
      plSeries: {
        ...state.plSeries,
        errorMessage,
        loading: false,
      },
    })
  ),
  on(
    setSelectedProductLines,
    (state: CreateCaseState, { selectedProductLines }): CreateCaseState => ({
      ...state,
      plSeries: {
        ...state.plSeries,
        plsAndSeries: {
          ...state.plSeries.plsAndSeries,
          pls: state.plSeries.plsAndSeries.pls.map((pl) => ({
            ...pl,
            selected: selectedProductLines.includes(pl.value),
          })),
        },
      },
    })
  ),
  on(
    setSelectedSeries,
    (state: CreateCaseState, { selectedSeries }): CreateCaseState => ({
      ...state,
      plSeries: {
        ...state.plSeries,
        plsAndSeries: {
          ...state.plSeries.plsAndSeries,
          series: state.plSeries.plsAndSeries.series.map((series) => ({
            ...series,
            selected: selectedSeries.includes(series.value),
          })),
        },
      },
    })
  ),
  on(
    setSelectedGpsdGroups,
    (state: CreateCaseState, { selectedGpsdGroups }): CreateCaseState => ({
      ...state,
      plSeries: {
        ...state.plSeries,
        plsAndSeries: {
          ...state.plSeries.plsAndSeries,
          gpsdGroupIds: state.plSeries.plsAndSeries.gpsdGroupIds.map(
            (gpsdGroups) => ({
              ...gpsdGroups,
              selected: selectedGpsdGroups.includes(gpsdGroups.value),
            })
          ),
        },
      },
    })
  ),
  on(
    resetProductLineAndSeries,
    (state: CreateCaseState): CreateCaseState => ({
      ...state,
      plSeries: initialState.plSeries,
    })
  ),
  on(
    createCustomerCase,
    (state: CreateCaseState): CreateCaseState => ({
      ...state,
      createCaseLoading: true,
    })
  ),
  on(
    createCustomerCaseSuccess,
    (state: CreateCaseState, { createdCase }): CreateCaseState => ({
      ...state,
      createCaseLoading: false,
      createdCase,
      autocompleteItems: initialState.autocompleteItems,
      plSeries: initialState.plSeries,
      customer: initialState.customer,
    })
  ),
  on(
    createCustomerCaseFailure,
    (state: CreateCaseState, { errorMessage }): CreateCaseState => ({
      ...state,
      createCaseLoading: false,
      errorMessage,
    })
  ),
  on(
    resetCustomerFilter,
    (state: CreateCaseState): CreateCaseState => ({
      ...state,
      customer: initialState.customer,
      autocompleteItems: initialState.autocompleteItems,
    })
  ),
  on(
    resetPLsAndSeries,
    (state: CreateCaseState): CreateCaseState => ({
      ...state,
      plSeries: initialState.plSeries,
    })
  ),
  on(
    clearPurchaseOrderType,
    (state: CreateCaseState): CreateCaseState => ({
      ...state,
      purchaseOrderType: initialState.purchaseOrderType,
    })
  ),
  on(
    clearSectorGpsd,
    (state: CreateCaseState): CreateCaseState => ({
      ...state,
      sectorGpsd: initialState.sectorGpsd,
    })
  ),
  on(
    clearOfferType,
    (state: CreateCaseState): CreateCaseState => ({
      ...state,
      offerType: initialState.offerType,
    })
  ),
  on(
    setRowDataCurrency,
    (state: CreateCaseState, { currency }): CreateCaseState => ({
      ...state,
      rowDataCurrency: currency,
    })
  ),
  on(
    updateCurrencyOfPositionItems,
    (state: CreateCaseState): CreateCaseState => ({
      ...state,
      rowData: TableService.updateCurrencyOfItems(
        [...state.rowData],
        state.rowDataCurrency
      ),
    })
  )
);

const selectOption = (
  options: IdValue[],
  option: IdValue,
  checkAllValues: boolean = false
): IdValue[] => {
  let itemOptions = [...options];
  const index = checkAllValues
    ? itemOptions.findIndex(
        (idValue) =>
          idValue.id === option.id &&
          idValue.value2 === option.value2 &&
          idValue.value === option.value
      )
    : itemOptions.findIndex((idValue) => idValue.id === option.id);

  itemOptions = itemOptions.map((opt) => ({ ...opt, selected: false }));

  // if option already in Array
  if (index > -1) {
    itemOptions[index] = { ...itemOptions[index], selected: true };
  } else {
    itemOptions.push({ ...option, selected: true });
  }

  return itemOptions;
};

const mapIdValueFromOneFilterToAnother = (
  option: IdValue,
  fromFilter: string,
  toFilter: string
): IdValue =>
  mapMaterialAutocompleteToIdValue(
    mapIdValueToMaterialAutoComplete(option, fromFilter),
    toFilter
  );

/**
 * returns the currency of the selected SalesOrg or undefined if no salesOrg is selected
 */
const getCurrencyOfSelectedSalesOrg = (salesOrgs: SalesOrg[]): string => {
  const foundIndex = salesOrgs.findIndex((item: SalesOrg) => item.selected);

  if (foundIndex < 0) {
    return undefined;
  }

  return salesOrgs[foundIndex]?.currency;
};

const findDefaultCustomerMaterialNumber = (
  materialNumber: string,
  currentCustomerMaterialNumber: string,
  state: CreateCaseState
) => {
  const matches = state.customerMaterialNumbersFromServer.filter(
    (cmn) => cmn.materialNumber15 === materialNumber
  );

  const match = matches.find(
    (elem) => elem.customerMaterial === currentCustomerMaterialNumber
  )?.customerMaterial;

  return match ?? matches[0]?.customerMaterial;
};

const findDefaultCustomerMaterialNumberByIdValue = (
  filter: string,
  state: CreateCaseState,
  option: IdValue
): string => {
  if (!MATERIAL_FILTERS.includes(filter)) {
    return undefined;
  }

  const mappedOption = mapIdValueToMaterialAutoComplete(option, filter);

  const matches = state.customerMaterialNumbersFromServer.filter(
    (cmn) => cmn.materialNumber15 === mappedOption.materialNumber15
  );

  // if customer material has been selected, then it was already loaded before and should be selected
  if (filter === FilterNames.CUSTOMER_MATERIAL) {
    return matches.find(
      (match) => match.customerMaterial === mappedOption.customerMaterial
    )?.customerMaterial;
  }

  return matches[0]?.customerMaterial;
};

// eslint-disable-next-line prefer-arrow/prefer-arrow-functions
export function reducer(
  state: CreateCaseState,
  action: Action
): CreateCaseState {
  return createCaseReducer(state, action);
}
