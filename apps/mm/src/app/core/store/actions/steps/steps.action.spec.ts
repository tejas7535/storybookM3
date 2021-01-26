import { StepName } from '../../reducers/steps/steps.enum';
import {
  setBearingModel,
  setBearingSeat,
  setBearingSeries,
  setBearingType,
  setMeasurementMethod,
  setMountingMethod,
  setStep,
  StepsActions,
} from './steps.action';

describe('Steps actions', () => {
  let action: StepsActions;

  beforeEach(() => {
    action = undefined;
  });

  test('setStep', () => {
    const currentStep = StepName.Methods;
    action = setStep({ currentStep });

    expect(action).toEqual({
      type: '[Steps] Set Step',
      currentStep,
    });
  });

  test('setBearingType', () => {
    const bearingType = 'someBearingType';
    action = setBearingType({ bearingType });

    expect(action).toEqual({
      type: '[Steps] Set Bearing Type',
      bearingType,
    });
  });

  test('setBearingSeries', () => {
    const bearingSeries = 'someBearingSeries';
    action = setBearingSeries({ bearingSeries });

    expect(action).toEqual({
      type: '[Steps] Set Bearing Series',
      bearingSeries,
    });
  });

  test('setBearingModel', () => {
    const bearingModel = 'someBearingModel';
    action = setBearingModel({ bearingModel });

    expect(action).toEqual({
      type: '[Steps] Set Bearing Model',
      bearingModel,
    });
  });

  test('setBearingSeat', () => {
    const bearingSeat = 'someBearingSeat';
    action = setBearingSeat({ bearingSeat });

    expect(action).toEqual({
      type: '[Steps] Set Bearing Seat',
      bearingSeat,
    });
  });

  test('setMeasurementMethod', () => {
    const measurementMethod = 'someMeasurementMethod';
    action = setMeasurementMethod({ measurementMethod });

    expect(action).toEqual({
      type: '[Steps] Set Measurement Method',
      measurementMethod,
    });
  });

  test('setMountingMethod', () => {
    const mountingMethod = 'someMountingMethod';
    action = setMountingMethod({ mountingMethod });

    expect(action).toEqual({
      type: '[Steps] Set Mounting Method',
      mountingMethod,
    });
  });
});
