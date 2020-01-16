import { of } from 'rxjs';

import { HttpClientTestingModule } from '@angular/common/http/testing';
import { TestBed } from '@angular/core/testing';

import { TranslocoService } from '@ngneat/transloco';

import { configureTestSuite } from 'ng-bullet';

import { provideTranslocoTestingModule } from '../lib/shared-transloco-testing.module';
import {
  preloadLanguage,
  SharedTranslocoModule
} from './shared-transloco.module';

describe('SharedTranslocoModule for Root', () => {
  configureTestSuite(() => {
    TestBed.configureTestingModule({
      imports: [
        HttpClientTestingModule,
        provideTranslocoTestingModule({}),
        SharedTranslocoModule.forRoot(true)
      ]
    });
  });

  test('should create', () => {
    expect(SharedTranslocoModule).toBeDefined();
  });

  describe('preloadLanguage', () => {
    test('should load default language via transloco', () => {
      const service = TestBed.get(TranslocoService);
      service.load = jest.fn().mockImplementation(() => of(true));

      preloadLanguage(service)();

      expect(service.load).toHaveBeenCalled();
    });
  });
});

describe('SharedTranslocoModule for Child', () => {
  configureTestSuite(() => {
    TestBed.configureTestingModule({
      imports: [SharedTranslocoModule.forChild('scope', {})]
    });
  });

  test('should create', () => {
    expect(SharedTranslocoModule).toBeDefined();
  });
});
