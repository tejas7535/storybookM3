export interface KPIState<DataReturnType> {
  loading: boolean;
  result?: DataReturnType[];
  status: {
    result?: DataReturnType;
    loading: boolean;
  };
}

/**
 * Generic Function to get result from a state object
 */
export const getResult =
  <DataReturnType>() =>
  <T extends KPIState<DataReturnType>>(state: T) =>
    state?.result;
/**
 * Generic Function to get a loading indicator from a state object
 */
export const getLoading =
  <DataReturnType>() =>
  <T extends KPIState<DataReturnType>>(state: T) =>
    state?.loading;
