import { MatButtonModule } from '@angular/material/button';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

import { SnackBarModule } from '@schaeffler/snackbar';

import READMEMd from '../../../snackbar/README.md';
import { SnackbarLauncherComponent } from './snackbar/snackbar-launcher.component';

const moduleMetadata = {
  imports: [BrowserAnimationsModule, SnackBarModule, MatButtonModule],
  entryComponents: [SnackbarLauncherComponent],
};

const baseComponent = {
  moduleMetadata,
  component: SnackbarLauncherComponent,
};

// eslint-disable-next-line
export default {
  title: 'Snackbar',
  parameters: {
    notes: { markdown: READMEMd },
  },
};

export const primary = () => ({
  ...baseComponent,
});
