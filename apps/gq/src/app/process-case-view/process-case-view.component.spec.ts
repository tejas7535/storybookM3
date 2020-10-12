import { ComponentFixture, TestBed } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { provideTranslocoTestingModule } from '@schaeffler/transloco';
import { configureTestSuite } from 'ng-bullet';
import { SharedModule } from '../shared/shared.module';
import { ProcessCaseHeaderModule } from './process-case-header/process-case-header.module';
import { ProcessCaseViewRoutingModule } from './process-case-view-routing.module';

import { ProcessCaseViewComponent } from './process-case-view.component';
import { QuotationDetailsTableModule } from './quotation-details-table/quotation-details-table.module';

jest.mock('@ngneat/transloco', () => ({
  ...jest.requireActual('@ngneat/transloco'),
  translate: jest.fn(() => 'translate it'),
}));

describe('QuotationViewComponent', () => {
  let component: ProcessCaseViewComponent;
  let fixture: ComponentFixture<ProcessCaseViewComponent>;

  configureTestSuite(() => {
    TestBed.configureTestingModule({
      imports: [
        SharedModule,
        ProcessCaseViewRoutingModule,
        QuotationDetailsTableModule,
        ProcessCaseHeaderModule,
        provideTranslocoTestingModule({}),
        RouterTestingModule,
      ],
      declarations: [ProcessCaseViewComponent],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ProcessCaseViewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
