import { HttpClientModule } from '@angular/common/http';

import {
  UnderConstructionComponent,
  UnderConstructionModule,
} from '@schaeffler/empty-states';

import READMEMd from '../../../empty-states/src/lib/under-construction/README.md';

const moduleMetadata = {
  imports: [UnderConstructionModule, HttpClientModule],
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
