import { Meta, Story } from '@storybook/angular';
import { withDesign } from 'storybook-addon-designs';

import { Badges } from '../../../../.storybook/storybook-badges.constants';
import {
  NavigationAtomic,
  NavigationMain,
} from '../../../../.storybook/storybook-navigation.constants';

import READMEMd from './color/README.md';
// const colors = require('../../../../../../../../tailwind/colors');
const colors = {
  // Color Schema
  primary: '#00893d',
  'primary-variant': '#e5f4e9',

  secondary: '#ffffff',
  'secondary-variant': '#f5f5f5',
  'secondary-900': '#3c3c3c',

  'background-dark': '#f5f5f5',
  surface: '#ffffff',
  'error-red': '#a31739',

  // Color Accent
  'nordic-blue': '#4398af',
  'sunny-yellow': '#fbe06d',
  lime: '#9ac465',

  // Text
  'dark-high-emphasis': 'rgba(0, 0, 0, 0.87)',
  'dark-medium-emphasis': 'rgba(0, 0, 0, 0.6)',
  'dark-low-emphasis': 'rgba(0, 0, 0, 0.38)',
  'dark-disabled': 'rgba(0, 0, 0, 0.38)',

  'light-high-emphasis': '#ffffff',
  'light-medium-emphasis': 'rgba(255, 255, 255, 0.6)',
  'light-low-emphasis': 'rgba(255, 255, 255, 0.38)',
  'light-disabled': 'rgba(0, 0, 0, 0.38)',

  // Special Text Color
  'error-text': '#a31739',
  'link-text': '#00893d',

  // Outline
  border: 'rgba(0, 0, 0, 0.12)',
};

export default {
  title: `${NavigationMain.Atomic}/${NavigationAtomic.Foundations}/Color`,
  decorators: [withDesign],
  parameters: {
    notes: { markdown: READMEMd },
    badges: [Badges.InProgress],
    design: {
      type: 'figma',
      url: 'https://www.figma.com/file/hhhgg57rQRgJ3YJwOHewZ9/DS-Test?node-id=152%3A944',
    },
  },
} as Meta;

const Template: Story = (args) => ({
  props: args,
  template: `
    <section class="bg-background-dark p-4">
      <h4>Color Schema</h4>
      <div class="mat-elevation-z0 bg-primary"><div class="p-4 pt-[60px]">bg-primary {{colors.primary}} (called secondary in design)</div></div>      
      <div class="mat-elevation-z0 bg-primary-variant"><div class="p-4 pt-[60px]">bg-primary-variant {{colors['primary-variant']}} (called secondary-variant in design)</div></div>      
      <div class="mat-elevation-z0 bg-secondary"><div class="p-4 pt-[60px]">bg-secondary {{colors.secondary}} (called primary in design)</div></div>
      <div class="mat-elevation-z0 bg-secondary-variant"><div class="p-4 pt-[60px]">bg-secondary-variant {{colors['secondary-variant']}} (called primary-variant in design)</div></div>
      <div class="mat-elevation-z0 bg-secondary-900"><div class="p-4 pt-[60px]">bg-secondary-900 {{colors['secondary-900']}} (called grey/900 in design)</div></div>
      <div class="mat-elevation-z0 bg-background-dark"><div class="p-4 pt-[60px]">bg-background-dark {{colors['background-dark']}}</div></div>
      <div class="mat-elevation-z0 bg-surface"><div class="p-4 pt-[60px]">bg-surface {{colors.surface}}</div></div>
      <div class="mat-elevation-z0 bg-error"><div class="p-4 pt-[60px]">bg-error {{colors.error}}</div></div>
      
      <h4 class="mt-20">Color Accent</h4>
      <div class="mat-elevation-z0 bg-nordic-blue"><div class="p-4 pt-[60px]">bg-nordic-blue {{colors['nordic-blue']}}</div></div>
      <div class="mat-elevation-z0 bg-sunny-yellow"><div class="p-4 pt-[60px]">bg-sunny-yellow {{colors['sunny-yellow']}}</div></div>
      <div class="mat-elevation-z0 bg-lime"><div class="p-4 pt-[60px]">bg-lime {{colors.lime}}</div></div>
      
      <h4 class="mt-20">Black Text on Primary / White</h4>
      <div class="mat-elevation-z0 bg-secondary flex flex-row justify-between">
        <div class="p-4 pt-[60px] text-high-emphasis">text-high-emphasis</div>
        <div class="p-4 pt-[60px] text-medium-emphasis">text-medium-emphasis</div>
        <div class="p-4 pt-[60px] text-low-emphasis">text-low-emphasis</div>
      </div>

      <h4 class="mt-20">On Surface</h4>
      <div class="mat-elevation-z0 bg-secondary-900 flex flex-row justify-between">
        <div class="p-4 pt-[60px] text-high-emphasis-dark-bg">text-high-emphasis-dark-bg</div>
        <div class="p-4 pt-[60px] text-medium-emphasis-dark-bg">text-medium-emphasis-dark-bg</div>
        <div class="p-4 pt-[60px] text-low-emphasis-dark-bg">text-low-emphasis-dark-bg</div>
      </div>

      <h4 class="mt-20">Special Text Color</h4>
      <div class="mat-elevation-z0 bg-secondary flex flex-row justify-between">
        <div class="p-4 pt-[60px] text-error">text-error</div>
        <div class="p-4 pt-[60px] text-link">text-link</div>
        <div class="p-4 pt-[60px] text-info">text-info</div>
        <div class="p-4 pt-[60px] text-warning">text-warning</div>
      </div>

      <h4 class="mt-20">Outline</h4>
      <div class="mat-elevation-z0 bg-secondary border border-border">
        <div class="p-4 pt-[60px]">border-border</div>
      </div>
      <div class="mat-elevation-z0 bg-secondary border border-primary">
        <div class="p-4 pt-[60px]">border-primary</div>
      </div>
      <div class="mat-elevation-z0 bg-secondary border border-info">
        <div class="p-4 pt-[60px]">border-info</div>
      </div>
      <div class="mat-elevation-z0 bg-secondary border border-warning">
            <div class="p-4 pt-[60px]">border-warning</div>    
      </div>
    </section>
  `,
});

export const Default = Template.bind({});
Default.args = {
  colors,
};
