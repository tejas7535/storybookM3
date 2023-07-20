import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';

import { QuotationStatus } from '@gq/shared/models';
import { createComponentFactory, Spectator } from '@ngneat/spectator/jest';
import { ICellRendererParams } from 'ag-grid-community';

import { provideTranslocoTestingModule } from '@schaeffler/transloco/testing';

import { QuotationStatusCellComponent } from './quotation-status-cell.component';

describe('QuotationStatusCellComponent', () => {
  let component: QuotationStatusCellComponent;
  let spectator: Spectator<QuotationStatusCellComponent>;

  const createComponent = createComponentFactory({
    component: QuotationStatusCellComponent,
    imports: [provideTranslocoTestingModule({ en: {} })],
    schemas: [CUSTOM_ELEMENTS_SCHEMA],
  });

  beforeEach(() => {
    spectator = createComponent();
    component = spectator.debugElement.componentInstance;
  });

  test('should create', () => {
    expect(component).toBeTruthy();
  });

  describe('agInit', () => {
    test('should set status', () => {
      expect(component.status).toBeUndefined();

      component.agInit({
        value: QuotationStatus.ACTIVE,
      } as ICellRendererParams);

      expect(component.status).toBe(QuotationStatus.ACTIVE);
    });
  });
});
