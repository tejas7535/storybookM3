import { CommonModule } from '@angular/common';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { RouterModule } from '@angular/router';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatTooltipModule } from '@angular/material/tooltip';

import { Meta, moduleMetadata } from '@storybook/angular';

import {
  ShareButtonComponent,
  ShareButtonModule,
} from '@schaeffler/share-button';
import { SnackBarModule } from '@schaeffler/snackbar';
import { ApplicationInsightsModule } from '@schaeffler/application-insights';

import READMEMd from '../../../../share-button/README.md';
import { NavigationMain } from '../../../.storybook/storybook-navigation.constants';
import {
  getMultiLanguageStoryTemplate,
  StorybookTranslocoModule,
} from '../../../.storybook/storybook-transloco.module';

export default {
  title: `${NavigationMain.Components}/Share Button`,
  component: ShareButtonComponent,
  decorators: [
    moduleMetadata({
      imports: [
        CommonModule,
        BrowserAnimationsModule,
        ShareButtonModule,
        StorybookTranslocoModule,
        MatButtonModule,
        MatIconModule,
        MatTooltipModule,
        SnackBarModule,
        RouterModule.forRoot([], {
          useHash: true,
        }),
        ApplicationInsightsModule.forRoot({
          applicationInsightsConfig: {
            instrumentationKey: 'some key',
          },
        }),
      ],
    }),
  ],
  parameters: {
    notes: { markdown: READMEMd },
  },
} as Meta<ShareButtonComponent>;

export const Primary = getMultiLanguageStoryTemplate.bind({});
Primary.args = {};
