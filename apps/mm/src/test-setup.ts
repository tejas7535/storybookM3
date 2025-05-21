// setup-jest.ts
import './__mocks__/pdf-mock';

import { setupZoneTestEnv } from 'jest-preset-angular/setup-env/zone/index.mjs';

setupZoneTestEnv();
