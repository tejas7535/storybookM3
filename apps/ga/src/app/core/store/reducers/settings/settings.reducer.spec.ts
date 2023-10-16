import {
  setAppDelivery,
  setCurrentStep,
  setPartnerVersion,
} from '@ga/core/store/actions/settings/settings.actions';
import { PartnerVersion } from '@ga/shared/models';

import { initialState, reducer } from './settings.reducer';

describe('Settings Reducer', () => {
  it('should set app delivery', () => {
    const state = reducer(
      initialState,
      setAppDelivery({ appDelivery: 'embedded' })
    );

    expect(state.environment.appDelivery).toEqual('embedded');
  });

  it('should set current step', () => {
    const newStep = 2;
    const state = reducer(initialState, setCurrentStep({ step: newStep }));

    expect(state.stepper.currentStep).toEqual(newStep);
  });

  it('should set partner version', () => {
    const partnerVersion = PartnerVersion.Schmeckthal;
    const state = reducer(
      initialState,
      setPartnerVersion({ partnerVersion: PartnerVersion.Schmeckthal })
    );

    expect(state.environment.partnerVersion).toEqual(partnerVersion);
  });
});
