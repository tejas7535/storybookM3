import { Meta, moduleMetadata, Story } from '@storybook/angular';
import { withDesign } from 'storybook-addon-designs';

import { Badges } from '../../../../.storybook/storybook-badges.constants';
import {
  NavigationAtomic,
  NavigationMain,
} from '../../../../.storybook/storybook-navigation.constants';
import READMEMd from './typography/README.md';

export default {
  title: `${NavigationMain.Atomic}/${NavigationAtomic.Foundations}/Typography`,
  decorators: [
    moduleMetadata({
      imports: [],
    }),
    withDesign,
  ],
  parameters: {
    notes: { markdown: READMEMd },
    badges: [Badges.Final],
    design: {
      type: 'figma',
      url: 'https://www.figma.com/file/hhhgg57rQRgJ3YJwOHewZ9/DS-Test?node-id=152%3A22',
    },
  },
} as Meta;

const Template: Story = (args) => ({
  props: args,
  template: `
    <section>
      <div class="flex flex-row items-center gap-8 py-1">
        <span class="w-24 shrink-0">Headline 1</span>
        <h1>{{ typographyText }}</h1>
      </div>
      <div class="flex flex-row items-center gap-8 py-1">
        <span class="w-24 shrink-0">Headline 2</span>
        <h2>{{ typographyText }}</h2>
      </div>
      <div class="flex flex-row items-center gap-8 py-1">
        <span class="w-24 shrink-0">Headline 3</span>
        <h3>{{ typographyText }}</h3>
      </div>
      <div class="flex flex-row items-center gap-8 py-1">
        <span class="w-24 shrink-0">Headline 4</span>
        <h4>{{ typographyText }}</h4>
      </div>
      <div class="flex flex-row items-center gap-8 py-1">
        <span class="w-24 shrink-0">Headline 5</span>
        <h5>{{ typographyText }}</h5>
      </div>
      <div class="flex flex-row items-center gap-8 py-1">
        <span class="w-24 shrink-0">Headline 6</span>
        <h6>{{ typographyText }}</h6>
      </div>
      <div class="flex flex-row items-center gap-8 py-1">
        <span class="w-24 shrink-0">Subtitle 1</span>
        <span class="text-subtitle-1">{{ typographyText }}</span>
      </div>
      <div class="flex flex-row items-center gap-8 py-1">
        <span class="w-24 shrink-0">Subtitle 2</span>
        <span class="text-subtitle-2">{{ typographyText }}</span>
      </div>
      <div class="flex flex-row items-center gap-8 py-1">
        <span class="w-24 shrink-0">Body 1</span>
        <span class="text-body-1">{{ typographyText }}</span>
      </div>
      <div class="flex flex-row items-center gap-8 py-1">
        <span class="w-24 shrink-0">Body 2</span>
        <span class="text-body-2">{{ typographyText }}</span>
      </div>
      <div class="flex flex-row items-center gap-8 py-1">
        <span class="w-24 shrink-0">Caption</span>
        <span class="text-caption">{{ typographyText }}</span>
      </div>
      <div class="flex flex-row items-center gap-8 py-1">
        <span class="w-24 shrink-0">Overline</span>
        <span class="text-overline">{{ typographyText }}</span>
      </div>
    </section>
  `,
});

export const Default = Template.bind({});
Default.args = {
  typographyText: 'The quick brown fox jumps over the lazy dog',
};
