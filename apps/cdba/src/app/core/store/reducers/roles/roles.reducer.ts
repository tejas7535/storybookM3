import { createReducer, on } from '@ngrx/store';

import {
  loadRoleDescriptionsFailure,
  loadRoleDescriptionsSuccess,
} from '../../actions/roles/roles.actions';
import { RolesState } from './models/roles-state.model';

export const initialState: RolesState = {
  roleDescriptions: {
    loaded: false,
    items: {
      productLines: undefined,
      subRegions: undefined,
    },
    errorMessage: undefined,
  },
};

export const rolesReducer = createReducer(
  initialState,
  on(
    loadRoleDescriptionsSuccess,
    (state: RolesState, { roleDescriptions }): RolesState => ({
      ...state,
      roleDescriptions: {
        loaded: true,
        items: roleDescriptions,
        errorMessage: initialState.roleDescriptions.errorMessage,
      },
    })
  ),
  on(
    loadRoleDescriptionsFailure,
    (state: RolesState, { errorMessage }): RolesState => ({
      ...state,
      roleDescriptions: {
        loaded: false,
        items: initialState.roleDescriptions.items,
        errorMessage,
      },
    })
  )
);
