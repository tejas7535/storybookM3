import { MatDialogRef } from '@angular/material/dialog';

import { TranslocoModule } from '@jsverse/transloco';
import { createComponentFactory, Spectator } from '@ngneat/spectator/jest';
import { provideMockStore } from '@ngrx/store/testing';

import { provideTranslocoTestingModule } from '@schaeffler/transloco/testing';

import { MsdAgGridStateService } from '@mac/feature/materials-supplier-database/services';

import * as en from '../../../../../../assets/i18n/en.json';
import { ConfirmDisclaimerDialogComponent } from './confirm-disclaimer-dialog.component';

jest.mock('@jsverse/transloco', () => ({
  ...jest.requireActual<TranslocoModule>('@jsverse/transloco'),
  translate: jest.fn((string) => string.split('.').pop()),
}));
describe('ConfirmDisclaimerDialogComponent', () => {
  let component: ConfirmDisclaimerDialogComponent;
  let spectator: Spectator<ConfirmDisclaimerDialogComponent>;

  const createComponent = createComponentFactory({
    component: ConfirmDisclaimerDialogComponent,
    imports: [provideTranslocoTestingModule({ en })],
    providers: [
      {
        provide: MatDialogRef,
        useValue: {
          close: jest.fn(),
        },
      },
      provideMockStore({}),
      {
        provide: MsdAgGridStateService,
        useValue: {
          getDisclaimerConsentTimeout: jest.fn(),
          storeDisclaimerConsentTimeout: jest.fn(),
        },
      },
    ],
  });

  beforeEach(() => {
    spectator = createComponent();
    component = spectator.debugElement.componentInstance;
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  describe('consent', () => {
    it('should do nothing if checked the checkbox is not checked', () => {
      component.storeConsent = false;
      component.consent();
      expect(
        component['msdAgGridStateService'].storeDisclaimerConsentTimeout
      ).not.toHaveBeenCalled();
    });
    it('should store the timeout value if checked the checkbox', () => {
      component.storeConsent = true;
      component.consent();
      expect(
        component['msdAgGridStateService'].storeDisclaimerConsentTimeout
      ).toHaveBeenCalled();
    });
  });
});
