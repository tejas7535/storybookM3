import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialog } from '@angular/material/dialog';

import { SharedPipesModule } from '@gq/shared/pipes/shared-pipes.module';
import { createComponentFactory, Spectator } from '@ngneat/spectator/jest';

import { provideTranslocoTestingModule } from '@schaeffler/transloco/testing';

import { ProductionCostDetailsComponent } from './production-cost-details.component';
describe('ProductionCostDetailsComponent', () => {
  let component: ProductionCostDetailsComponent;
  let spectator: Spectator<ProductionCostDetailsComponent>;

  const createComponent = createComponentFactory({
    component: ProductionCostDetailsComponent,
    imports: [provideTranslocoTestingModule({ en: {} }), SharedPipesModule],
    providers: [
      { provide: MatDialog, useValue: {} },
      {
        provide: MAT_DIALOG_DATA,
        useValue: { gqpPosId: '123' },
      },
    ],
    schemas: [CUSTOM_ELEMENTS_SCHEMA],
  });

  beforeEach(() => {
    spectator = createComponent();
    component = spectator.debugElement.componentInstance;
  });

  test('should create', () => {
    expect(component).toBeTruthy();
  });

  describe('refreshPrice', () => {
    test('should open dialog', () => {
      component.refreshEnabled = true;
      const openMock = jest.fn();
      component['matDialog'].open = openMock;
      component.quotationDetail = { gqPositionId: '123' } as any;

      component.updateCosts();

      expect(openMock).toHaveBeenCalledTimes(1);
    });

    test('should not open dialog', () => {
      component.refreshEnabled = false;
      const openMock = jest.fn();
      component['matDialog'].open = openMock;
      component.quotationDetail = { gqPositionId: '123' } as any;

      component.updateCosts();

      expect(openMock).toHaveBeenCalledTimes(0);
    });
  });
});
