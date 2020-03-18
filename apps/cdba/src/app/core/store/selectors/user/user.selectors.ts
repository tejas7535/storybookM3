import { createSelector } from '@ngrx/store';
import { getUserState } from '../../reducers';

export const getUser = createSelector(getUserState, state => state.user);

export const getUsername = createSelector(getUser, user => user?.username);
