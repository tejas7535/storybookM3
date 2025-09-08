import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';

import { of } from 'rxjs';

import { RfqCalculatorAttachment } from '@gq/calculator/rfq-4-detail-view/models/rfq-calculator-attachments.interface';
import { Rfq4ProcessFacade } from '@gq/core/store/rfq-4-process/rfq-4-process.facade';
import { createComponentFactory, Spectator } from '@ngneat/spectator/jest';
import { MockBuilder } from 'ng-mocks';

import { ProcessHistoryAttachmentsComponent } from './process-history-attachments.component';

describe('RecalculationAttachmentsComponent', () => {
  let component: ProcessHistoryAttachmentsComponent;
  let spectator: Spectator<ProcessHistoryAttachmentsComponent>;

  const dependencies = MockBuilder(ProcessHistoryAttachmentsComponent)
    .mock(Rfq4ProcessFacade, {
      downloadAttachment: jest.fn(),
      processAttachments$: of([]),
    })
    .build();

  const createComponent = createComponentFactory({
    component: ProcessHistoryAttachmentsComponent,
    ...dependencies,
    schemas: [CUSTOM_ELEMENTS_SCHEMA],
  });

  beforeEach(() => {
    spectator = createComponent();
    component = spectator.debugElement.componentInstance;
  });

  it('should create', () => {
    expect(spectator).toBeTruthy();
  });

  describe('downloadAttachment', () => {
    test('should call downloadAttachment from facade', () => {
      const attachment = {} as RfqCalculatorAttachment;
      component.downloadAttachment(attachment);
      const spy = jest.spyOn(
        component['rfq4ProcessesFacade'],
        'downloadAttachment'
      );
      expect(spy).toHaveBeenCalledWith(attachment);
    });
  });
});
