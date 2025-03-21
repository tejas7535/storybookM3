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
  createCustomerOgpCase,
  createCustomerOgpCaseFailure,
  createCustomerOgpCaseSuccess,
  createOgpCase,
  createOgpCaseFailure,
  createOgpCaseSuccess,
  deleteRowDataItem,
  duplicateRowDataItem,
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
  autoSelectMaterial: CaseFilterItem;
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
      // TODO: map the only option
      autoSelectMaterial: isOnlyOptionForMaterial(options, filter)
        ? { options, filter }
        : undefined,
      autocompleteItems: [...state.autocompleteItems].map((it) => {
        const tmp = { ...it };
        let itemOptions = [...options];
        if (tmp.filter === filter) {
          if (tmp.filter === FilterNames.MATERIAL_NUMBER) {
            itemOptions = itemOptions.map((opt) => ({
              ...opt,
              id: opt.id,
            }));
          } else if (tmp.filter === FilterNames.MATERIAL_DESCRIPTION) {
            itemOptions = itemOptions.map((opt) => ({
              ...opt,
              value: opt.value,
            }));
          }

          tmp.options.forEach((oldOption) => {
            const idxInNewOptions = itemOptions.findIndex(
              (newOpt) => newOpt.id === oldOption.id
            );

            if (idxInNewOptions > -1 && oldOption.selected) {
              // update received options with selected info
              itemOptions[idxInNewOptions] = {
                ...itemOptions[idxInNewOptions],
                selected: true,
              };
            }
          });
          tmp.options = itemOptions;
        }

        return tmp;
      }),
    })
  ),
  on(
    selectAutocompleteOption,
    (state: CreateCaseState, { option, filter }): CreateCaseState => ({
      ...state,
      autocompleteItems: [...state.autocompleteItems].map((it) => {
        const temp = { ...it };
        if (temp.filter === filter) {
          return { ...temp, options: selectOption(temp.options, option) };
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

        return {
          ...temp,
          options: selectOption(temp.options, optionToSelect, true),
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
    rowData: TableService.addItems(
      // the "old" case Creation needs the Currency of selectedSalesOrg
      // TODO: condition can be removed when old case creation is removed see https://jira.schaeffler.com/browse/GQUOTE-5048
      TableService.addCurrencyToMaterialItems(
        items,
        state.rowDataCurrency ??
          getCurrencyOfSelectedSalesOrg(state.customer.salesOrgs)
      ),
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
    rowData: TableService.updateItem(
      // the "old" case Creation needs the Currency of selectedSalesOrg
      // TODO: condition can be removed when old case creation is removed see https://jira.schaeffler.com/browse/GQUOTE-5048
      TableService.addCurrencyToMaterialItem(
        item,
        state.rowDataCurrency ??
          getCurrencyOfSelectedSalesOrg(state.customer.salesOrgs)
      ),
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
    (state: CreateCaseState, { materialValidations, isNewCaseCreation }) => ({
      ...state,
      rowData: [...state.rowData].map((el) =>
        TableService.validateData(
          { ...el },
          materialValidations.find((item) => item.id === el.id),
          isNewCaseCreation
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
    createOgpCase,
    (state: CreateCaseState): CreateCaseState => ({
      ...state,
      createCaseLoading: true,
    })
  ),
  on(
    createOgpCaseSuccess,
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
    createOgpCaseFailure,
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
    (state: CreateCaseState): CreateCaseState => ({
      ...state,
      createCaseLoading: false,
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
    createCustomerOgpCase,
    (state: CreateCaseState): CreateCaseState => ({
      ...state,
      createCaseLoading: true,
    })
  ),
  on(
    createCustomerOgpCaseSuccess,
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
    createCustomerOgpCaseFailure,
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
  const itemOptions = [...options];
  const index = checkAllValues
    ? itemOptions.findIndex(
        (idValue) =>
          idValue.id === option.id &&
          idValue.value2 === option.value2 &&
          idValue.value === option.value
      )
    : itemOptions.findIndex((idValue) => idValue.id === option.id);

  itemOptions.map((opt) => ({ ...opt, selected: true }));

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

// eslint-disable-next-line prefer-arrow/prefer-arrow-functions
export function reducer(
  state: CreateCaseState,
  action: Action
): CreateCaseState {
  return createCaseReducer(state, action);
}
