import { HttpClientModule } from '@angular/common/http';
import { RouterModule } from '@angular/router';

import {
  PageNotFoundComponent,
  PageNotFoundModule,
} from '@schaeffler/empty-states';

export default {
  title: 'Page Not Found',
};

export const primary = () => ({
  moduleMetadata: {
    imports: [PageNotFoundModule, RouterModule.forRoot([]), HttpClientModule],
  },
  component: PageNotFoundComponent,
  props: {},
});
