import { Router } from '@angular/router';

import { TranslocoModule } from '@jsverse/transloco';
import { createServiceFactory, SpectatorService } from '@ngneat/spectator/jest';
import { MockStore, provideMockStore } from '@ngrx/store/testing';

import { AppRoutePath } from '@ga/app-route-path.enum';
import { ApplicationScenario } from '@ga/features/grease-calculation/calculation-parameters/constants/application-scenarios.model';
import { Movement, PreferredGreaseOption } from '@ga/shared/models';

import { CalculationParametersActions } from '../../actions';
import {
  applicationScenarioDisabledHint,
  getAllGreases,
  getGreaseApplication,
  getMotionType,
  getPreferredGrease,
  isVerticalAxisOrientation,
  preselectionDisabledHint,
} from '../../selectors/calculation-parameters/calculation-parameters.selector';
import { CalculationParametersFacade } from './calculation-parameters.facade';

jest.mock('@jsverse/transloco', () => ({
  ...jest.requireActual<TranslocoModule>('@jsverse/transloco'),
  translate: jest.fn((string) => string),
}));

describe('CalculationParametersFacade', () => {
  let spectator: SpectatorService<CalculationParametersFacade>;
  let store: MockStore;
  let router: Router;
  const initialState = {
    calculationParameters: {
      competitorsGreases: [] as any[],
      schaefflerGreases: [] as any[],
      preferredGrease: {
        loading: false,
        greaseOptions: [] as any[],
        selectedGrease: undefined as any,
      },
      movements: {
        type: 'rotating' as Movement,
      },
      environment: {
        applicationScenario: undefined as any,
      },
    },
  };

  const createService = createServiceFactory({
    service: CalculationParametersFacade,
    providers: [provideMockStore({ initialState })],
  });

  beforeEach(() => {
    spectator = createService();
    store = spectator.inject(MockStore);
    router = spectator.inject(Router);
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
      CalculationParametersActions.setAutomaticLubrication({
        automaticLubrication,
      })
    );
  });

  it('should dispatch loadCompetitorsGreases and loadSchaefflerGreases actions in loadAppGreases', () => {
    const spy = jest.spyOn(store, 'dispatch');
    spectator.service.loadAppGreases();
    expect(spy).toHaveBeenCalledWith(
      CalculationParametersActions.loadCompetitorsGreases()
    );
    expect(spy).toHaveBeenCalledWith(
      CalculationParametersActions.loadSchaefflerGreases()
    );
  });

  it('should dispatch setPreferredGreaseSelection and navigate to grease miscibility in setGreaseSearchSelection', () => {
    const spy = jest.spyOn(store, 'dispatch');
    const routerSpy = jest.spyOn(router, 'navigate');
    const grease = { id: '1', name: 'Test Grease' } as any;
    spectator.service.setGreaseSearchSelection(grease);
    expect(spy).toHaveBeenCalledWith(
      CalculationParametersActions.setPreferredGreaseSelection({
        selectedGrease: { id: grease.id, text: grease.name },
      })
    );
    expect(routerSpy).toHaveBeenCalledWith([
      `${AppRoutePath.GreaseMiscibilityPath}`,
    ]);
  });

  it('should dispatch setPreferredGreaseSelection in setSelectedGrease', () => {
    const spy = jest.spyOn(store, 'dispatch');
    const selectedGrease = { id: '2', text: 'Some Grease' };
    spectator.service.setSelectedGrease(selectedGrease);
    expect(spy).toHaveBeenCalledWith(
      CalculationParametersActions.setPreferredGreaseSelection({
        selectedGrease,
      })
    );
  });

  describe('Signal-based selectors', () => {
    let localSpectator: SpectatorService<CalculationParametersFacade>;

    beforeEach(() => {
      store.resetSelectors();
    });

    it('should provide preferredGrease as a signal', () => {
      const mockValue = {
        loading: false,
        greaseOptions: [] as PreferredGreaseOption[],
        selectedGrease: { id: '1', text: 'Test Grease' },
      };
      store.overrideSelector(getPreferredGrease, mockValue);
      store.refreshState();
      localSpectator = createService();

      expect(localSpectator.service.preferredGrease()).toEqual(mockValue);
    });

    it('should provide allGreases as a signal', () => {
      const mockValue = [
        {
          name: 'Category',
          entries: [{ id: '1', text: 'Test Grease' }],
          isCompetitor: false,
        },
      ];
      store.overrideSelector(getAllGreases, mockValue);
      store.refreshState();
      localSpectator = createService();

      expect(localSpectator.service.allGreases()).toEqual(mockValue);
    });

    it('should provide applicationScenarioDisabledHint as a signal', () => {
      const mockValue = 'Application scenario is disabled';
      store.overrideSelector(applicationScenarioDisabledHint, mockValue);
      store.refreshState();
      localSpectator = createService();

      expect(localSpectator.service.applicationScenarioDisabledHint()).toEqual(
        mockValue
      );
    });

    it('should provide preselectionDisabledHint as a signal', () => {
      const mockValue = 'Preselection is disabled';
      store.overrideSelector(preselectionDisabledHint, mockValue);
      store.refreshState();
      localSpectator = createService();

      expect(localSpectator.service.preselectionDisabledHint()).toEqual(
        mockValue
      );
    });
  });
});
