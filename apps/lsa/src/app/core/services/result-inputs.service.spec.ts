import { combineLatest, of, ReplaySubject } from 'rxjs';

import { TranslocoService } from '@jsverse/transloco';
import { LubricantType, Optime } from '@lsa/shared/constants';
import { PipeLength } from '@lsa/shared/constants/tube-length.enum';
import {
  ErrorResponse,
  RecommendationFormValue,
  RecommendationResponse,
} from '@lsa/shared/models';
import { ResultInputModel } from '@lsa/shared/models/result-inputs.model';
import {
  mockApplicationInput,
  mockLubricantInput,
  mockLubricationPointsInput,
} from '@lsa/testing/mocks/input.mock';
import { createServiceFactory, SpectatorService } from '@ngneat/spectator/jest';

import { provideTranslocoTestingModule } from '@schaeffler/transloco/testing';

import { RestService } from './rest.service';
import { ResultInputsService } from './result-inputs.service';

describe('ResultInputsService', () => {
  let spectator: SpectatorService<ResultInputsService>;

  const recommendationSubject$ = new ReplaySubject<
    RecommendationResponse | ErrorResponse
  >(1);

  const recommendations$ = recommendationSubject$.asObservable();

  const createService = createServiceFactory({
    service: ResultInputsService,
    imports: [provideTranslocoTestingModule({ en: {} })],
    providers: [
      {
        provide: RestService,
        useValue: {
          recommendation$: recommendations$,
        },
      },
    ],
    mocks: [TranslocoService],
  });

  beforeEach(() => {
    spectator = createService();
    const translocoService = spectator.inject(TranslocoService);
    translocoService.selectTranslate = jest.fn((key: string) =>
      of(`translated: ${key}`)
    ) as any;

    translocoService.translate = jest.fn(
      (key: string) => `translated: ${key}`
    ) as any;
  });

  it('should be created', () => {
    expect(spectator.service).toBeTruthy();
  });

  describe('when getting result inputs', () => {
    let mockFormValue: RecommendationFormValue;
    let result: ResultInputModel;

    beforeEach(() => {
      mockFormValue = {
        lubricationPoints: mockLubricationPointsInput,
        lubricant: mockLubricantInput,
        application: mockApplicationInput,
      };

      recommendationSubject$.next({
        input: {
          optime: Optime.No,
        },
      } as RecommendationResponse);
      result = spectator.service.getResultInputs(mockFormValue);
    });

    it('should return title observable translation', (done) => {
      combineLatest([
        result.sections[0].title$,
        result.sections[1].title$,
        result.sections[2].title$,
      ]).subscribe(
        ([lubricationPointsTitle, lubricantTitle, applicationTitle]) => {
          expect(lubricationPointsTitle).toMatchSnapshot();
          expect(lubricantTitle).toMatchSnapshot();
          expect(applicationTitle).toMatchSnapshot();
          done();
        }
      );
    });

    it('should return lubrication Points observable translation', (done) => {
      result.sections[0].inputs$.subscribe((lubricationPointsInputs) => {
        expect(lubricationPointsInputs).toMatchSnapshot();
        done();
      });
    });

    it('should return Lubricant observable translation', (done) => {
      result.sections[1].inputs$.subscribe((lubricationPointsInputs) => {
        expect(lubricationPointsInputs).toMatchSnapshot();
        done();
      });
    });

    it('should return application observable translation', (done) => {
      result.sections[2].inputs$.subscribe((lubricationPointsInputs) => {
        expect(lubricationPointsInputs).toMatchSnapshot();
        done();
      });
    });

    describe('when remote optime returns error', () => {
      beforeEach(() => {
        recommendationSubject$.next({
          message: 'some error',
        } as ErrorResponse);
        result = spectator.service.getResultInputs({
          ...mockFormValue,
          lubricationPoints: {
            ...mockFormValue.lubricationPoints,
            pipeLength: PipeLength.FiveTotenMeter,
          },
        });
      });

      it('should return lubrication Points observable translation based on form value', (done) => {
        result.sections[0].inputs$.subscribe((lubricationPointsInputs) => {
          expect(lubricationPointsInputs).toMatchSnapshot();
          done();
        });
      });
    });
  });

  describe('when getting non arcanol inputs', () => {
    let mockFormValue: RecommendationFormValue;
    let result: ResultInputModel;

    beforeEach(() => {
      mockFormValue = {
        lubricationPoints: {
          ...mockLubricationPointsInput,
          pipeLength: PipeLength.HalfMeter,
        },
        lubricant: {
          ...mockLubricantInput,
          lubricantType: LubricantType.Grease,
        },
        application: mockApplicationInput,
      };
      result = spectator.service.getResultInputs(mockFormValue);
    });

    it('should return title observable translation', (done) => {
      combineLatest([
        result.sections[0].title$,
        result.sections[1].title$,
        result.sections[2].title$,
      ]).subscribe(
        ([lubricationPointsTitle, lubricantTitle, applicationTitle]) => {
          expect(lubricationPointsTitle).toMatchSnapshot();
          expect(lubricantTitle).toMatchSnapshot();
          expect(applicationTitle).toMatchSnapshot();
          done();
        }
      );
    });

    it('should return lubrication Points inputs observable translation', (done) => {
      result.sections[0].inputs$.subscribe((lubricationPointsInputs) => {
        expect(lubricationPointsInputs).toMatchSnapshot();
        done();
      });
    });

    it('should return Lubricant inputs observable translation', (done) => {
      result.sections[1].inputs$.subscribe((lubricationPointsInputs) => {
        expect(lubricationPointsInputs).toMatchSnapshot();
        done();
      });
    });

    it('should return application inputs observable translation', (done) => {
      result.sections[2].inputs$.subscribe((lubricationPointsInputs) => {
        expect(lubricationPointsInputs).toMatchSnapshot();
        done();
      });
    });
  });
});
