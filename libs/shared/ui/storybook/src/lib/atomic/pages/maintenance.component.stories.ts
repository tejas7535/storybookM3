import { TranslocoModule } from '@ngneat/transloco';
import { Meta, moduleMetadata, Story } from '@storybook/angular';

import {
  MaintenanceComponent,
  MaintenanceModule,
} from '@schaeffler/empty-states';

import READMEMd from '../../../../../empty-states/src/lib/maintenance/README.md';
import { Badges } from '../../../../.storybook/storybook-badges.constants';
import {
  NavigationAtomic,
  NavigationMain,
} from '../../../../.storybook/storybook-navigation.constants';
import { StorybookTranslocoModule } from '../../../../.storybook/storybook-transloco.module';

export default {
  title: `${NavigationMain.Atomic}/${NavigationAtomic.Pages}/Maintenance`,
  component: MaintenanceComponent,
  parameters: {
    notes: { markdown: READMEMd },
    badges: [Badges.Final],
  },
  decorators: [
    moduleMetadata({
      imports: [MaintenanceModule, StorybookTranslocoModule, TranslocoModule],
    }),
  ],
} as Meta<MaintenanceComponent>;

const Template: Story<MaintenanceComponent> = (args: MaintenanceComponent) => ({
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
