import { HttpClientModule } from '@angular/common/http';

import { TranslocoModule } from '@ngneat/transloco';

import {
  UnsupportedViewportComponent,
  UnsupportedViewportModule,
} from '@schaeffler/empty-states';
import { provideTranslocoTestingModule } from '@schaeffler/transloco';

import READMEmd from '../../../empty-states/src/lib/unsupported-viewport/README.md';

const moduleMetadata = {
  imports: [
    UnsupportedViewportModule,
    HttpClientModule,
    provideTranslocoTestingModule({ en: {} }),
    TranslocoModule,
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
