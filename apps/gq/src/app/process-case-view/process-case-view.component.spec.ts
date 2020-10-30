import { ComponentFixture, TestBed } from '@angular/core/testing';
import { MatSidenavModule } from '@angular/material/sidenav';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { RouterTestingModule } from '@angular/router/testing';

import { provideMockStore } from '@ngrx/store/testing';
import { configureTestSuite } from 'ng-bullet';

import { provideTranslocoTestingModule } from '@schaeffler/transloco';

import { CUSTOMER_MOCK, QUOTATION_MOCK } from '../../testing/mocks';
import { SharedModule } from '../shared';
import { OfferDrawerModule } from '../shared/offer-drawer/offer-drawer.module';
import { ProcessCaseHeaderModule } from './process-case-header/process-case-header.module';
import { ProcessCaseViewRoutingModule } from './process-case-view-routing.module';
import { ProcessCaseViewComponent } from './process-case-view.component';
import { QuotationDetailsTableModule } from './quotation-details-table/quotation-details-table.module';

jest.mock('@ngneat/transloco', () => ({
  ...jest.requireActual('@ngneat/transloco'),
  translate: jest.fn(() => 'translate it'),
}));

describe('ProcessCaseViewComponent', () => {
  let component: ProcessCaseViewComponent;
  let fixture: ComponentFixture<ProcessCaseViewComponent>;

  configureTestSuite(() => {
    TestBed.configureTestingModule({
      imports: [
        BrowserAnimationsModule,
        MatSidenavModule,
        OfferDrawerModule,
        ProcessCaseHeaderModule,
        ProcessCaseViewRoutingModule,
        provideTranslocoTestingModule({}),
        QuotationDetailsTableModule,
        RouterTestingModule,
        SharedModule,
      ],
      declarations: [ProcessCaseViewComponent],
      providers: [
        provideMockStore({
          initialState: {
            processCase: {
              customer: {
                item: CUSTOMER_MOCK,
              },
              quotation: {
                item: QUOTATION_MOCK,
              },
            },
          },
        }),
      ],
    });
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ProcessCaseViewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  test('should create', () => {
    expect(component).toBeTruthy();
  });
});
