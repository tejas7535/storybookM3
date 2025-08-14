import { of } from 'rxjs';

import { Rfq4ProcessFacade } from '@gq/core/store/rfq-4-process/rfq-4-process.facade';
import { QuotationDetail } from '@gq/shared/models';
import {
  createComponentFactory,
  mockProvider,
  Spectator,
} from '@ngneat/spectator/jest';

import { provideTranslocoTestingModule } from '@schaeffler/transloco/testing';

import { StartProcessComponent } from './start-process.component';

describe('StartProcessComponent', () => {
  let component: StartProcessComponent;
  let spectator: Spectator<StartProcessComponent>;

  const createComponent = createComponentFactory({
    component: StartProcessComponent,
    imports: [provideTranslocoTestingModule({ en: {} })],
    providers: [
      mockProvider(Rfq4ProcessFacade, {
        sendRecalculateSqvRequest: jest.fn(),
        maintainers$: of(['calc1', 'calc2']),
      }),
    ],
  });

  beforeEach(() => {
    spectator = createComponent();
    spectator.setInput('quotationDetail', {
      gqPositionId: '123',
      rfq4: { message: 'inital message' },
    } as QuotationDetail);
    spectator.setInput('calculators', ['calc1', 'calc2']);

    component = spectator.debugElement.componentInstance;
  });

  test('should create', () => {
    expect(component).toBeTruthy();
  });

  describe('cancelButtonClicked', () => {
    test('should emit cancel', () => {
      component.closeDialog.emit = jest.fn();
      component.cancelButtonClicked();
      expect(component.closeDialog.emit).toHaveBeenCalled();
    });
  });

  describe('messageChanged', () => {
    test('should update message property', () => {
      const newMessage = 'Updated message';
      component.messageChanged(newMessage);
      expect(component.message).toEqual(newMessage);
    });
  });

  describe('sendRequest', () => {
    test('should call sendReopenRecalculationRequest with correct parameters', () => {
      component.message = 'inital message';
      component.sendRequest();
      expect(
        component['rfq4ProcessesFacade'].sendRecalculateSqvRequest
      ).toHaveBeenCalledWith('123', 'inital message');
    });
  });
});
