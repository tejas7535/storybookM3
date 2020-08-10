import { HttpClientModule } from '@angular/common/http';
import { RouterModule } from '@angular/router';

import {
  PageNotFoundComponent,
  PageNotFoundModule,
} from '@schaeffler/empty-states';
import { SharedTranslocoModule } from '@schaeffler/transloco';

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
      SharedTranslocoModule.forRoot(
        false,
        ['en'],
        'en', // default -> undefined would lead to browser detection
        'en',
        false
      ),
    ],
  },
  component: PageNotFoundComponent,
  props: {},
});
