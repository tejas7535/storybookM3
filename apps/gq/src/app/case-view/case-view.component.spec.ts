import { MatCardModule } from '@angular/material/card';
import { MatDialogModule } from '@angular/material/dialog';
import { MatIconModule } from '@angular/material/icon';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { RouterTestingModule } from '@angular/router/testing';

import { AgGridModule } from '@ag-grid-community/angular';
import { createComponentFactory, Spectator } from '@ngneat/spectator/jest';
import { ReactiveComponentModule } from '@ngrx/component';
import { provideMockStore } from '@ngrx/store/testing';

import { provideTranslocoTestingModule } from '@schaeffler/transloco';

import { AutocompleteInputModule } from '../shared/autocomplete-input/autocomplete-input.module';
import { AddEntryModule } from '../shared/case-material/add-entry/add-entry.module';
import { InputTableModule } from '../shared/case-material/input-table/input-table.module';
import { CustomStatusBarModule } from '../shared/custom-status-bar/custom-status-bar.module';
import { DeleteCaseButtonComponent } from '../shared/custom-status-bar/delete-case-button/delete-case-button.component';
import { OpenCaseButtonComponent } from '../shared/custom-status-bar/open-case-button/open-case-button.component';
import { LoadingSpinnerModule } from '../shared/loading-spinner/loading-spinner.module';
import { CaseTableModule } from './case-table/case-table.module';
import { CaseViewComponent } from './case-view.component';
import { CreateCaseDialogComponent } from './create-case-dialog/create-case-dialog.component';
import { SelectSalesOrgModule } from './create-case-dialog/select-sales-org/select-sales-org.module';

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
      provideTranslocoTestingModule({ en: {} }),
      RouterTestingModule.withRoutes([]),
      LoadingSpinnerModule,
      ReactiveComponentModule,
      SelectSalesOrgModule,
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
