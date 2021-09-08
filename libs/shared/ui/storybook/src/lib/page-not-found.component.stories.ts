import { HttpClientModule } from '@angular/common/http';
import { RouterModule } from '@angular/router';

import { TranslocoModule } from '@ngneat/transloco';

import {
  PageNotFoundComponent,
  PageNotFoundModule,
} from '@schaeffler/empty-states';
import { StorybookTranslocoModule } from '@schaeffler/transloco';
import { Meta, moduleMetadata, Story } from '@storybook/angular';

import READMEMd from '../../../empty-states/src/lib/page-not-found/README.md';

export default {
  title: 'Page Not Found',
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
  },
} as Meta<PageNotFoundComponent>;

const Template: Story<PageNotFoundComponent> = (
  args: PageNotFoundComponent
) => ({
  component: PageNotFoundComponent,
  props: args,
});

export const Primary = Template.bind({});
Primary.args = {};
