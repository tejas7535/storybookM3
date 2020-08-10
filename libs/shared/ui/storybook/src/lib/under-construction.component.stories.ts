import { HttpClientModule } from '@angular/common/http';

import {
  UnderConstructionComponent,
  UnderConstructionModule,
} from '@schaeffler/empty-states';
import { SharedTranslocoModule } from '@schaeffler/transloco';

import READMEMd from '../../../empty-states/src/lib/under-construction/README.md';

const moduleMetadata = {
  imports: [
    UnderConstructionModule,
    HttpClientModule,
    SharedTranslocoModule.forRoot(
      false,
      ['en'],
      'en', // default -> undefined would lead to browser detection
      'en',
      false
    ),
  ],
};

const baseComponent = {
  moduleMetadata,
  component: UnderConstructionComponent,
};

export default {
  title: 'Under Construction',
  parameters: {
    notes: { markdown: READMEMd },
  },
};

export const primary = () => ({
  ...baseComponent,
});
