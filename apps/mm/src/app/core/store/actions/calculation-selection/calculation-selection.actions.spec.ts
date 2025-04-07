import { BearingOption } from '@mm/shared/models';
import { ListValue } from '@mm/shared/models/list-value.model';

import { CalculationSelectionActions } from '.';

describe('CalculationSelectionActions', () => {
  it('should create an action to search bearing list', () => {
    expect(
      CalculationSelectionActions.searchBearingList({ query: '220' })
    ).toMatchSnapshot();
  });

  it('should create searchBearingSuccess action', () => {
    const resultList: BearingOption[] = [{ id: '1', title: 'Bearing 1' }];
    const action = CalculationSelectionActions.searchBearingSuccess({
      resultList,
    });
    expect(action).toMatchSnapshot();
  });

  it('should create resetBearing action', () => {
    const action = CalculationSelectionActions.resetBearing();
    expect(action).toMatchSnapshot();
  });

  it('should create fetchBearingData action', () => {
    const bearingId = '123';
    const action = CalculationSelectionActions.fetchBearingData({ bearingId });
    expect(action).toMatchSnapshot();
  });

  it('should create setBearing action', () => {
    const bearingId = '123';
    const title = 'Bearing Title';
    const action = CalculationSelectionActions.setBearing({ bearingId, title });
    expect(action).toMatchSnapshot();
  });

  it('should create setCurrentStep action', () => {
    const step = 1;
    const action = CalculationSelectionActions.setCurrentStep({ step });
    expect(action).toMatchSnapshot();
  });

  it('should create setBearingSeats action', () => {
    const bearingSeats: ListValue[] = [{ id: '1', text: 'Seat 1' }];
    const action = CalculationSelectionActions.setBearingSeats({
      bearingSeats,
    });
    expect(action).toMatchSnapshot();
  });

  it('should create setBearingSeat action', () => {
    const bearingSeatId = 'seat123';
    const action = CalculationSelectionActions.setBearingSeat({
      bearingSeatId,
    });
    expect(action).toMatchSnapshot();
  });

  it('should create fetchMeasurementMethods action', () => {
    const action = CalculationSelectionActions.fetchMeasurementMethods();
    expect(action).toMatchSnapshot();
  });

  it('should create setMeasurementMethods action', () => {
    const measurementMethods: ListValue[] = [{ id: '1', text: 'Method 1' }];
    const action = CalculationSelectionActions.setMeasurementMethods({
      measurementMethods,
    });
    expect(action).toMatchSnapshot();
  });

  it('should create setMeasurementMethod action', () => {
    const measurementMethod = 'method123';
    const action = CalculationSelectionActions.setMeasurementMethod({
      measurementMethod,
    });
    expect(action).toMatchSnapshot();
  });

  it('should create fetchMountingMethods action', () => {
    const action = CalculationSelectionActions.fetchMountingMethods();
    expect(action).toMatchSnapshot();
  });

  it('should create setMountingMethods action', () => {
    const mountingMethods: ListValue[] = [{ id: '1', text: 'Method 1' }];
    const action = CalculationSelectionActions.setMountingMethods({
      mountingMethods,
    });
    expect(action).toMatchSnapshot();
  });

  it('should create updateMountingMethodAndCurrentStep action', () => {
    const mountingMethod = 'method123';
    const action =
      CalculationSelectionActions.updateMountingMethodAndCurrentStep({
        mountingMethod,
      });
    expect(action).toMatchSnapshot();
  });

  it('should create setMountingMethod action', () => {
    const mountingMethod = 'method123';
    const action = CalculationSelectionActions.setMountingMethod({
      mountingMethod,
    });
    expect(action).toMatchSnapshot();
  });

  it('should create fetchPreflightOptions action', () => {
    const action = CalculationSelectionActions.fetchPreflightOptions();
    expect(action).toMatchSnapshot();
  });

  it('should create setPreflightOptions action', () => {
    const action = CalculationSelectionActions.setPreflightOptions();
    expect(action).toMatchSnapshot();
  });
});
