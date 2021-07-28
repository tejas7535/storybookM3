import { KPIState } from './utils.selector';

/**
 * Generic function to handle State rerieveiels
 * @param state
 * @returns
 */
export const getState = <KPIState>(state: KPIState): KPIState => ({
  ...state,
  loading: true,
});

export const getStateSuccess =
  (propname: string) =>
  <KPIState>(state: KPIState, props: any): KPIState => ({
    ...state,
    result: props[propname],
    loading: false,
  });

export const getStateFailure =
  () =>
  // eslint-disable-next-line unicorn/consistent-function-scoping
  <KPIState>(state: KPIState): KPIState => ({
    ...state,
    loading: false,
  });

export const getStateLatest =
  <DataReturnType>() =>
  <T extends KPIState<DataReturnType>>(state: T): T => ({
    ...state,
    status: {
      ...state.status,
      loading: true,
    },
  });

export const getStateLatestSuccess =
  (propname: string) =>
  <KPIState>(state: KPIState, props: any): KPIState => ({
    ...state,
    status: {
      result: props[propname],
      loading: false,
    },
  });

export const getStateLatestFailure =
  <DataReturnType>() =>
  <T extends KPIState<DataReturnType>>(state: T): T => ({
    ...state,
    status: {
      ...state.status,
      loading: false,
    },
  });
