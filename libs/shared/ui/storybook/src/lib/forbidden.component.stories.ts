import { HttpClientModule } from '@angular/common/http';
import { RouterTestingModule } from '@angular/router/testing';

import { TranslocoModule } from '@ngneat/transloco';

import { ForbiddenComponent, ForbiddenModule } from '@schaeffler/empty-states';
import { StorybookTranslocoModule } from '@schaeffler/transloco';

import READMEMd from '../../../empty-states/src/lib/forbidden/README.md';

const moduleMetadata = {
  imports: [
    ForbiddenModule,
    HttpClientModule,
    RouterTestingModule,
    StorybookTranslocoModule,
    TranslocoModule,
  ],
};

const baseComponent = {
  moduleMetadata,
  component: ForbiddenComponent,
};

export default {
  title: 'Forbidden',
  parameters: {
    notes: { markdown: READMEMd },
  },
};

export const primary = () => ({
  ...baseComponent,
});
