// tslint:disable-next-line: only-arrow-functions
export function sharedScopeLoader(
  availableLangs: string[],
  importer: any,
  root = 'i18n'
): any {
  return availableLangs.reduce((acc, lang) => {
    acc[lang] = () => importer(lang, root);

    return acc;
  }, {});
}
