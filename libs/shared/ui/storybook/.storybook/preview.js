import { moduleMetadata } from '@storybook/angular';
import { addParameters } from '@storybook/client-api';
import { DocsPage, DocsContainer } from '@storybook/addon-docs';

import { StorybookTranslocoModule } from './storybook-transloco.module';
import {
  STORYBOOK_DEFAULT_LANGUAGE,
  STORYBOOK_SUPPORTED_LANGUAGES,
} from './storybook-transloco.constants';
import {
  NavigationMain,
  NavigationAtomic,
} from './storybook-navigation.constants';
import { Badges } from './storybook-badges.constants';

export const decorators = [
  // add global modules which will be available for all stories
  moduleMetadata({
    imports: [StorybookTranslocoModule],
  }),
];

addParameters({
  docs: {
    // use existing notes from Readme.md files as docs description
    extractComponentDescription: (component, { notes }) => {
      if (notes) {
        return typeof notes === 'string' ? notes : notes.markdown || notes.text;
      }
      return null;
    },
    container: DocsContainer,
    page: DocsPage,
  },
  badgesConfig: {
    [Badges.InProgress]: {
      contrast: '#1d9bb2',
      color: '#fff',
      title: 'In Progress',
    },
    [Badges.NeedsRevision]: {
      contrast: '#fccf46',
      color: '#000',
      title: 'Needs Revision',
    },
    [Badges.Final]: {
      contrast: '#00893d',
      color: '#fff',
      title: 'Final',
    },
    [Badges.Deprecated]: {
      contrast: '#e62c27',
      color: '#fff',
      title: 'Deprecated',
    },
  },
});

export const parameters = {
  options: {
    storySort: {
      order: [
        NavigationMain.Atomic,
        [
          NavigationAtomic.Atoms,
          NavigationAtomic.Molecules,
          NavigationAtomic.Organisms,
          NavigationAtomic.Pages,
        ],
        NavigationMain.Components,
        NavigationMain.Deprecated,
        NavigationMain.Rest,
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
  darkMode: {
    stylePreview: true,
  },
  backgrounds: {
    default: 'light',
    values: [
      { name: 'light', value: '#fafafa' },
      { name: 'dark', value: '#333333' },
      { name: 'white', value: '#ffffff' },
      { name: 'black', value: '#000000' },
    ],
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
