import { MATERIAL_SANITY_CHECKS } from '@angular/material/core';
import { MatDialogRef } from '@angular/material/dialog';

import { createComponentFactory, Spectator } from '@ngneat/spectator/jest';
import { TranslocoModule } from '@ngneat/transloco';
import { PushModule } from '@ngrx/component';
import { provideMockStore } from '@ngrx/store/testing';
import { AgGridModule } from 'ag-grid-angular';

import { provideTranslocoTestingModule } from '@schaeffler/transloco/testing';

import { CellRendererModule } from '../../../ag-grid/cell-renderer/cell-renderer.module';
import { CustomStatusBarModule } from '../../../ag-grid/custom-status-bar/custom-status-bar.module';
import { HelperService } from '../../../services/helper-service/helper-service.service';
import { InputTableComponent } from './input-table.component';

jest.mock('@ngneat/transloco', () => ({
  ...jest.requireActual<TranslocoModule>('@ngneat/transloco'),
  translate: jest.fn(() => 'translate it'),
}));

describe('InputTableComponent', () => {
  let component: InputTableComponent;
  let spectator: Spectator<InputTableComponent>;

  const createComponent = createComponentFactory({
    component: InputTableComponent,
    imports: [
      AgGridModule,
      CellRendererModule,
      CustomStatusBarModule,
      PushModule,
      provideTranslocoTestingModule({ en: {} }),
    ],
    providers: [
      { provide: MATERIAL_SANITY_CHECKS, useValue: false },
      provideMockStore({}),
      {
        provide: MatDialogRef,
        useValue: {},
      },
      { provide: HelperService, useValue: {} },
    ],
  });
  beforeEach(() => {
    spectator = createComponent();
    component = spectator.debugElement.componentInstance;
  });

  test('should create', () => {
    expect(component).toBeTruthy();
  });
});
