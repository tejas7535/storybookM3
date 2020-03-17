import { HttpClientModule } from '@angular/common/http';

import { UnsupportedViewportComponent } from './unsupported-viewport.component';
import { UnsupportedViewportModule } from './unsupported-viewport.module';

import README from './README.md';

const moduleMetadata = {
  imports: [UnsupportedViewportModule, HttpClientModule]
};

const baseComponent = {
  moduleMetadata,
  component: UnsupportedViewportComponent
};

export default {
  title: 'UnsupportedViewportComponent',
  parameters: {
    notes: { markdown: README }
  }
};

export const primary = () => ({
  ...baseComponent
});
