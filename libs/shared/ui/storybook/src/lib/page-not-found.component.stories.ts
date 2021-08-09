import { HttpClientModule } from '@angular/common/http';
import { RouterModule } from '@angular/router';

import { TranslocoModule } from '@ngneat/transloco';

import {
  PageNotFoundComponent,
  PageNotFoundModule,
} from '@schaeffler/empty-states';
import { StorybookTranslocoModule } from '@schaeffler/transloco';

import READMEMd from '../../../empty-states/src/lib/page-not-found/README.md';

export default {
  title: 'Page Not Found',
  parameters: {
    notes: { markdown: READMEMd },
  },
};

export const primary = () => ({
  moduleMetadata: {
    imports: [
      PageNotFoundModule,
      RouterModule.forRoot([], {
        useHash: true,
      }),
      HttpClientModule,
      StorybookTranslocoModule,
      TranslocoModule,
    ],
  },
  component: PageNotFoundComponent,
  props: {},
});
