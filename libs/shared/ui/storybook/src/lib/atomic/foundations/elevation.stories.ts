import { Meta, moduleMetadata, StoryFn } from '@storybook/angular';
import { withDesign } from 'storybook-addon-designs';

import { Badges } from '../../../../.storybook/storybook-badges.constants';

import READMEMd from './elevation/README.md';

export default {
  title: 'Atomic/Foundations/Elevation',
  decorators: [
    moduleMetadata({
      imports: [],
    }),
    withDesign,
  ],
  parameters: {
    docs: {
      description: {
        story: READMEMd,
      },
    },
    badges: [Badges.Final],
    design: {
      type: 'figma',
      url: 'https://www.figma.com/file/hhhgg57rQRgJ3YJwOHewZ9/DS-Test?node-id=151%3A11',
    },
  },
} as Meta;

const Template: StoryFn = (args) => ({
  props: args,
  template: `
    <section class="bg-background-dark p-4">
      <div class="mat-elevation-z0 mb-12 bg-surface-legacy"><div class="p-4 pt-[60px]">00 dp</div></div>
      <div class="mat-elevation-z1 mb-12 bg-surface-legacy"><div class="p-4 pt-[60px]">01 dp</div></div>
      <div class="mat-elevation-z2 mb-12 bg-surface-legacy"><div class="p-4 pt-[60px]">02 dp</div></div>
      <div class="mat-elevation-z3 mb-12 bg-surface-legacy"><div class="p-4 pt-[60px]">03 dp</div></div>
      <div class="mat-elevation-z4 mb-12 bg-surface-legacy"><div class="p-4 pt-[60px]">04 dp</div></div>
      <div class="mat-elevation-z6 mb-12 bg-surface-legacy"><div class="p-4 pt-[60px]">06 dp</div></div>
      <div class="mat-elevation-z8 mb-12 bg-surface-legacy"><div class="p-4 pt-[60px]">08 dp</div></div>
      <div class="mat-elevation-z9 mb-12 bg-surface-legacy"><div class="p-4 pt-[60px]">09 dp</div></div>
      <div class="mat-elevation-z12 mb-12 bg-surface-legacy"><div class="p-4 pt-[60px]">12 dp</div></div>
      <div class="mat-elevation-z16 mb-12 bg-surface-legacy"><div class="p-4 pt-[60px]">16 dp</div></div>
      <div class="mat-elevation-z24 mb-12 bg-surface-legacy"><div class="p-4 pt-[60px]">24 dp</div></div>
    </section>
  `,
});

export const Default = Template.bind({});
Default.args = {};
