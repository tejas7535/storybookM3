import { HttpClientModule } from '@angular/common/http';

import { TranslocoModule } from '@ngneat/transloco';

import {
  UnderConstructionComponent,
  UnderConstructionModule,
} from '@schaeffler/empty-states';
import { provideTranslocoTestingModule } from '@schaeffler/transloco';

import READMEMd from '../../../empty-states/src/lib/under-construction/README.md';

const moduleMetadata = {
  imports: [
    UnderConstructionModule,
    HttpClientModule,
    provideTranslocoTestingModule({ en: {} }),
    TranslocoModule,
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
