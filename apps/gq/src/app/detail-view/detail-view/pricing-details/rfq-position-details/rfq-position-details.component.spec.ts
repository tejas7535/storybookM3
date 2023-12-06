import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';

import { createComponentFactory, Spectator } from '@ngneat/spectator/jest';

import { provideTranslocoTestingModule } from '@schaeffler/transloco/testing';

import { RfqPositionDetailsComponent } from './rfq-position-details.component';
import { SharedPipesModule } from '@gq/shared/pipes/shared-pipes.module';
import { MAT_DIALOG_DATA, MatDialog } from '@angular/material/dialog';

describe('RfqPositionDetailsComponent', () => {
  let component: RfqPositionDetailsComponent;
  let spectator: Spectator<RfqPositionDetailsComponent>;

  const createComponent = createComponentFactory({
    component: RfqPositionDetailsComponent,
    imports: [provideTranslocoTestingModule({ en: {} }), SharedPipesModule],
    providers: [
      { provide: MatDialog, useValue: {} },
      {
        provide: MAT_DIALOG_DATA,
        useValue: { gqpPositionId: '123' },
      },
    ],
    schemas: [CUSTOM_ELEMENTS_SCHEMA],
  });

  beforeEach(() => {
    spectator = createComponent();
    component = spectator.debugElement.componentInstance;
    jest.clearAllMocks();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  describe('refreshRfqInformation', () => {
    test('should open dialog', () => {
      const openMock = jest.fn();
      component['matDialog'].open = openMock;
      component.rfqData = { gqPositionId: '123' } as any;

      component.updateRfqData();

      expect(openMock).toBeCalledTimes(1);
    });
  });
});
