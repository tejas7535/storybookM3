import { CustomMissingTranslationHandler } from '@gq/shared/custom-missing-translation-handler';
import { createServiceFactory, SpectatorService } from '@ngneat/spectator/jest';
import { TranslocoMissingHandlerData } from '@ngneat/transloco/lib/transloco-missing-handler';

describe('CustomMissingTranslationHandler', () => {
  let handler: CustomMissingTranslationHandler;
  let spectator: SpectatorService<CustomMissingTranslationHandler>;

  const createService = createServiceFactory({
    service: CustomMissingTranslationHandler,
  });

  beforeEach(() => {
    spectator = createService();
    handler = spectator.service;
  });

  describe('handle missing translations', () => {
    test('should return the given key', () => {
      expect(
        handler.handle('key that is missing', {} as TranslocoMissingHandlerData)
      ).toEqual('key that is missing');
    });
    test('should return the given key, when a parameter is given', () => {
      expect(
        handler.handle(
          'key that is missing',
          {} as TranslocoMissingHandlerData,
          { anyParameter: 'fallback value' }
        )
      ).toEqual('key that is missing');
    });
    test('should the given fallback value', () => {
      expect(
        handler.handle(
          'key that is missing',
          {} as TranslocoMissingHandlerData,
          { fallback: 'fallback value' }
        )
      ).toEqual('fallback value');
    });
  });
});
