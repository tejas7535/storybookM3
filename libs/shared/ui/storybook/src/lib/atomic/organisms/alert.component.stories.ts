import { CommonModule } from '@angular/common';

import { provideTransloco } from '@jsverse/transloco';
import {
  applicationConfig,
  Meta,
  moduleMetadata,
  StoryFn,
} from '@storybook/angular';

import { AlertComponent } from '@schaeffler/alert';

import READMEMd from '../../../../../alert/README.md';

import { STORYBOOK_TRANSLOCO_CONFIG } from '../../../../.storybook/storybook-transloco.constants';
import { Badges } from 'libs/shared/ui/storybook/.storybook/storybook-badges.constants';

export default {
  title: 'Atomic/Organisms/Alert',
  component: AlertComponent,
  parameters: {
    docs: {
      description: {
        story: READMEMd,
      },
    },
    badges: [Badges.NeedsRevision],
  },
  decorators: [
    moduleMetadata({
      imports: [CommonModule],
    }),
    applicationConfig({
      providers: [provideTransloco({ config: STORYBOOK_TRANSLOCO_CONFIG })],
    }),
  ],
} as Meta<AlertComponent>;

const Template: StoryFn<AlertComponent> = (args: AlertComponent) => ({
  template: `
   <section class="bg-surface text-on-surface p-4 mb-6 text-headline-large rounded-xl">
  <h2 class="text-display-medium mb-6">Alert</h2>
  <div class="flex flex-col gap-6">
      <a class="text-primary text-body-large underline" href="https://zeroheight.com/4a06fad55/p/42a043-alerts"
      target="_blank"> Find in Zeroheight</a>
  </div>
  <p class="text-body-medium mt-6">Custom alerts component helps to present information with different user attention level</p>
   <div class="flex flex-col gap-2 pt-2">

  <schaeffler-alert [type]="'warning'" [headline]="'Headline'" [actionText]="'Dismiss'"
  [description] = "'Request successfully sent. Your request is under review for approval. Please check the system again after a period of time to see updates.'"> </schaeffler-alert>
   <schaeffler-alert [type]="'success'" [description]="'description'" [actionText]="'Dismiss'"
   [description] = "'Request successfully sent. Your request is under review for approval. Please check the system again after a period of time to see updates.'"> </schaeffler-alert>
  <schaeffler-alert [type]="'info'" [headline]="'Headline'" [actionText]="'Dismiss'"
  [description]="'Request successfully sent. Your request is under review for approval. Please check the system again after a period of time to see updates.'"> </schaeffler-alert>
  <schaeffler-alert [type]="'error'" [headline]="'Headline'"  [actionText]="'Dismiss'"
  [description] = "'Request successfully sent. Your request is under review for approval. Please check the system again after a period of time to see updates.'"
   > </schaeffler-alert>
    </div>
  </section>
 
  `,
  props: args,
});

export const Default = Template.bind({});

const actions = {
  buttonClicked: { action: 'buttonClicked' },
};

Default.argTypes = {
  ...actions,
};
