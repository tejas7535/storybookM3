import { Rfq4ProcessFacade } from '@gq/core/store/rfq-4-process/rfq-4-process.facade';
import { QuotationDetail } from '@gq/shared/models';
import {
  createComponentFactory,
  mockProvider,
  Spectator,
} from '@ngneat/spectator/jest';

import { provideTranslocoTestingModule } from '@schaeffler/transloco/testing';

import { ReopenProcessComponent } from './reopen-process.component';

describe('ReopenProcessComponent', () => {
  let component: ReopenProcessComponent;
  let spectator: Spectator<ReopenProcessComponent>;

  const createComponent = createComponentFactory({
    component: ReopenProcessComponent,
    imports: [provideTranslocoTestingModule({ en: {} })],
    providers: [
      mockProvider(Rfq4ProcessFacade, {
        sendReopenRecalculationRequest: jest.fn(),
      }),
    ],
  });

  beforeEach(() => {
    spectator = createComponent();

    spectator.setInput('quotationDetail', {
      gqPositionId: '123',
      rfq4: { message: 'inital message' },
    } as QuotationDetail);
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

  describe('sendRequest', () => {
    test('should call sendReopenRecalculationRequest with correct parameters', () => {
      component.sendRequest();
      expect(
        component['rfq4ProcessesFacade'].sendReopenRecalculationRequest
      ).toHaveBeenCalledWith('123');
    });
  });
});
