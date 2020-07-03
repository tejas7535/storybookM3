import * as testJsonDe from './i18n/de.json';
import * as testJsonEn from './i18n/en.json';
import {
  unsupportedViewportLoader,
  UnsupportedViewportModule,
} from './unsupported-viewport.module';

describe('UnsupportedViewportModule', () => {
  let unsupportedViewportModule: UnsupportedViewportModule;

  beforeEach(() => {
    unsupportedViewportModule = new UnsupportedViewportModule();
  });

  it('should be created', () => {
    expect(unsupportedViewportModule).toBeTruthy();
  });

  describe('importer', () => {
    test('de should import language from root path', () => {
      unsupportedViewportLoader['de']().then((result: any) => {
        expect(result).toStrictEqual(testJsonDe);
      });
    });
    test('en should import language from root path', () => {
      unsupportedViewportLoader['en']().then((result: any) => {
        expect(result).toStrictEqual(testJsonEn);
      });
    });
  });
});
