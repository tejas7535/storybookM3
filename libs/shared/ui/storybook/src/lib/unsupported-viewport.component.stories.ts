import { HttpClientModule } from '@angular/common/http';

import {
  UnsupportedViewportComponent,
  UnsupportedViewportModule,
} from '@schaeffler/empty-states';
import { SharedTranslocoModule } from '@schaeffler/transloco';

import READMEmd from '../../../empty-states/src/lib/unsupported-viewport/README.md';

const moduleMetadata = {
  imports: [
    UnsupportedViewportModule,
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
  component: UnsupportedViewportComponent,
};

export default {
  title: 'Unsupported Viewport',
  parameters: {
    notes: { markdown: READMEmd },
  },
};

export const primary = () => ({
  ...baseComponent,
});
