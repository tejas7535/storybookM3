import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';

import { Subject } from 'rxjs';

import { Rfq4ProcessFacade } from '@gq/core/store/rfq-4-process/rfq-4-process.facade';
import {
  createComponentFactory,
  mockProvider,
  Spectator,
} from '@ngneat/spectator/jest';

import { provideTranslocoTestingModule } from '@schaeffler/transloco/testing';

import { ProcessesModalDialogData } from '../models/processes-modal-dialog-data.interface';
import { StartProcessComponent } from './start-process.component';

describe('StartProcessComponent', () => {
  let component: StartProcessComponent;
  let spectator: Spectator<StartProcessComponent>;
  const sendCalcRequestSuccessSubject$$: Subject<void> = new Subject<void>();

  const createComponent = createComponentFactory({
    component: StartProcessComponent,
    imports: [provideTranslocoTestingModule({ en: {} })],
    providers: [
      mockProvider(Rfq4ProcessFacade, {
        sendRecalculateSqvSuccess$:
          sendCalcRequestSuccessSubject$$.asObservable(),
        sendRecalculateSqvRequest: jest.fn(),
      }),
    ],
    detectChanges: false,
    schemas: [CUSTOM_ELEMENTS_SCHEMA],
  });

  beforeEach(() => {
    spectator = createComponent();

    spectator.setInput('modalData', {
      quotationDetail: {
        gqPositionId: '123',
      },
    } as ProcessesModalDialogData);
    component = spectator.debugElement.componentInstance;
  });

  test('should create', () => {
    expect(component).toBeTruthy();
  });

  describe('sendRequest', () => {
    test('should subscribe to sendRecalculateSqvSuccess$ and call closeDialog', () => {
      component.closeDialog = jest.fn();
      component.sendRequest();
      sendCalcRequestSuccessSubject$$.next();
      expect(component.closeDialog).toHaveBeenCalled();
    });

    test('should call sendRecalculateSqvRequest with correct parameters', () => {
      component.messageControl.setValue('Test message');
      component.sendRequest();
      expect(
        component['rfq4ProcessesFacade'].sendRecalculateSqvRequest
      ).toHaveBeenCalledWith('123', 'Test message');
    });
  });

  describe('closeDialog', () => {
    test('should emit cancelProcess event', () => {
      component.cancelProcess.emit = jest.fn();
      component.closeDialog();
      expect(component.cancelProcess.emit).toHaveBeenCalled();
    });
  });
});
