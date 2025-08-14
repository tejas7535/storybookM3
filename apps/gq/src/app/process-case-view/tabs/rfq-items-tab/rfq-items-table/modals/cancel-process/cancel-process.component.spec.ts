import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';

import { Rfq4ProcessFacade } from '@gq/core/store/rfq-4-process/rfq-4-process.facade';
import { QuotationDetail } from '@gq/shared/models';
import {
  createComponentFactory,
  mockProvider,
  Spectator,
} from '@ngneat/spectator/jest';

import { provideTranslocoTestingModule } from '@schaeffler/transloco/testing';

import {
  CancellationReason,
  CancelProcessComponent,
} from './cancel-process.component';

describe('CancelProcessComponent', () => {
  let component: CancelProcessComponent;
  let spectator: Spectator<CancelProcessComponent>;

  const createComponent = createComponentFactory({
    component: CancelProcessComponent,
    imports: [provideTranslocoTestingModule({ en: {} })],
    providers: [
      mockProvider(Rfq4ProcessFacade, {
        sendCancelProcessRequest: jest.fn(),
      }),
    ],
    detectChanges: false,
    schemas: [CUSTOM_ELEMENTS_SCHEMA],
  });

  beforeEach(() => {
    spectator = createComponent();

    spectator.setInput('quotationDetail', {
      gqPositionId: '123',
    } as QuotationDetail);
    component = spectator.debugElement.componentInstance;
  });

  test('should create', () => {
    expect(component).toBeTruthy();
  });

  describe('sendRequest', () => {
    test('should call cancel process request', () => {
      const reasonForCancellation: CancellationReason = 'CUSTOMER';
      const comment = 'Test comment';
      component.cancelFormGroup
        .get('reasonForCancellation')
        .setValue(reasonForCancellation);
      component.cancelFormGroup.get('comment').setValue(comment);
      component.cancelProcess();
      expect(
        component['rfq4ProcessesFacade'].sendCancelProcessRequest
      ).toHaveBeenCalledWith('123', reasonForCancellation, comment);
    });
  });

  describe('closeDialog', () => {
    test('should emit cancelButtonClicked event', () => {
      component.cancelButtonClicked.emit = jest.fn();
      component.closeDialog();
      expect(component.cancelButtonClicked.emit).toHaveBeenCalled();
    });
  });
});
