import { MatCardModule } from '@angular/material/card';
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
import { AddEntryModule } from './create-case-dialog/add-entry/add-entry.module';
import { AutocompleteInputModule } from './create-case-dialog/autocomplete-input/autocomplete-input.module';
import { CreateCaseDialogComponent } from './create-case-dialog/create-case-dialog.component';
import { InputTableModule } from './create-case-dialog/input-table/input-table.module';

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
      AddEntryModule,
      MatDialogModule,
      MatIconModule,
      MatCardModule,
      NoopAnimationsModule,
      InputTableModule,
      provideTranslocoTestingModule({}),
      RouterTestingModule.withRoutes([]),
    ],
    providers: [
      provideMockStore({
        initialState: {
          viewCases: {
            quotations: [],
          },
        },
      }),
    ],
    declarations: [CaseViewComponent],
    entryComponents: [CreateCaseDialogComponent],
  });

  beforeEach(() => {
    spectator = createComponent();
    component = spectator.debugElement.componentInstance;
  });

  test('should create', () => {
    expect(component).toBeTruthy();
  });

  describe('ngOnDestroy', () => {
    test('should unsubscribe fromSubscription', () => {
      const spy = spyOn<any>(component['dialog'], 'closeAll');

      // tslint:disable-next-line: no-lifecycle-call
      component.ngOnDestroy();

      expect(spy).toHaveBeenCalled();
    });
  });

  describe('openCreateCaseDialog', () => {
    test('should call openDialog', () => {
      jest.spyOn(component['dialog'], 'open');

      component.openCreateCaseDialog();
      expect(component['dialog'].open).toHaveBeenCalled();
    });
  });
});
