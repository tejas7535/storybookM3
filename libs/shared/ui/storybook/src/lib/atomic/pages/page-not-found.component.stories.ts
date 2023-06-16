import { HttpClientModule } from '@angular/common/http';
import { RouterModule } from '@angular/router';

import { TranslocoModule } from '@ngneat/transloco';
import { Meta, moduleMetadata, StoryFn } from '@storybook/angular';

import {
  PageNotFoundComponent,
  PageNotFoundModule,
} from '@schaeffler/empty-states';

import READMEMd from '../../../../../empty-states/src/lib/page-not-found/README.md';
import { Badges } from '../../../../.storybook/storybook-badges.constants';

import { StorybookTranslocoModule } from '../../../../.storybook/storybook-transloco.module';

export default {
  title: 'Atomic/Pages/Page Not Found',
  component: PageNotFoundComponent,
  decorators: [
    moduleMetadata({
      imports: [
        PageNotFoundModule,
        RouterModule.forRoot([], {
          useHash: true,
        }),
        HttpClientModule,
        StorybookTranslocoModule,
        TranslocoModule,
      ],
    }),
  ],
  parameters: {
    notes: { markdown: READMEMd },
    badges: [Badges.Final],
  },
} as Meta<PageNotFoundComponent>;

const Template: StoryFn<PageNotFoundComponent> = (
  args: PageNotFoundComponent
) => ({
  component: PageNotFoundComponent,
  props: args,
});

export const Primary = Template.bind({});
Primary.args = {};
