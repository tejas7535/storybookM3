import {
  applicationConfig,
  Meta,
  moduleMetadata,
  StoryFn,
} from '@storybook/angular';

import {
  MaintenanceComponent,
  MaintenanceModule,
} from '@schaeffler/empty-states';

import READMEMd from '../../../../../empty-states/src/lib/maintenance/README.md';
import { Badges } from '../../../../.storybook/storybook-badges.constants';

import { StorybookTranslocoModule } from '../../../../.storybook/storybook-transloco.module';
import { importProvidersFrom } from '@angular/core';

export default {
  title: 'Atomic/Pages/Maintenance',
  component: MaintenanceComponent,
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
      imports: [MaintenanceModule],
    }),
    applicationConfig({
      providers: [importProvidersFrom(StorybookTranslocoModule)],
    }),
  ],
} as Meta<MaintenanceComponent>;

const Template: StoryFn<MaintenanceComponent> = (
  args: MaintenanceComponent
) => ({
  component: MaintenanceComponent,
  props: args,
});

export const Primary = Template.bind({});
Primary.args = {};

export const WithCustomText = Template.bind({});
WithCustomText.args = {
  title: 'We are currently deploying a version 2.0',
  subtitle: 'We will be back on 01.01.2111 9 CET',
};
