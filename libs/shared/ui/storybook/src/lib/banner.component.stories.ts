import { CommonModule } from '@angular/common';
import { MatIconModule } from '@angular/material/icon';

import { TranslocoModule } from '@ngneat/transloco';
import { Meta, moduleMetadata, Story } from '@storybook/angular';
import { BannerTextModule } from 'libs/shared/ui/banner/src/lib/banner-text/banner-text.module';

import { BannerTextComponent } from '@schaeffler/banner';

import READMEMd from '../../../banner/README.md';
import { StorybookTranslocoModule } from '../../.storybook/storybook-transloco.module';

export default {
  title: 'Components/Banner',
  component: BannerTextComponent,
  decorators: [
    moduleMetadata({
      imports: [
        CommonModule,
        BannerTextModule,
        StorybookTranslocoModule,
        TranslocoModule,
        MatIconModule,
      ],
    }),
  ],
  parameters: {
    notes: { markdown: READMEMd },
  },
} as Meta<BannerTextComponent>;

const Template: Story<BannerTextComponent> = (args: BannerTextComponent) => ({
  component: BannerTextComponent,
  props: args,
});

const props = (icon: string, fullText = false) => ({
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
