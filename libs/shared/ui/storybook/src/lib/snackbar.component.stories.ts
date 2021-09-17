import { MatButtonModule } from '@angular/material/button';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

import { SnackBarModule } from '@schaeffler/snackbar';
import { Meta, moduleMetadata, Story } from '@storybook/angular';

import READMEMd from '../../../snackbar/README.md';
import { SnackbarLauncherComponent } from './snackbar/snackbar-launcher.component';

export default {
  title: 'Components/Snackbar',
  component: SnackbarLauncherComponent,
  decorators: [
    moduleMetadata({
      imports: [BrowserAnimationsModule, SnackBarModule, MatButtonModule],
    }),
  ],
  parameters: {
    notes: { markdown: READMEMd },
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
