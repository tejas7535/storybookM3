import { HttpClientModule } from '@angular/common/http';
import { RouterModule } from '@angular/router';

import { PageNotFoundComponent } from './page-not-found.component';
import { PageNotFoundModule } from './page-not-found.module';

export default {
  title: 'PageNotFoundComponent'
};

export const primary = () => ({
  moduleMetadata: {
    imports: [PageNotFoundModule, RouterModule.forRoot([]), HttpClientModule]
  },
  component: PageNotFoundComponent,
  props: {}
});
