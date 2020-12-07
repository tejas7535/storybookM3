import { AgGridModule } from '@ag-grid-community/angular';
import { MatCardModule } from '@angular/material/card';
import { MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { MatIconModule } from '@angular/material/icon';
import { createComponentFactory, Spectator } from '@ngneat/spectator/jest';
import { provideMockStore } from '@ngrx/store/testing';

import { provideTranslocoTestingModule } from '@schaeffler/transloco';

import { AutocompleteInputModule } from '../../case-view/create-case-dialog/autocomplete-input/autocomplete-input.module';
import { SharedModule } from '../../shared';
import { AddEntryModule } from './add-entry/add-entry.module';
import { AddMaterialDialogComponent } from './add-material-dialog.component';
import { AddMaterialInputTableModule } from './add-material-input-table/add-material-input-table.module';

jest.mock('@ngneat/transloco', () => ({
  ...jest.requireActual('@ngneat/transloco'),
  translate: jest.fn(() => 'translate it'),
}));

describe('AddMaterialDialogComponent', () => {
  let component: AddMaterialDialogComponent;
  let spectator: Spectator<AddMaterialDialogComponent>;

  const createComponent = createComponentFactory({
    component: AddMaterialDialogComponent,
    declarations: [AddMaterialDialogComponent],
    imports: [
      AddEntryModule,
      AddMaterialInputTableModule,
      AgGridModule.withComponents([]),
      AutocompleteInputModule,
      MatCardModule,
      MatDialogModule,
      MatIconModule,
      SharedModule,
      provideTranslocoTestingModule({}),
    ],
    providers: [
      provideMockStore({}),
      {
        provide: MatDialogRef,
        useValue: {},
      },
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
