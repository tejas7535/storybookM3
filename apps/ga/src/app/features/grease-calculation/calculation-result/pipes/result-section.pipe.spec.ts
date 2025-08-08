import { TranslocoLocaleService } from '@jsverse/transloco-locale';
import { createServiceFactory, SpectatorService } from '@ngneat/spectator/jest';

import {
  greaseSelectionMock,
  initialLubricationMock,
  performanceMock,
  relubricationMock,
} from '@ga/testing/mocks';

import { ResultSectionPipe } from './result-section.pipe';

jest.mock('@jsverse/transloco', () => ({
  ...jest.requireActual('@jsverse/transloco'),
  translate: jest.fn((key: string) => key),
}));

describe('ResultSectionPipe', () => {
  let pipe: ResultSectionPipe;
  let spectator: SpectatorService<ResultSectionPipe>;

  const createPipe = createServiceFactory({
    service: ResultSectionPipe,
    providers: [
      {
        provide: TranslocoLocaleService,
        useValue: {
          localizeNumber: (number: number) => `${number}`,
        },
      },
    ],
  });

  beforeEach(() => {
    spectator = createPipe();
    pipe = spectator.service;
  });

  it('should tranform the result matching the snapshot', () => {
    expect(pipe).toBeTruthy();
  });

  describe('transform', () => {
    it.each([
      ['initialLubrication', initialLubricationMock],
      ['performance', performanceMock],
      ['relubrication', relubricationMock],
      ['greaseSelection', greaseSelectionMock],
    ])('should transform the result with %s', (_, resultSectionRaw) => {
      const result = pipe.transform(resultSectionRaw);

      expect(result).toMatchSnapshot();
    });
  });
});
