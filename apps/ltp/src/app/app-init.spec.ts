import { fakeAsync, TestBed, tick } from '@angular/core/testing';

import { KeycloakService } from 'keycloak-angular';
import { configureTestSuite } from 'ng-bullet';

import { initializer } from './app-init';

class MockKeycloakService {
  /**
   * I dont need docu
   */
  public async init(): Promise<any> {
    return new Promise(() => {});
  }
}

describe('Keycloak initializer', () => {
  let keycloakService: KeycloakService;

  configureTestSuite(() => {
    TestBed.configureTestingModule({
      providers: [{ provide: KeycloakService, useClass: MockKeycloakService }]
    });
  });

  beforeEach(() => {
    keycloakService = TestBed.inject(KeycloakService);
  });

  it('should be a function', () => {
    const keycloakInit = initializer(keycloakService);
    expect(typeof keycloakInit).toEqual('function');
  });

  it('should start init on call', () => {
    const keycloakInit = initializer(keycloakService);
    spyOn(keycloakService, 'init').and.callThrough();

    keycloakInit();

    expect(keycloakService.init).toHaveBeenCalled();
  });

  it('should resolve if init works', fakeAsync(() => {
    const keycloakInit = initializer(keycloakService);
    let keycloakInitCalled = false;
    spyOn(keycloakService, 'init').and.returnValue(Promise.resolve());

    keycloakInit().then(() => {
      keycloakInitCalled = true;
    });

    tick();

    expect(keycloakInitCalled).toBeTruthy();
  }));

  it('should reject with error message if init not works', fakeAsync(() => {
    const keycloakInit = initializer(keycloakService);
    const errorMsg = 'something going wrong';
    let receivedErrorMsg = '';
    let keycloakInitCalled = false;
    spyOn(keycloakService, 'init').and.returnValue(Promise.reject(errorMsg));

    keycloakInit().catch((err: string) => {
      keycloakInitCalled = true;
      receivedErrorMsg = err;
    });

    tick();

    expect(keycloakInitCalled).toBeTruthy();
    expect(receivedErrorMsg).toEqual(errorMsg);
  }));
});
