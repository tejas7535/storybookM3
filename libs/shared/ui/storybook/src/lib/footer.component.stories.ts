import { APP_BASE_HREF, CommonModule } from '@angular/common';
import { MatIconModule } from '@angular/material/icon';
import { RouterModule } from '@angular/router';

import { text } from '@storybook/addon-knobs';

import { FooterComponent, FooterModule } from '@schaeffler/footer';

import READMEMd from '../../../footer/README.md';

const moduleMetadata = {
  imports: [
    CommonModule,
    FooterModule,
    RouterModule.forRoot([{ path: '**', redirectTo: '/', pathMatch: 'full' }]),
    MatIconModule,
  ],
  providers: [{ provide: APP_BASE_HREF, useValue: '/' }],
};

const baseComponent = {
  moduleMetadata,
  component: FooterComponent,
};

// eslint-disable-next-line
export default {
  title: 'Footer',
  parameters: {
    notes: { markdown: READMEMd },
  },
};

const externalGroupId = 'External Link';
const internalGroupId = 'Internal Link';

export const primary = () => ({
  ...baseComponent,
  props: {
    footerLinks: [
      {
        link: text('link', '/data-security', internalGroupId),
        title: text('title', 'Data Security', internalGroupId),
        external: false,
      },
      {
        link: text('link', 'https://www.schaeffler.com', externalGroupId),
        title: text('title', 'Schaefffler Homepage', externalGroupId),
        external: true,
      },
    ],
    appVersion: '0.0.1',
  },
});
