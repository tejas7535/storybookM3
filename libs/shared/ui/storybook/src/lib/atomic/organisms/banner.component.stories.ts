import { CommonModule } from '@angular/common';

import { TranslocoModule } from '@ngneat/transloco';
import { Meta, moduleMetadata, Story } from '@storybook/angular';
import { BannerTextModule } from 'libs/shared/ui/banner/src/lib/banner-text/banner-text.module';

import { BannerTextComponent, BannerIconType } from '@schaeffler/banner';

import READMEMd from '../../../../../banner/README.md';
import {
  NavigationAtomic,
  NavigationMain,
} from '../../../../.storybook/storybook-navigation.constants';
import { StorybookTranslocoModule } from '../../../../.storybook/storybook-transloco.module';
import { Badges } from 'libs/shared/ui/storybook/.storybook/storybook-badges.constants';

export default {
  title: `${NavigationMain.Atomic}/${NavigationAtomic.Organisms}/Banner`,
  component: BannerTextComponent,
  parameters: {
    notes: { markdown: READMEMd },
    badges: [Badges.Final],
  },
  decorators: [
    moduleMetadata({
      imports: [
        CommonModule,
        BannerTextModule,
        StorybookTranslocoModule,
        TranslocoModule,
      ],
    }),
  ],
} as Meta<BannerTextComponent>;

const Template: Story<BannerTextComponent> = (args: BannerTextComponent) => ({
  component: BannerTextComponent,
  props: args,
});

const props = (icon: BannerIconType, fullText = false) => ({
  text: 'This text can be modified to be longer.',
  showFullText: fullText,
  bannerIcon: icon,
  truncateSize: 180,
  buttonText: 'Okay',
});

const actions = {
  closeBanner: { action: 'closeBanner' },
  toggleFullText: { action: 'toggleFullText' },
};

export const Info = Template.bind({});
Info.args = {
  ...props('info'),
};
Info.argTypes = {
  ...actions,
};

export const Warning = Template.bind({});
Warning.args = {
  ...props('warning'),
};
Warning.argTypes = {
  ...actions,
};

export const Error = Template.bind({});
Error.args = {
  ...props('error'),
};
Error.argTypes = {
  ...actions,
};

export const Success = Template.bind({});
Success.args = {
  ...props('success'),
};
Success.argTypes = {
  ...actions,
};

export const Expanded = Template.bind({});
Expanded.args = {
  ...props('info', true),
};
Expanded.argTypes = {
  ...actions,
};
