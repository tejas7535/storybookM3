import { HttpClientModule } from '@angular/common/http';
import { RouterModule } from '@angular/router';

import {
  PageNotFoundComponent,
  PageNotFoundModule,
} from '@schaeffler/empty-states';

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
    ],
  },
  component: PageNotFoundComponent,
  props: {},
});
