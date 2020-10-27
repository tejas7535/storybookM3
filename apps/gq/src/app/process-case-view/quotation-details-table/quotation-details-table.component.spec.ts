import { ComponentFixture, TestBed } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';

import { IStatusPanelParams } from '@ag-grid-community/all-modules';
import { AgGridModule } from '@ag-grid-community/angular';
import { provideMockStore } from '@ngrx/store/testing';
import { configureTestSuite } from 'ng-bullet';

import { provideTranslocoTestingModule } from '@schaeffler/transloco';

import { CUSTOMER_MOCK, QUOTATION_MOCK } from '../../../testing/mocks';
import { AddToOfferButtonComponent } from '../../shared/custom-status-bar/add-to-offer-button/add-to-offer-button.component';
import { CustomStatusBarModule } from '../../shared/custom-status-bar/custom-status-bar.module';
import { DetailViewButtonComponent } from '../../shared/custom-status-bar/detail-view-button/detail-view-button.component';
import { QuotationDetailsTableComponent } from './quotation-details-table.component';

jest.mock('@ngneat/transloco', () => ({
  ...jest.requireActual('@ngneat/transloco'),
  translate: jest.fn(() => 'translate it'),
}));

describe('QuotationDetailsTableComponent', () => {
  let component: QuotationDetailsTableComponent;
  let fixture: ComponentFixture<QuotationDetailsTableComponent>;

  configureTestSuite(() => {
    TestBed.configureTestingModule({
      declarations: [QuotationDetailsTableComponent],
      imports: [
        AgGridModule.withComponents([
          AddToOfferButtonComponent,
          DetailViewButtonComponent,
        ]),
        provideTranslocoTestingModule({}),
        CustomStatusBarModule,
        RouterTestingModule,
      ],
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
    fixture = TestBed.createComponent(QuotationDetailsTableComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  describe('onFirstDataRendered', () => {
    it('should call autoSizeAllColumns', () => {
      const params = ({
        api: {
          sizeColumnsToFit: jest.fn(),
        },
      } as unknown) as IStatusPanelParams;

      component.onFirstDataRendered(params);

      expect(params.api.sizeColumnsToFit).toHaveBeenCalled();
    });
  });
});
