import {
  AzureConfig,
  MsalGuardConfig,
  MsalInstanceConfig,
  MsalInterceptorConfig,
} from './models';
import { SharedAzureAuthModule } from './shared-azure-auth.module';

describe('SharedAzureAuth', () => {
  test('should return module on forRoot', () => {
    const azureConf = new AzureConfig(
      new MsalInstanceConfig('clientid', 'tenantid', true),
      new MsalInterceptorConfig([]),
      new MsalGuardConfig('/login-failed', [])
    );
    const module = SharedAzureAuthModule.forRoot(azureConf);

    expect(module).toBeDefined();
  });

  test('should throw error if already loaded', () => {
    let throwError = false;
    let errorMsg = '';

    try {
      const azureConf = new AzureConfig(
        new MsalInstanceConfig('clientid', 'tenantid', true),
        new MsalInterceptorConfig([]),
        new MsalGuardConfig('/login-failed', [])
      );
      const module = SharedAzureAuthModule.forRoot(azureConf);

      // eslint-disable-next-line @typescript-eslint/no-unused-expressions
      new SharedAzureAuthModule(module);
    } catch (error) {
      throwError = true;
      errorMsg = error.message;
    }
    expect(errorMsg).toEqual(
      'SharedAzureAuthModule is already loaded. Import it in the AppModule only'
    );
    expect(throwError).toBeTruthy();
  });

  test('should create module when no parent avl', () => {
    const module = new SharedAzureAuthModule(undefined);

    expect(module).toBeDefined();
  });
});
