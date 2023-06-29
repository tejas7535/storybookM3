import { moduleMetadata } from '@storybook/angular';
import { themes } from '@storybook/theming';

import logo from './schaeffler-logo.svg';
import { Badges } from './storybook-badges.constants';
import {
  STORYBOOK_DEFAULT_LANGUAGE,
  STORYBOOK_SUPPORTED_LANGUAGES,
} from './storybook-transloco.constants';
import { StorybookTranslocoModule } from './storybook-transloco.module';

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
        'Atomic',
        [
          'Foundations',
          'Atoms',
          'Molecules',
          'Organisms',
          'Templates',
          'Pages',
        ],
        'Deprecated',
        '*',
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
    light: {
      ...themes.normal,
      brandTitle: 'Schaeffler Design System',
      brandImage: logo,
    },
    dark: {
      ...themes.dark,
      brandTitle: 'Schaeffler Design System',
      brandImage: logo,
    },
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
  docs: {
    iframeHeight: 400,
    // use existing notes from Readme.md files as docs description
    extractComponentDescription: (component, { notes }) => {
      if (notes) {
        const notesOutput =
          typeof notes === 'string' ? notes : notes.markdown || notes.text;

        return (
          notesOutput +
          `<strong style="display: block; margin: 60px 0; font-size: 34px;">Stories</strong>`
        );
      }
      return null;
    },
  },
  badgesConfig: {
    [Badges.InProgress]: {
      styles: {
        backgroundColor: '#1d9bb2',
        borderColor: '#1d9bb2',
        color: '#fff',
      },
      title: 'In Progress',
    },
    [Badges.NeedsRevision]: {
      styles: {
        backgroundColor: '#fccf46',
        color: '#000',
      },
      title: 'Needs Revision',
    },
    [Badges.Final]: {
      styles: {
        backgroundColor: '#00893d',
        borderColor: '#00893d',
        color: '#fff',
      },
      title: 'Final',
    },
    [Badges.Deprecated]: {
      styles: {
        backgroundColor: '#e62c27',
        borderColor: '#e62c27',
        color: '#fff',
      },
      title: 'Deprecated',
    },
  },
  viewport: {
    viewports: {
      mobile: {
        // < 600px
        name: 'Mobile',
        styles: {
          width: '375px',
          height: '812px',
        },
      },
      iPad: {
        // 600px - 904px
        name: 'iPad',
        styles: {
          width: '768px',
          height: '1024px',
        },
      },
      iPadPro: {
        // 905px - 1239px
        name: 'iPadPro',
        styles: {
          width: '1024px',
          height: '1366px',
        },
      },
      laptop: {
        // 1240px -  1439px
        name: 'Laptop',
        styles: {
          width: '1280px',
          height: '720px',
        },
      },
      desktop: {
        // >= 1440px
        name: 'Desktop',
        styles: {
          width: '1920px',
          height: '1280px',
        },
      },
    },
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
