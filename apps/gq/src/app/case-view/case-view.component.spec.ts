import { MatDialogModule } from '@angular/material/dialog';
import { MatIconModule } from '@angular/material/icon';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { RouterTestingModule } from '@angular/router/testing';

import { AgGridModule } from '@ag-grid-community/angular';
import { createComponentFactory, Spectator } from '@ngneat/spectator';
import { provideMockStore } from '@ngrx/store/testing';

import { provideTranslocoTestingModule } from '@schaeffler/transloco';

import { CustomStatusBarModule } from '../shared/custom-status-bar/custom-status-bar.module';
import { DeleteCaseButtonComponent } from '../shared/custom-status-bar/delete-case-button/delete-case-button.component';
import { OpenCaseButtonComponent } from '../shared/custom-status-bar/open-case-button/open-case-button.component';
import { CaseTableModule } from './case-table/case-table.module';
import { CaseViewComponent } from './case-view.component';
import { AutocompleteInputModule } from './create-case-dialog/autocomplete-input/autocomplete-input.module';
import { CreateCaseDialogModule } from './create-case-dialog/create-case-dialog.module';

jest.mock('@ngneat/transloco', () => ({
  ...jest.requireActual('@ngneat/transloco'),
  translate: jest.fn(() => 'translate it'),
}));

describe('CaseViewComponent', () => {
  let component: CaseViewComponent;
  let spectator: Spectator<CaseViewComponent>;

  const createComponent = createComponentFactory({
    component: CaseViewComponent,
    imports: [
      AutocompleteInputModule,
      AgGridModule.withComponents([
        OpenCaseButtonComponent,
        DeleteCaseButtonComponent,
      ]),
      CaseTableModule,
      CustomStatusBarModule,
      CreateCaseDialogModule,
      MatDialogModule,
      MatIconModule,
      NoopAnimationsModule,
      provideTranslocoTestingModule({}),
      RouterTestingModule.withRoutes([]),
    ],
    providers: [provideMockStore({})],
    declarations: [CaseViewComponent],
  });

  beforeEach(() => {
    spectator = createComponent();
    component = spectator.debugElement.componentInstance;
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
