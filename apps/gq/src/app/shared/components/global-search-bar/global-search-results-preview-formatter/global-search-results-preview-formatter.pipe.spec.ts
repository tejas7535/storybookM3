import { SecurityContext } from '@angular/core';
import { DomSanitizer } from '@angular/platform-browser';

import { createPipeFactory, SpectatorPipe } from '@ngneat/spectator';

import { IdValue } from '../../../models/search';
import { NumberCurrencyPipe } from '../../../pipes/number-currency/number-currency.pipe';
import { GlobalSearchResultsPreviewFormatterPipe } from './global-search-results-preview-formatter.pipe';

describe('GlobalSearchResultsPreviewFormatterPipe', () => {
  let spectator: SpectatorPipe<GlobalSearchResultsPreviewFormatterPipe>;
  let sanitizer: DomSanitizer;

  const createPipe = createPipeFactory({
    pipe: NumberCurrencyPipe,
    providers: [
      {
        provide: DomSanitizer,
        useValue: {
          sanitize: jest.fn(),
        },
      },
    ],
  });

  beforeEach(() => {
    spectator = createPipe();
    sanitizer = spectator.inject(DomSanitizer);
  });

  it('create an instance', () => {
    const pipe = new GlobalSearchResultsPreviewFormatterPipe(sanitizer);

    expect(pipe).toBeTruthy();
  });

  describe('transform', () => {
    test('should format id', () => {
      const idValue = {
        id: '234408-M-SP-#E',
        value: '019038763000002',
      } as IdValue;
      const searchString = '234408';
      const pipe = new GlobalSearchResultsPreviewFormatterPipe(sanitizer);

      const mockSanitizerResult = 'sanitizer-output';
      sanitizer.sanitize = jest.fn().mockReturnValue(mockSanitizerResult);

      const htmlString = pipe.transform(idValue, searchString);

      expect(sanitizer.sanitize).toHaveBeenCalledWith(
        SecurityContext.HTML,
        '<span class="text-high-emphasis font-bold">234408</span><span class="text-medium-emphasis">-M-SP-#E</span>'
      );
      expect(sanitizer.sanitize).toHaveBeenCalledTimes(1);
      expect(htmlString).toEqual(mockSanitizerResult);
    });

    test('should format value', () => {
      const idValue = {
        id: 'L-0G9E7-0009-00    Steuergeraet ZSB#S',
        value: '234408944000010',
      } as IdValue;
      const searchString = '2344089';
      const pipe = new GlobalSearchResultsPreviewFormatterPipe(sanitizer);

      const mockSanitizerResult = 'sanitizer-output';
      sanitizer.sanitize = jest.fn().mockReturnValue(mockSanitizerResult);

      const htmlString = pipe.transform(idValue, searchString);

      expect(sanitizer.sanitize).toHaveBeenCalledWith(
        SecurityContext.HTML,
        '<span class="text-high-emphasis font-bold">2344089</span><span class="text-medium-emphasis">44000010</span>'
      );
      expect(sanitizer.sanitize).toHaveBeenCalledTimes(1);
      expect(htmlString).toEqual(mockSanitizerResult);
    });
  });
});
