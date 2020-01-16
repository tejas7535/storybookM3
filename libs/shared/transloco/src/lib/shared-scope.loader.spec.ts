import { sharedScopeLoader } from './shared-scope.loader';

describe('sharedScopeLoader', () => {
  test('should import desired language', () => {
    const result = sharedScopeLoader(
      ['de', 'en'],
      (lang: string, root: string) => import(`./${root}/${lang}.json`)
    );
    expect(result['en']).toBeDefined();
  });
});
