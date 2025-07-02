import { CommonModule } from '@angular/common';

import { provideTransloco } from '@jsverse/transloco';
import {
  applicationConfig,
  Meta,
  moduleMetadata,
  StoryObj,
} from '@storybook/angular';
import { BannerTextModule } from 'libs/shared/ui/banner/src/lib/banner-text/banner-text.module';

import { BannerTextComponent, BannerType } from '@schaeffler/banner';

import READMEMd from '../../../../../banner/README.md';

import { STORYBOOK_TRANSLOCO_CONFIG } from '../../../../.storybook/storybook-transloco.constants';
import { Badges } from 'libs/shared/ui/storybook/.storybook/storybook-badges.constants';
import { action } from 'storybook/actions';

const meta: Meta<BannerTextComponent> = {
  title: 'Atomic/Organisms/Banner',
  component: BannerTextComponent,
  parameters: {
    docs: {
      description: {
        story: READMEMd,
      },
    },
    badges: [Badges.Final],
  },
  decorators: [
    moduleMetadata({
      imports: [CommonModule, BannerTextModule],
    }),
    applicationConfig({
      providers: [provideTransloco({ config: STORYBOOK_TRANSLOCO_CONFIG })],
    }),
  ],
  argTypes: {
    closeBanner: { action: 'closeBanner' },
    toggleFullText: { action: 'toggleFullText' },
  },
  args: {
    closeBanner: action('closeBanner'),
    toggleFullText: action('toggleFullText'),
  },
};
export default meta;
type Story = StoryObj<BannerTextComponent>;

const props = (icon: BannerType, fullText = false) => ({
  text: 'This text can be modified to be longer.',
  showFullText: fullText,
  bannerIcon: icon,
  truncateSize: 180,
  buttonText: 'Okay',
});

export const Info: Story = {
  args: {
    ...props('info'),
  },
};

export const Warning: Story = {
  args: {
    ...props('warning'),
  },
};

export const Error: Story = {
  args: {
    ...props('error'),
  },
};

export const Success: Story = {
  args: {
    ...props('success'),
  },
};

export const Expanded: Story = {
  args: {
    ...props('info', true),
  },
};
