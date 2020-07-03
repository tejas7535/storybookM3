import * as testJsonDe from './i18n/de.json';
import * as testJsonEn from './i18n/en.json';
import {
  pageNotFoundLoader,
  PageNotFoundModule,
} from './page-not-found.module';

describe('PageNotFoundModule', () => {
  let module: PageNotFoundModule;

  beforeEach(() => {
    module = new PageNotFoundModule();
  });

  test('should exist', () => {
    expect(module).toBeDefined();
  });

  describe('importer', () => {
    test('de should import language from root path', () => {
      pageNotFoundLoader['de']().then((result: any) => {
        expect(result).toStrictEqual(testJsonDe);
      });
    });
    test('en should import language from root path', () => {
      pageNotFoundLoader['en']().then((result: any) => {
        expect(result).toStrictEqual(testJsonEn);
      });
    });
  });
});
