import { AttritionOverTime, EmployeesRequest } from '../../../shared/models';
import { OverviewFluctuationRates } from '../../../shared/models/overview-fluctuation-rates';
import {
  loadAttritionOverTimeOverview,
  loadAttritionOverTimeOverviewFailure,
  loadAttritionOverTimeOverviewSuccess,
  loadFluctuationRatesOverview,
  loadFluctuationRatesOverviewFailure,
  loadFluctuationRatesOverviewSuccess,
} from './overview.action';

describe('Overview Actions', () => {
  const errorMessage = 'An error occured';

  test('loadAttritionOverTimeOverview', () => {
    const request = {} as unknown as EmployeesRequest;
    const action = loadAttritionOverTimeOverview({ request });

    expect(action).toEqual({
      request,
      type: '[Overview] Load AttritionOverTime for last three years',
    });
  });

  test('loadAttritionOverTimeOverviewSuccess', () => {
    const data: AttritionOverTime = {} as unknown as AttritionOverTime;

    const action = loadAttritionOverTimeOverviewSuccess({
      data,
    });

    expect(action).toEqual({
      data,
      type: '[Overview] Load AttritionOverTime for last three years Success',
    });
  });

  test('loadAttritionOverTimeOverviewFailure', () => {
    const action = loadAttritionOverTimeOverviewFailure({ errorMessage });

    expect(action).toEqual({
      errorMessage,
      type: '[Overview] Load AttritionOverTime for last three years Failure',
    });
  });

  test('loadFluctuationRatesOverview', () => {
    const request = {} as unknown as EmployeesRequest;
    const action = loadFluctuationRatesOverview({ request });

    expect(action).toEqual({
      request,
      type: '[Overview] Load FluctuationRates with entries and exits',
    });
  });

  test('loadFluctuationRatesOverviewSuccess', () => {
    const data = {} as unknown as OverviewFluctuationRates;
    const action = loadFluctuationRatesOverviewSuccess({
      data,
    });

    expect(action).toEqual({
      data,
      type: '[Overview] Load FluctuationRates with entries and exits Success',
    });
  });

  test('loadFluctuationRatesOverviewFailure', () => {
    const action = loadFluctuationRatesOverviewFailure({ errorMessage });

    expect(action).toEqual({
      errorMessage,
      type: '[Overview] Load FluctuationRates with entries and exits Failure',
    });
  });
});
