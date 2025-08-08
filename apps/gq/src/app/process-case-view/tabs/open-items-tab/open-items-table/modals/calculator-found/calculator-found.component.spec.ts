import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';

import { Subject } from 'rxjs';

import { Rfq4ProcessFacade } from '@gq/core/store/rfq-4-process/rfq-4-process.facade';
import { QuotationDetail } from '@gq/shared/models';
import {
  createComponentFactory,
  mockProvider,
  Spectator,
} from '@ngneat/spectator/jest';

import { provideTranslocoTestingModule } from '@schaeffler/transloco/testing';

import { CalculatorFoundComponent } from './calculator-found.component';

describe('CalculatorFoundComponent', () => {
  let component: CalculatorFoundComponent;
  let spectator: Spectator<CalculatorFoundComponent>;
  const sendCalcRequestSuccessSubject$$: Subject<void> = new Subject<void>();

  const createComponent = createComponentFactory({
    component: CalculatorFoundComponent,
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

    spectator.setInput('quotationDetail', {
      gqPositionId: '123',
      rfq4: { message: 'inital message' },
    } as QuotationDetail);
    component = spectator.debugElement.componentInstance;
  });

  test('should create', () => {
    expect(component).toBeTruthy();
  });

  describe('ngOnInit', () => {
    test('should initialize messageControl with quotation detail message', () => {
      component.ngOnInit();
      expect(component.messageControl).toBeDefined();
      expect(component.messageControl.value).toEqual('inital message');
    });

    test('should subscribe to messageControl valueChanges', () => {
      component.messageChanged.emit = jest.fn();
      component.ngOnInit();
      component.messageControl.setValue('New message');
      expect(component.messageChanged.emit).toHaveBeenCalledWith('New message');
    });
  });

  describe('sendRequest', () => {
    test('should call sendRecalculateSqvRequest with correct parameters', () => {
      component.messageControl.setValue('Test message');
      component.sendRequest();
      expect(
        component['rfq4ProcessesFacade'].sendRecalculateSqvRequest
      ).toHaveBeenCalledWith('123', 'Test message');
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
