import { Meta, moduleMetadata, StoryFn } from '@storybook/angular';
import { withDesign } from 'storybook-addon-designs';

import { Badges } from '../../../../.storybook/storybook-badges.constants';
import READMEMd from './typography/README.md';

export default {
  title: 'Atomic/Foundations/Typography',
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
      url: 'https://www.figma.com/file/hhhgg57rQRgJ3YJwOHewZ9/DS-Test?node-id=152%3A22',
    },
  },
} as Meta;

const Template: StoryFn = (args) => ({
  props: args,
  template: `
    <section class="bg-surface text-on-surface p-2">
      <div class="flex flex-row items-center gap-8 py-1">
        <span class="w-44 shrink-0">text-display-large (m2 text-h2) </span>
        <h2 class="text-display-large">{{ typographyText }}</h2>
      </div>
      <div class="flex flex-row items-center gap-8 py-1">
        <span class="w-44 shrink-0">text-display-medium (m2 text-h3) </span>
         <h3 class="text-display-medium" >{{ typographyText }}</h3>
      </div>
      <div class="flex flex-row items-center gap-8 py-1">
        <span class="w-44 shrink-0">text-display-small (m2 text-h4)</span>
          <h4 class="text-display-small">{{ typographyText }}</h4>
      </div>
      <div class="flex flex-row items-center gap-8 py-1">
        <span class="w-44 shrink-0">text-headline-large (new in m3)</span>
        <h5 class="text-headline-large">{{ typographyText }}</h5>
      </div>
       <div class="flex flex-row items-center gap-8 py-1">
        <span class="w-44 shrink-0">text-headline-medium (new in m3)</span>
        <h5 class="text-headline-medium">{{ typographyText }}</h5>
      </div>
      <div class="flex flex-row items-center gap-8 py-1">
        <span class="w-44 shrink-0">text-headline-small (m2 text-h5)</span>
        <h5 class="text-headline-small">{{ typographyText }}</h5>
      </div>
      <div class="flex flex-row items-center gap-8 py-1">
        <span class="w-44 shrink-0">text-title-large (m2 text-h6)</span>
        <h6 class="text-title-large">{{ typographyText }}</h6>
      </div>
      <div class="flex flex-row items-center gap-8 py-1">
        <span class="w-44 shrink-0">text-title-medium (m2 text-subtitle-1) </span>
         <span class="text-title-medium">{{ typographyText }}</span>
      </div>
      <div class="flex flex-row items-center gap-8 py-1">
        <span class="w-44 shrink-0">text-title-small (m2 text-subtitle-2)</span>
        <span class="text-title-small">{{ typographyText }}</span>
      </div>
      <div class="flex flex-row items-center gap-8 py-1">
        <span class="w-44 shrink-0">text-body-large (m2 text-body-1)</span>
        <span class="text-body-large">{{ typographyText }}</span>
      </div>
      <div class="flex flex-row items-center gap-8 py-1">
        <span class="w-44 shrink-0">text-body-medium (m2 text-body-2)</span>
        <span class="text-body-medium">{{ typographyText }}</span>
      </div>
      <div class="flex flex-row items-center gap-8 py-1">
        <span class="w-44 shrink-0">text-body-small (m2 text-caption)</span>
        <span class="text-body-small">{{ typographyText }}</span>
      </div>
      <div class="flex flex-row items-center gap-8 py-1">
        <span class="w-44 shrink-0">text-label-large (m2 text-button)</span>
        <span class="text-label-large">{{ typographyText }}</span>
      </div>
        <div class="flex flex-row items-center gap-8 py-1">
        <span class="w-44 shrink-0">text-label-large-prominent (new in m3)</span>
        <span class="text-label-large-prominent">{{ typographyText }}</span>
      </div>
      <div class="flex flex-row items-center gap-8 py-1">
        <span class="w-44 shrink-0">text-label-medium (new in m3)</span>
        <span class="text-label-medium">{{ typographyText }}</span>
      </div>
      <div class="flex flex-row items-center gap-8 py-1">
        <span class="w-44 shrink-0">text-label-medium-prominent (new in m3)</span>
        <span class="text-label-medium-prominent">{{ typographyText }}</span>
      </div>
      <div class="flex flex-row items-center gap-8 py-1">
        <span class="w-44 shrink-0">text-label-small (m2 text-overline)</span>
        <span class="text-label-small">{{ typographyText }}</span>
      </div>
    </section>
  `,
});

export const Default = Template.bind({});
Default.args = {
  typographyText: 'The quick brown fox jumps over the lazy dog',
};
