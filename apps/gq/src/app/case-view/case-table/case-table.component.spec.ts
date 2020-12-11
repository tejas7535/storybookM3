import { MatDialogModule } from '@angular/material/dialog';
import { RouterTestingModule } from '@angular/router/testing';

import { AgGridModule } from '@ag-grid-community/angular';
import { createComponentFactory, Spectator } from '@ngneat/spectator';
import { provideMockStore } from '@ngrx/store/testing';

import { provideTranslocoTestingModule } from '@schaeffler/transloco';

import { CustomStatusBarModule } from '../../shared/custom-status-bar/custom-status-bar.module';
import { DeleteCaseButtonComponent } from '../../shared/custom-status-bar/delete-case-button/delete-case-button.component';
import { OpenCaseButtonComponent } from '../../shared/custom-status-bar/open-case-button/open-case-button.component';
import { CaseTableComponent } from './case-table.component';

jest.mock('@ngneat/transloco', () => ({
  ...jest.requireActual('@ngneat/transloco'),
  translate: jest.fn(() => 'translate it'),
}));

describe('CaseTableComponent', () => {
  let component: CaseTableComponent;
  let spectator: Spectator<CaseTableComponent>;

  const createComponent = createComponentFactory({
    component: CaseTableComponent,
    imports: [
      AgGridModule.withComponents({
        OpenCaseButtonComponent,
        DeleteCaseButtonComponent,
      }),
      CustomStatusBarModule,
      RouterTestingModule.withRoutes([]),
      MatDialogModule,
      provideTranslocoTestingModule({}),
    ],
    providers: [provideMockStore({})],
    declarations: [CaseTableComponent],
  });

  beforeEach(() => {
    spectator = createComponent();
    component = spectator.debugElement.componentInstance;
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
