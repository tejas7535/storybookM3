import { ComponentFixture, TestBed } from '@angular/core/testing';
import { MatIconModule } from '@angular/material/icon';
import { provideTranslocoTestingModule } from '@schaeffler/transloco';
import { configureTestSuite } from 'ng-bullet';

import { CustomerDetailsModule } from './customer-details.component/customer-details.module';
import { ProcessCaseHeaderComponent } from './process-case-header.component';

jest.mock('@ngneat/transloco', () => ({
  ...jest.requireActual('@ngneat/transloco'),
  translate: jest.fn(() => 'translate it'),
}));

describe('ProcessCaseHeaderComponent', () => {
  let component: ProcessCaseHeaderComponent;
  let fixture: ComponentFixture<ProcessCaseHeaderComponent>;

  configureTestSuite(() => {
    TestBed.configureTestingModule({
      declarations: [ProcessCaseHeaderComponent],
      imports: [
        MatIconModule,
        provideTranslocoTestingModule({}),
        CustomerDetailsModule,
      ],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ProcessCaseHeaderComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
