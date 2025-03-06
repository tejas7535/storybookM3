import { createServiceFactory, SpectatorService } from '@ngneat/spectator/jest';
import { MockStore, provideMockStore } from '@ngrx/store/testing';

import { ApplicationScenario } from '@ga/features/grease-calculation/calculation-parameters/constants/application-scenarios.model';
import { Movement } from '@ga/shared/models';

import { setAutomaticLubrication } from '../../actions/calculation-parameters/calculation-parameters.actions';
import {
  getGreaseApplication,
  getMotionType,
  isVerticalAxisOrientation,
} from '../../selectors/calculation-parameters/calculation-parameters.selector';
import { CalculationParametersFacade } from './calculation-parameters.facade';

describe('CalculationParametersFacade', () => {
  let spectator: SpectatorService<CalculationParametersFacade>;
  let store: MockStore;
  const initialState = {};

  const createService = createServiceFactory({
    service: CalculationParametersFacade,
    providers: [provideMockStore({ initialState })],
  });

  beforeEach(() => {
    spectator = createService();
    store = spectator.inject(MockStore);
  });

  it('should be created', () => {
    expect(spectator.service).toBeTruthy();
  });

  it('should select isVerticalAxisOrientation$', (done) => {
    const expectedValue = true;
    store.overrideSelector(isVerticalAxisOrientation, expectedValue);

    spectator.service.isVerticalAxisOrientation$.subscribe((value) => {
      expect(value).toBe(expectedValue);
      done();
    });

    store.refreshState();
  });

  it('should select selectedGreaseApplication$', (done) => {
    const expectedValue = ApplicationScenario.BallScrewDrive;
    store.overrideSelector(getGreaseApplication, expectedValue);

    spectator.service.selectedGreaseApplication$.subscribe((value) => {
      expect(value).toBe(expectedValue);
      done();
    });

    store.refreshState();
  });

  it('should select motionType$', (done) => {
    const expectedValue = Movement.rotating;
    store.overrideSelector(getMotionType, expectedValue);

    spectator.service.motionType$.subscribe((value) => {
      expect(value).toBe(expectedValue);
      done();
    });

    store.refreshState();
  });

  it('should dispatch setAutomaticLubrication action', () => {
    const spy = jest.spyOn(store, 'dispatch');
    const automaticLubrication = true;

    spectator.service.setAutomaticLubrication(automaticLubrication);

    expect(spy).toHaveBeenCalledWith(
      setAutomaticLubrication({ automaticLubrication })
    );
  });
});
