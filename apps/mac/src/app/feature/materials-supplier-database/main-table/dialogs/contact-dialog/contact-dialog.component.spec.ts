import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { MatDialogRef } from '@angular/material/dialog';

import { createComponentFactory, Spectator } from '@ngneat/spectator/jest';
import { MockProvider } from 'ng-mocks';

import { ApplicationInsightsService } from '@schaeffler/application-insights';
import { provideTranslocoTestingModule } from '@schaeffler/transloco/testing';

import * as en from '../../../../../../assets/i18n/en.json';
import {
  contactSupplierDevelopment,
  contactSustainability,
} from './contact-data';
import { ContactDialogComponent } from './contact-dialog.component';

describe('ContactDialogComponent', () => {
  let component: ContactDialogComponent;
  let spectator: Spectator<ContactDialogComponent>;

  const createComponent = createComponentFactory({
    component: ContactDialogComponent,
    imports: [provideTranslocoTestingModule({ en })],
    providers: [
      {
        provide: MatDialogRef,
        useValue: {
          close: jest.fn(),
        },
      },
      MockProvider(ApplicationInsightsService, { logEvent: jest.fn() }),
    ],
    schemas: [CUSTOM_ELEMENTS_SCHEMA],
  });

  beforeEach(() => {
    spectator = createComponent();
    component = spectator.debugElement.componentInstance;
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  describe('getContacts', () => {
    it('should return the contacts', () => {
      const expected = {
        contactSupplierDevelopment,
        contactSustainability,
      };

      expect(component.getContacts()).toEqual(expected);
    });
  });

  describe('track', () => {
    it('should track email usage', () => {
      component.trackEmail();
      expect(component['applicationInsightsService'].logEvent).toBeCalled();
    });
    it('should track teams usage', () => {
      component.trackTeams();
      expect(component['applicationInsightsService'].logEvent).toBeCalled();
    });
  });

  describe('closeDialog', () => {
    it('should close the dialog', () => {
      component.closeDialog();

      expect(component['dialogRef'].close).toHaveBeenCalled();
    });
  });
});
