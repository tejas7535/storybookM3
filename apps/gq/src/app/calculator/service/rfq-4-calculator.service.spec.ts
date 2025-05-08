import { provideHttpClient } from '@angular/common/http';
import {
  HttpTestingController,
  provideHttpClientTesting,
} from '@angular/common/http/testing';

import { TranslocoLocaleService } from '@jsverse/transloco-locale';
import {
  createServiceFactory,
  mockProvider,
  SpectatorService,
} from '@ngneat/spectator/jest';

import { Rfq4CalculatorService } from './rfq-4-calculator.service';

describe('Rfq4CalculatorService', () => {
  let service: Rfq4CalculatorService;
  let spectator: SpectatorService<Rfq4CalculatorService>;
  let httpMock: HttpTestingController;

  const createService = createServiceFactory({
    service: Rfq4CalculatorService,
    providers: [
      provideHttpClient(),
      provideHttpClientTesting(),
      mockProvider(TranslocoLocaleService),
    ],
  });

  beforeEach(() => {
    spectator = createService();
    service = spectator.service;
    httpMock = spectator.inject(HttpTestingController);
  });

  afterEach(() => {
    httpMock.verify();
  });

  test('should be created', () => {
    expect(service).toBeTruthy();
  });

  // TODO: more test will follow when real BE is called
});
