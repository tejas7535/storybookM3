import { StepName } from '../../reducers/steps/steps.enum';
import {
  getBearingModel,
  getBearingSeat,
  getBearingSeries,
  getBearingType,
  getCurrentStep,
  getMeasurementMethod,
  getMountingMethod,
  getStepsURLParams,
} from './steps.selector';

describe('Steps Selectors', () => {
  const fakeState = {
    currentStep: StepName.Methods,
    bearingType: 'some bearing type',
    bearingSeries: 'some bearing series',
    bearingModel: 'some bearing model',
    bearingSeat: 'some bearing seat',
    measurementMethod: 'some measurement method',
    mountingMethod: 'some mounting method',
  };

  test('getCurrentStep', () => {
    expect(getCurrentStep(fakeState)).toEqual(fakeState.currentStep);
  });

  test('getBearingType', () => {
    expect(getBearingType(fakeState)).toEqual(fakeState.bearingType);
  });

  test('getBearingSeries', () => {
    expect(getBearingSeries(fakeState)).toEqual(fakeState.bearingSeries);
  });

  test('getBearingModel', () => {
    expect(getBearingModel(fakeState)).toEqual(fakeState.bearingModel);
  });

  test('getBearingSeat', () => {
    expect(getBearingSeat(fakeState)).toEqual(fakeState.bearingSeat);
  });

  test('getMeasurementMethod', () => {
    expect(getMeasurementMethod(fakeState)).toEqual(
      fakeState.measurementMethod
    );
  });

  test('getMountingMethod', () => {
    expect(getMountingMethod(fakeState)).toEqual(fakeState.mountingMethod);
  });

  test('getStepsURLParams', () => {
    const expectedParams =
      // eslint-disable-next-line max-len
      'bearingType=some%20bearing%20type&bearingSeries=some%20bearing%20series&bearingModel=some%20bearing%20model&bearingSeat=some%20bearing%20seat&measurementMethod=some%20measurement%20method&mountingMethod=some%20mounting%20method';
    expect(getStepsURLParams(fakeState)).toEqual(expectedParams);
  });
});
