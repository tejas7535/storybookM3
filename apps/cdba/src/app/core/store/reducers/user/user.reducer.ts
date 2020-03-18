import { Action, createReducer, on } from '@ngrx/store';
import { User } from '@schaeffler/shared/auth';

import { login, loginSuccess } from '../../actions';

export interface UserState {
  user: User;
}

export const initialState: UserState = {
  user: undefined
};

const userReducer = createReducer(
  initialState,
  on(login, state => state),
  on(loginSuccess, (state, { user }) => ({ ...state, user }))
);

// tslint:disable-next-line: only-arrow-functions
export function reducer(state: UserState, action: Action): UserState {
  return userReducer(state, action);
}
