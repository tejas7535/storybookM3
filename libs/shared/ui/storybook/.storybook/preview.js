import { moduleMetadata } from '@storybook/angular';

import { StorybookTranslocoModule } from './storybook-transloco.module';
import {
  STORYBOOK_DEFAULT_LANGUAGE,
  STORYBOOK_SUPPORTED_LANGUAGES,
} from './transloco-storybook.constants';

export const decorators = [
  // add global modules which will be available for all stories
  moduleMetadata({
    imports: [StorybookTranslocoModule],
  }),
];

export const parameters = {
  options: {
    storySort: {
      order: [
        'Material',
        ['Atoms', 'Molecules', 'Organisms'],
        'Components',
        'Empty-States',
        '*',
        'WIP',
      ],
    },
    includeName: true,
  },
  a11y: {
    element: '#root',
    config: {},
    options: {},
    manual: true,
  },
};

export const globalTypes = {
  // add a multi language dropdown in the Storybook UI toolbar
  language: {
    name: 'Language',
    description: `Choose a language`,
    defaultValue: STORYBOOK_DEFAULT_LANGUAGE.code,
    toolbar: {
      icon: 'globe',
      items: STORYBOOK_SUPPORTED_LANGUAGES.map((language) => ({
        value: language.code,
        right: language.icon,
        title: language.title,
      })),
    },
  },
};
