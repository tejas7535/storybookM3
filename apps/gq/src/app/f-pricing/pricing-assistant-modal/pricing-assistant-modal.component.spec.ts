import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import {
  MAT_LEGACY_DIALOG_DATA as MAT_DIALOG_DATA,
  MatLegacyDialogRef as MatDialogRef,
} from '@angular/material/legacy-dialog';

import { NumberCurrencyPipe } from '@gq/shared/pipes/number-currency/number-currency.pipe';
import { createComponentFactory, Spectator } from '@ngneat/spectator/jest';
import { MockPipe } from 'ng-mocks';

import { provideTranslocoTestingModule } from '@schaeffler/transloco/testing';

import { PricingAssistantModalComponent } from './pricing-assistant-modal.component';

describe('PricingAssistant.modalComponent', () => {
  let component: PricingAssistantModalComponent;
  let spectator: Spectator<PricingAssistantModalComponent>;

  const createComponent = createComponentFactory({
    component: PricingAssistantModalComponent,
    imports: [provideTranslocoTestingModule({ en: {} })],
    declarations: [MockPipe(NumberCurrencyPipe)],
    providers: [
      { provide: MatDialogRef, useValue: {} },
      {
        provide: MAT_DIALOG_DATA,
        useValue: { attachments: [] },
      },
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
});
