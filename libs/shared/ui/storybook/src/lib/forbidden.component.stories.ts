import { HttpClientModule } from '@angular/common/http';
import { RouterTestingModule } from '@angular/router/testing';

import { ForbiddenComponent, ForbiddenModule } from '@schaeffler/empty-states';

const moduleMetadata = {
  imports: [ForbiddenModule, HttpClientModule, RouterTestingModule],
};

const baseComponent = {
  moduleMetadata,
  component: ForbiddenComponent,
};

export default {
  title: 'Forbidden',
};

export const primary = () => ({
  ...baseComponent,
});
