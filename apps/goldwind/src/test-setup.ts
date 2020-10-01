/* tslint:disable:ordered-imports */
import 'jest-canvas-mock';
import 'jest-preset-angular';

import { defineGlobalsInjections } from '@ngneat/spectator';
import { ReactiveComponentModule } from '@ngrx/component';

import { provideTranslocoTestingModule } from '@schaeffler/transloco';

defineGlobalsInjections({
  imports: [provideTranslocoTestingModule({}), ReactiveComponentModule],
});
