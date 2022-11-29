import { MaterialCostDetailsState } from '../../../app/core/store/reducers/material-cost-details/material-cost-details.reducer';
import { MaterialCostDetails } from '../../../app/shared/models/quotation-detail/material-cost-details';

export const MATERIAL_COST_DETAILS_STATE_MOCK: MaterialCostDetailsState = {
  materialCostDetails: {} as MaterialCostDetails,
  materialCostDetailsLoading: false,
  errorMessage: '',
};
