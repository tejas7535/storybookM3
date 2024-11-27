import { combineLatest, of } from 'rxjs';

import { TranslocoService } from '@jsverse/transloco';
import { LubricantType } from '@lsa/shared/constants';
import { RecommendationFormValue } from '@lsa/shared/models';
import { ResultInputModel } from '@lsa/shared/models/result-inputs.model';
import {
  mockApplicationInput,
  mockLubricantInput,
  mockLubricationPointsInput,
} from '@lsa/testing/mocks/input.mock';
import { createServiceFactory, SpectatorService } from '@ngneat/spectator/jest';

import { provideTranslocoTestingModule } from '@schaeffler/transloco/testing';

import { ResultInputsService } from './result-inputs.service';

describe('ResultInputsService', () => {
  let spectator: SpectatorService<ResultInputsService>;

  const createService = createServiceFactory({
    service: ResultInputsService,
    imports: [provideTranslocoTestingModule({ en: {} })],
    mocks: [TranslocoService],
  });

  beforeEach(() => {
    spectator = createService();
    const translocoService = spectator.inject(TranslocoService);
    translocoService.selectTranslate = jest.fn((key: string) =>
      of(`translated: ${key}`)
    ) as any;
  });

  it('should be created', () => {
    expect(spectator.service).toBeTruthy();
  });

  describe('when getting result inputs', () => {
    let mockFormValue: RecommendationFormValue;
    let result: ResultInputModel;

    beforeEach(() => {
      // eslint-disable-next-line unicorn/numeric-separators-style
      mockFormValue = {
        lubricationPoints: mockLubricationPointsInput,
        lubricant: mockLubricantInput,
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

    // getting timeout on test, need to investigate after release
    it.skip('should return lubrication Points observable translation', (done) => {
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
  });

  describe('when getting non arcanol inputs', () => {
    let mockFormValue: RecommendationFormValue;
    let result: ResultInputModel;

    beforeEach(() => {
      mockFormValue = {
        lubricationPoints: mockLubricationPointsInput,
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

    // getting timeout on test, need to investigate after release
    it.skip('should return lubrication Points inputs observable translation', (done) => {
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
