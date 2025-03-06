import { waitForAsync } from '@angular/core/testing';

import { ReplaySubject } from 'rxjs';

import { TranslocoService } from '@jsverse/transloco';
import { createServiceFactory, SpectatorService } from '@ngneat/spectator/jest';
import { MockStore, provideMockStore } from '@ngrx/store/testing';

import { provideTranslocoTestingModule } from '@schaeffler/transloco/testing';

import { CalculationParametersFacade } from '@ga/core/store';
import { Movement } from '@ga/shared/models';

import { ApplicationScenario } from '../../calculation-parameters/constants/application-scenarios.model';
import { GreaseReportSubordinate } from '../models';
import { GreaseRecommendationService } from './grease-recommendation.service';

const MOCK_GREASE_SUBORDINATES_SUFFICIENT: GreaseReportSubordinate[] = [
  {
    identifier: 'greaseResult',
    greaseResult: {
      mainTitle: 'Arcanol Clean M',
      subTitle: '',
      dataSource: [],
      isSufficient: true,
      isPreferred: false,
    } as GreaseReportSubordinate['greaseResult'],
  },
  // This grease should be recommended for fan applications
  {
    identifier: 'greaseResult',
    greaseResult: {
      mainTitle: 'Arcanol TEMP90',
      subTitle: '',
      dataSource: [],
      isSufficient: true,
      isPreferred: false,
    } as GreaseReportSubordinate['greaseResult'],
  },

  // This is the grease that should be recommended for oscillating loads
  {
    identifier: 'greaseResult',
    greaseResult: {
      mainTitle: 'Arcanol MOTION 2',
      subTitle: '',
      dataSource: [],
      isSufficient: true,
      isPreferred: false,
    } as GreaseReportSubordinate['greaseResult'],
  },

  // This recommendation is for lage electric motors, which serves as a testing value for
  // handling insufficient greases
  {
    identifier: 'greaseResult',
    greaseResult: {
      mainTitle: 'Arcanol MULTITOP',
      subTitle: '',
      dataSource: [],
      isSufficient: false,
      isPreferred: false,
    } as GreaseReportSubordinate['greaseResult'],
  },
] as const;

describe('GreaseRecommendationService', () => {
  let spectator: SpectatorService<GreaseRecommendationService>;
  let service: GreaseRecommendationService;

  let store: MockStore;

  let mockRecommendationSubordinates: GreaseReportSubordinate[];

  const selectedApplication$$ = new ReplaySubject<ApplicationScenario>(1);
  const motionType$$ = new ReplaySubject<Movement>(1);

  const createService = createServiceFactory({
    service: GreaseRecommendationService,
    imports: [provideTranslocoTestingModule({})],
    providers: [
      provideMockStore({ initialState: {} }),
      {
        provide: CalculationParametersFacade,
        useValue: {
          selectedGreaseApplication$: selectedApplication$$,
          motionType$: motionType$$,
        },
      },
      {
        provide: TranslocoService,
        useValue: {
          translate: jest.fn((payload) => payload),
        },
      },
    ],
  });

  beforeEach(() => {
    spectator = createService();
    service = spectator.service;

    store = spectator.inject(MockStore);

    // This is a workaround to have deep cloning of the object without having to install another library
    mockRecommendationSubordinates = JSON.parse(
      JSON.stringify(MOCK_GREASE_SUBORDINATES_SUFFICIENT)
    );

    selectedApplication$$.next(ApplicationScenario.Fans);
    motionType$$.next(Movement.rotating);
  });

  afterEach(() => {
    jest.resetAllMocks();
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should mark TEMP90 is the recommendation for Fan applications', waitForAsync(async () => {
    await service.processGreaseRecommendation(mockRecommendationSubordinates);

    expect(mockRecommendationSubordinates[0].greaseResult.mainTitle).toEqual(
      'Arcanol TEMP90'
    );
    expect(
      mockRecommendationSubordinates[0].greaseResult.isRecommended
    ).toEqual(true);
    expect(
      mockRecommendationSubordinates
        .flatMap((sub) => sub.greaseResult.isRecommended)
        .filter(Boolean).length
    ).toEqual(1);
  }));

  it('should mark MOTION 2 as the recommendation for oscillating loads', waitForAsync(async () => {
    motionType$$.next(Movement.oscillating);
    selectedApplication$$.next(ApplicationScenario.All);

    await service.processGreaseRecommendation(mockRecommendationSubordinates);

    expect(mockRecommendationSubordinates[0].greaseResult.mainTitle).toEqual(
      'Arcanol MOTION 2'
    );
    expect(mockRecommendationSubordinates[0].greaseResult.isRecommended).toBe(
      true
    );
    expect(
      mockRecommendationSubordinates
        .flatMap((sub) => sub.greaseResult.isRecommended)
        .filter(Boolean).length
    ).toEqual(1);
  }));

  it('should emit an error when the recommended grease is insufficient', waitForAsync(async () => {
    selectedApplication$$.next(ApplicationScenario.LargeElectricMotors);
    const dispatchSpy = jest.spyOn(store, 'dispatch');

    await service.processGreaseRecommendation(mockRecommendationSubordinates);

    expect(dispatchSpy).toHaveBeenCalledTimes(1);
    expect(mockRecommendationSubordinates).toStrictEqual(
      MOCK_GREASE_SUBORDINATES_SUFFICIENT
    );
    expect(
      mockRecommendationSubordinates
        .flatMap((sub) => sub.greaseResult.isRecommended)
        .filter(Boolean).length
    ).toEqual(0);
  }));
});
