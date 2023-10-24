import { AppDelivery, PartnerVersion } from '@ga/shared/models';

import {
  getInternalUser,
  initSettingsEffects,
  setAppDelivery,
  setCurrentStep,
  setInternalUser,
  setPartnerVersion,
} from './settings.actions';

describe('Settings Actions', () => {
  describe('Init Settings Effects', () => {
    it('initSettingsEffects', () => {
      const action = initSettingsEffects();

      expect(action).toEqual({
        type: '[Settings] Init Settings Effects',
      });
    });
  });

  describe('Set App Delivery', () => {
    it('setAppDelivery', () => {
      const appDelivery = AppDelivery.Standalone;
      const action = setAppDelivery({ appDelivery });

      expect(action).toEqual({
        appDelivery,
        type: '[Settings] Set App Delivery',
      });
    });
  });

  describe('Set Current Step', () => {
    it('setCurrentStep', () => {
      const step = 3;
      const action = setCurrentStep({ step });

      expect(action).toEqual({
        step,
        type: '[Settings] Set Current Step',
      });
    });
  });

  describe('Set Partner Version', () => {
    it('setPartnerVersion', () => {
      const partnerVersion = PartnerVersion.Schmeckthal;
      const action = setPartnerVersion({ partnerVersion });

      expect(action).toEqual({
        partnerVersion,
        type: '[Settings] Set Partner Version',
      });
    });
  });

  describe('Get Internal User', () => {
    it('getInternalUser', () => {
      const action = getInternalUser();

      expect(action).toEqual({
        type: '[Settings] Get Internal User',
      });
    });
  });

  describe('Set Internal User', () => {
    it('setInternalUser', () => {
      const internalUser = true;
      const action = setInternalUser({ internalUser });

      expect(action).toEqual({
        internalUser,
        type: '[Settings] Set Internal User',
      });
    });
  });
});
