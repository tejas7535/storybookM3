import { of } from 'rxjs';

import { TranslocoService } from '@jsverse/transloco';

import { createTranslationObservables } from './options.helper';

describe('createTranslationObservables', () => {
  let translocoService: TranslocoService;

  beforeEach(() => {
    translocoService = {
      selectTranslate: jest.fn((key: string) => of(`translated_${key}`)),
    } as Partial<TranslocoService> as TranslocoService;
  });

  it('should create translation observables', (done) => {
    const baseKey = 'test.';
    const items = [
      { key: 'item1', value: 'value1' },
      { key: 'item2', value: 'value2' },
    ];

    const observables = createTranslationObservables(
      translocoService,
      baseKey,
      items
    );

    observables[0].subscribe((result) => {
      expect(result).toEqual({
        label: 'translated_test.item1',
        value: 'value1',
      });
    });

    observables[1].subscribe((result) => {
      expect(result).toEqual({
        label: 'translated_test.item2',
        value: 'value2',
      });
      done();
    });
  });
});
