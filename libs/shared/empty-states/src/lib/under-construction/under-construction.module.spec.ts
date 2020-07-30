import * as testJsonDe from './i18n/de.json';
import * as testJsonEn from './i18n/en.json';
import {
  underConstructionLoader,
  UnderConstructionModule,
} from './under-construction.module';

describe('PageUnderConstructionModule', () => {
  let module: UnderConstructionModule;

  beforeEach(() => {
    module = new UnderConstructionModule();
  });

  test('should exist', () => {
    expect(module).toBeDefined();
  });

  describe('importer', () => {
    test('de should import language from root path', () => {
      underConstructionLoader['de']().then((result: any) => {
        expect(result).toStrictEqual(testJsonDe);
      });
    });
    test('en should import language from root path', () => {
      underConstructionLoader['en']().then((result: any) => {
        expect(result).toStrictEqual(testJsonEn);
      });
    });
  });
});
