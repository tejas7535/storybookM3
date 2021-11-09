import { createReducer, on } from '@ngrx/store';

import {
  loadRoleDescriptions,
  loadRoleDescriptionsFailure,
  loadRoleDescriptionsSuccess,
} from '../../actions/roles/roles.actions';
import { RolesState } from './models/roles-state.model';

export const initialState: RolesState = {
  roleDescriptions: {
    loading: false,
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
    loadRoleDescriptions,
    (state: RolesState): RolesState => ({
      ...state,
      roleDescriptions: {
        ...state.roleDescriptions,
        loading: true,
        errorMessage: initialState.roleDescriptions.errorMessage,
      },
    })
  ),
  on(
    loadRoleDescriptionsSuccess,
    (state: RolesState, { roleDescriptions }): RolesState => ({
      ...state,
      roleDescriptions: {
        ...state.roleDescriptions,
        loading: false,
        items: roleDescriptions,
      },
    })
  ),
  on(
    loadRoleDescriptionsFailure,
    (state: RolesState, { errorMessage }): RolesState => ({
      ...state,
      roleDescriptions: {
        ...state.roleDescriptions,
        errorMessage,
        loading: false,
      },
    })
  )
);
