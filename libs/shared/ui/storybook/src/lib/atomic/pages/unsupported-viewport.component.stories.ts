import { TranslocoModule } from '@ngneat/transloco';
import { Meta, moduleMetadata, Story } from '@storybook/angular';

import {
  UnsupportedViewportComponent,
  UnsupportedViewportModule,
} from '@schaeffler/empty-states';

import READMEMd from '../../../../../empty-states/src/lib/unsupported-viewport/README.md';
import { Badges } from '../../../../.storybook/storybook-badges.constants';
import {
  NavigationAtomic,
  NavigationMain,
} from '../../../../.storybook/storybook-navigation.constants';
import { StorybookTranslocoModule } from '../../../../.storybook/storybook-transloco.module';

export default {
  title: `${NavigationMain.Atomic}/${NavigationAtomic.Pages}/Unsupported Viewport`,
  component: UnsupportedViewportComponent,
  parameters: {
    notes: { markdown: READMEMd },
    badges: [Badges.NeedsRevision],
  },
  decorators: [
    moduleMetadata({
      imports: [
        UnsupportedViewportModule,
        StorybookTranslocoModule,
        TranslocoModule,
      ],
    }),
  ],
} as Meta<UnsupportedViewportComponent>;

const Template: Story<UnsupportedViewportComponent> = (
  args: UnsupportedViewportComponent
) => ({
  component: UnsupportedViewportComponent,
  props: args,
});

export const Primary = Template.bind({});
Primary.args = {};
