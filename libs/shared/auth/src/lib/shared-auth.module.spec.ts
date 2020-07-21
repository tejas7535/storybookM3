import { TestBed } from '@angular/core/testing';

import { configureTestSuite } from 'ng-bullet';

import { AzureConfig, FlowType } from './models';
import { SharedAuthModule, storageFactory } from './shared-auth.module';

describe('SharedAuthModule', () => {
  configureTestSuite(() => {
    TestBed.configureTestingModule({
      imports: [SharedAuthModule],
    });
  });

  test('should create', () => {
    expect(SharedAuthModule).toBeDefined();
  });

  test('storageFactory should return localStorage', () => {
    const store = storageFactory();

    expect(store).toEqual(localStorage);
  });

  test('should return module on forRoot', () => {
    const azureConf = new AzureConfig(
      'tenant',
      'client',
      'app',
      FlowType.CODE_FLOW,
      true,
      'loginUrl'
    );
    const module = SharedAuthModule.forRoot(azureConf);

    expect(module).toBeDefined();
  });

  test('should throw error if already loaded', () => {
    let throwError = false;

    try {
      const azureConf = new AzureConfig(
        'tenant',
        'client',
        'app',
        FlowType.CODE_FLOW,
        true
      );
      const module = SharedAuthModule.forRoot(azureConf);

      // tslint:disable-next-line: no-unused-expression
      new SharedAuthModule(module);
    } catch (e) {
      throwError = true;
      expect(e.message).toEqual(
        'SharedAuthModule is already loaded. Import it in the AppModule only'
      );
    }

    expect(throwError).toBeTruthy();
  });

  test('should create module when no parent avl', () => {
    const module = new SharedAuthModule(undefined);

    expect(module).toBeDefined();
  });
});
