import { forbiddenLoader, ForbiddenModule } from './forbidden.module';
import * as testJsonDe from './i18n/de.json';
import * as testJsonEn from './i18n/en.json';

describe('ForbiddenModule', () => {
  let module: ForbiddenModule;

  beforeEach(() => {
    module = new ForbiddenModule();
  });

  test('should exist', () => {
    expect(module).toBeDefined();
  });

  describe('importer', () => {
    test('de should import language from root path', () => {
      forbiddenLoader['de']().then((result: any) => {
        expect(result).toStrictEqual(testJsonDe);
      });
    });
    test('en should import language from root path', () => {
      forbiddenLoader['en']().then((result: any) => {
        expect(result).toStrictEqual(testJsonEn);
      });
    });
  });
});
