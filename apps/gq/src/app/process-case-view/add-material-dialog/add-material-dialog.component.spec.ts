import { MatCardModule } from '@angular/material/card';
import { MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { MatIconModule } from '@angular/material/icon';

import { AgGridModule } from '@ag-grid-community/angular';
import { createComponentFactory, Spectator } from '@ngneat/spectator/jest';
import { provideMockStore } from '@ngrx/store/testing';

import { provideTranslocoTestingModule } from '@schaeffler/transloco';

import { SharedModule } from '../../shared';
import { AutocompleteInputModule } from '../../shared/autocomplete-input/autocomplete-input.module';
import { AddEntryModule } from '../../shared/case-material/add-entry/add-entry.module';
import { InputTableModule } from '../../shared/case-material/input-table/input-table.module';
import { AddMaterialDialogComponent } from './add-material-dialog.component';

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
      InputTableModule,
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
