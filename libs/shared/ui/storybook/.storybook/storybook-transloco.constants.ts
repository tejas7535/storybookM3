import { TranslocoService } from '@jsverse/transloco';

import { StoryFn } from '@storybook/angular';

let translocoServiceInstance: TranslocoService | null;

export const STORYBOOK_SUPPORTED_LANGUAGES = [
  { code: 'de', icon: '🇩🇪', title: 'Deutsch' },
  { code: 'en', icon: '🇺🇸', title: 'English' },
  { code: 'es', icon: '🇪🇸', title: 'Español' },
  { code: 'fr', icon: '🇫🇷', title: 'Français' },
  { code: 'ru', icon: '🇷🇺', title: 'Русский' },
  { code: 'zh', icon: '🇨🇳', title: '中文' },
];

export const STORYBOOK_DEFAULT_LANGUAGE = STORYBOOK_SUPPORTED_LANGUAGES[1];

export const getMultiLanguageStoryTemplate: StoryFn = (
  args,
  { globals, ...rest }
) => {
  if (globals.language) {
    translocoServiceInstance?.setActiveLang(globals.language);
  }

  return {
    globals,
    props: {
      ...args,
    },
    ...rest,
  };
};

export const STORYBOOK_TRANSLOCO_CONFIG = {
  reRenderOnLangChange: true,
  availableLangs: STORYBOOK_SUPPORTED_LANGUAGES.map((l) => ({
    id: l.code,
    label: l.title,
  })),
  defaultLang: STORYBOOK_DEFAULT_LANGUAGE.code,
  fallbackLang: STORYBOOK_DEFAULT_LANGUAGE.code,
  prodMode: false,
};
