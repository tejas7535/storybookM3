import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';

import { SharedQuotationFacade } from '@gq/core/store/shared-quotation';
import { SharedPipesModule } from '@gq/shared/pipes/shared-pipes.module';
import { createComponentFactory, Spectator } from '@ngneat/spectator/jest';
import { MockProvider } from 'ng-mocks';

import { provideTranslocoTestingModule } from '@schaeffler/transloco/testing';

import { SharedQuotationButtonComponent } from './shared-quotation-button.component';

describe('SaveCaseButtonComponent', () => {
  let component: SharedQuotationButtonComponent;
  let spectator: Spectator<SharedQuotationButtonComponent>;

  const createComponent = createComponentFactory({
    component: SharedQuotationButtonComponent,
    imports: [provideTranslocoTestingModule({ en: {} }), SharedPipesModule],
    providers: [MockProvider(SharedQuotationFacade)],
    schemas: [CUSTOM_ELEMENTS_SCHEMA],
    detectChanges: false,
  });

  beforeEach(() => {
    spectator = createComponent();
    component = spectator.debugElement.componentInstance;
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  describe('onInit', () => {
    test('should call checkSharedQuotation', () => {
      const checkSharedQuotationMock = jest.fn();
      component['facade'].getSharedQuotation = checkSharedQuotationMock;
      component['quotationId'] = 12_345;

      component.ngOnInit();

      expect(checkSharedQuotationMock).toHaveBeenCalledTimes(1);
    });
  });

  describe('onSave', () => {
    test('should call saveSharedQuotation', () => {
      const saveSharedQuotationMock = jest.fn();
      component['facade'].saveSharedQuotation = saveSharedQuotationMock;
      component['quotationId'] = 12_345;

      component.onSave();

      expect(saveSharedQuotationMock).toHaveBeenCalledTimes(1);
    });
  });

  describe('onDelete', () => {
    test('should call unsaveSharedQuotation', () => {
      const unsaveSharedQuotationMock = jest.fn();
      component['facade'].deleteSharedQuotation = unsaveSharedQuotationMock;

      component.onDelete('123');

      expect(unsaveSharedQuotationMock).toHaveBeenCalledTimes(1);
    });
  });
});
