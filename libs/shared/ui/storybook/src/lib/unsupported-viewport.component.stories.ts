import { HttpClientModule } from '@angular/common/http';

import {
  UnsupportedViewportComponent,
  UnsupportedViewportModule,
} from '@schaeffler/empty-states';

import READMEmd from '../../../empty-states/src/lib/unsupported-viewport/README.md';

const moduleMetadata = {
  imports: [UnsupportedViewportModule, HttpClientModule],
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
