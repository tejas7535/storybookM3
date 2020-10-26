import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AgGridModule } from '@ag-grid-community/angular';
import { provideMockStore } from '@ngrx/store/testing';
import { configureTestSuite } from 'ng-bullet';

import { CreateCaseButtonComponent } from '../../../shared/custom-status-bar/create-case-button/create-case-button.component';
import { CustomStatusBarModule } from '../../../shared/custom-status-bar/custom-status-bar.module';
import { ResetAllButtonComponent } from '../../../shared/custom-status-bar/reset-all-button/reset-all-button.component';
import { CellRendererModule } from './cell-renderer/cell-renderer.module';
import { InputTableComponent } from './input-table.component';

jest.mock('@ngneat/transloco', () => ({
  ...jest.requireActual('@ngneat/transloco'),
  translate: jest.fn(() => 'translate it'),
}));

jest.mock('@ngneat/transloco', () => ({
  ...jest.requireActual('@ngneat/transloco'),
  translate: jest.fn(() => 'translate it'),
}));

describe('InputTableComponent', () => {
  let component: InputTableComponent;
  let fixture: ComponentFixture<InputTableComponent>;

  configureTestSuite(() => {
    TestBed.configureTestingModule({
      declarations: [InputTableComponent],
      imports: [
        AgGridModule.withComponents([
          CreateCaseButtonComponent,
          ResetAllButtonComponent,
        ]),
        CellRendererModule,
        CustomStatusBarModule,
      ],
      providers: [provideMockStore({})],
    });
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(InputTableComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
