import { HttpClientModule } from '@angular/common/http';

import {
  UnderConstructionComponent,
  UnderConstructionModule,
} from '@schaeffler/empty-states';

const moduleMetadata = {
  imports: [UnderConstructionModule, HttpClientModule],
};

const baseComponent = {
  moduleMetadata,
  component: UnderConstructionComponent,
};

export default {
  title: 'Under Construction',
};

export const primary = () => ({
  ...baseComponent,
});
