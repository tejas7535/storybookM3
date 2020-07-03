import { DreiDMasterState } from '../../../app/core/store/reducers/drei-d-master/drei-d-master.reducer';

export const DREI_D_MASTER_STATE_MOCK: DreiDMasterState = {
  classificationTextInput: {
    text: 'input text',
  },
  classificationForText: {
    categories: [[10, 12]],
    probabilities: [[0.4, 0.6]],
    loading: false,
  },
};
