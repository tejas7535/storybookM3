import { ErrorHandler } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';

import { ApplicationInsightsModule } from './application-insights.module';
import { ApplicationInsightsErrorHandlerService } from './application-insights-error-handler.service';
import { ApplicationInsightsModuleConfig } from './application-insights-module-config';
import { NGRX_IGNORE_PATTERN } from './ngrx-ignore-pattern';

const baseModuleConfiguration: ApplicationInsightsModuleConfig = {
  applicationInsightsConfig: {
    instrumentationKey: 'key',
  },
  enableGlobalErrorHandler: true,
  enableNgrxMetaReducer: true,
  ngrxIgnorePattern: ['@ngrx/*'],
};

const setTestBed = (config: ApplicationInsightsModuleConfig) => {
  TestBed.configureTestingModule({
    imports: [ApplicationInsightsModule.forRoot(config), RouterTestingModule],
  });
};

describe('ApplicationInsightsModule', () => {
  let moduleConfiguration: ApplicationInsightsModuleConfig;

  beforeEach(() => {
    moduleConfiguration = baseModuleConfiguration;
  });

  it('should have a module definition', () => {
    setTestBed(moduleConfiguration);

    expect(TestBed.inject(ApplicationInsightsModule)).toBeDefined();
  });

  describe('ErrorHandler', () => {
    it('should have custom error handler defined', () => {
      setTestBed(moduleConfiguration);
      const errorHandler = TestBed.inject(ErrorHandler);

      expect(
        errorHandler instanceof ApplicationInsightsErrorHandlerService
      ).toBeTruthy();
    });

    it('should not have the custom error handler defined', () => {
      moduleConfiguration = {
        ...baseModuleConfiguration,
        enableGlobalErrorHandler: false,
      };
      setTestBed(moduleConfiguration);

      const errorHandler = TestBed.inject(ErrorHandler);

      expect(
        errorHandler instanceof ApplicationInsightsErrorHandlerService
      ).toBeFalsy();
    });
  });

  describe('ngrxIgnorePattern', () => {
    it('injection token should be undefined - usecase 1', () => {
      moduleConfiguration = {
        ...baseModuleConfiguration,
        enableNgrxMetaReducer: false,
        ngrxIgnorePattern: undefined,
      };
      setTestBed(moduleConfiguration);

      let errorThrown = false;
      let ignorePattern;

      try {
        // try to get Injection Token --> will throw an error if undefined
        ignorePattern = TestBed.inject(NGRX_IGNORE_PATTERN);
      } catch {
        errorThrown = true;
      }

      expect(ignorePattern).toBeUndefined();
      expect(errorThrown).toBeTruthy();
    });

    it('injection token should be undefined - usecase 2', () => {
      moduleConfiguration = {
        ...baseModuleConfiguration,
        enableNgrxMetaReducer: false,
      };
      setTestBed(moduleConfiguration);

      let errorThrown = false;
      let ignorePattern;

      try {
        // try to get Injection Token --> will throw an error if undefined
        ignorePattern = TestBed.inject(NGRX_IGNORE_PATTERN);
      } catch {
        errorThrown = true;
      }

      expect(ignorePattern).toBeUndefined();
      expect(errorThrown).toBeTruthy();
    });

    it('injection token should be defined', () => {
      setTestBed(moduleConfiguration);

      const ignorePattern = TestBed.inject(NGRX_IGNORE_PATTERN);

      expect(ignorePattern).toEqual(['@ngrx/*']);
    });
  });
});
