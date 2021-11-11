import { MatButtonModule } from '@angular/material/button';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

import { SnackBarModule } from '@schaeffler/snackbar';
import { Meta, moduleMetadata, Story } from '@storybook/angular';

import READMEMd from '../../../../snackbar/README.md';
import { Badges } from '../../../.storybook/storybook-badges.constants';
import { NavigationMain } from '../../../.storybook/storybook-navigation.constants';
import { SnackbarLauncherComponent } from './snackbar/snackbar-launcher.component';

export default {
  title: `${NavigationMain.Deprecated}/Custom Snackbar`,
  component: SnackbarLauncherComponent,
  decorators: [
    moduleMetadata({
      imports: [BrowserAnimationsModule, SnackBarModule, MatButtonModule],
    }),
  ],
  parameters: {
    notes: { markdown: READMEMd },
    badges: [Badges.Deprecated],
  },
} as Meta<SnackbarLauncherComponent>;

const Template: Story<SnackbarLauncherComponent> = (
  args: SnackbarLauncherComponent
) => ({
  component: SnackbarLauncherComponent,
  props: args,
});

export const Primary = Template.bind({});
Primary.args = {};
