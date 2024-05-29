import { CreateCaseState } from '../../../app/core/store/reducers/create-case/create-case.reducer';
import { AutocompleteRequestDialog } from '../../../app/shared/components/autocomplete-input/autocomplete-request-dialog.enum';

export const CREATE_CASE_STORE_STATE_MOCK: CreateCaseState = {
  autocompleteLoading: undefined,
  autoSelectMaterial: undefined,
  autocompleteItems: [],
  requestingDialog: AutocompleteRequestDialog.ADD_ENTRY,
  customer: {
    customerId: undefined,
    salesOrgs: undefined,
    errorMessage: undefined,
    salesOrgsLoading: false,
  },
  plSeries: {
    errorMessage: undefined,
    loading: false,
    plsAndSeries: { series: [], pls: [], gpsdGroupIds: [] },
    materialSelection: { includeQuotationHistory: false, salesIndications: [] },
    historicalDataLimitInYear: 2,
  },
  purchaseOrderType: { id: '112', name: 'Purchase Order Type' },
  createdCase: undefined,
  createCaseLoading: false,
  errorMessage: undefined,
  rowData: [],
  validationLoading: false,
  sectorGpsd: { id: '14', name: 'Sector GPSD' },
};
