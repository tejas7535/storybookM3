import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { MatDialogRef } from '@angular/material/dialog';

import { LocalizationService } from '@gq/shared/ag-grid/services/localization.service';
import { createComponentFactory, Spectator } from '@ngneat/spectator/jest';
import { PushModule } from '@ngrx/component';
import { provideMockStore } from '@ngrx/store/testing';
import { MockProvider } from 'ng-mocks';

import { provideTranslocoTestingModule } from '@schaeffler/transloco/testing';

import { InputTableColumnDefService } from './config/input-table-column-defs.service';
import { InputTableComponent } from './input-table.component';

describe('InputTableComponent', () => {
  let component: InputTableComponent;
  let spectator: Spectator<InputTableComponent>;

  const createComponent = createComponentFactory({
    component: InputTableComponent,
    imports: [PushModule, provideTranslocoTestingModule({ en: {} })],
    providers: [
      provideMockStore({
        initialState: {
          processCase: {
            addMaterials: {
              addMaterialRowData: [],
            },
          },
        },
      }),
      {
        provide: MatDialogRef,
        useValue: {},
      },
      MockProvider(InputTableColumnDefService, {
        BASE_COLUMN_DEFS: [],
      }),
      MockProvider(LocalizationService),
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
});
