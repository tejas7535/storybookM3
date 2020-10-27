import { ComponentFixture, TestBed } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';

import { IStatusPanelParams } from '@ag-grid-community/all-modules';
import { AgGridModule } from '@ag-grid-community/angular';
import { provideMockStore } from '@ngrx/store/testing';
import { configureTestSuite } from 'ng-bullet';

import { provideTranslocoTestingModule } from '@schaeffler/transloco';

import { CUSTOMER_MOCK, QUOTATION_MOCK } from '../../../testing/mocks';
import { CustomStatusBarModule } from '../custom-status-bar/custom-status-bar.module';
import { FinishOfferButtonComponent } from '../custom-status-bar/finish-offer-button/finish-offer-button.component';
import { RemoveFromOfferButtonComponent } from '../custom-status-bar/remove-from-offer-button/remove-from-offer-button.component';
import { OfferTableComponent } from './offer-table.component';

jest.mock('@ngneat/transloco', () => ({
  ...jest.requireActual('@ngneat/transloco'),
  translate: jest.fn(() => 'translate it'),
}));

describe('OfferTableComponent', () => {
  let component: OfferTableComponent;
  let fixture: ComponentFixture<OfferTableComponent>;
  let params: IStatusPanelParams;

  configureTestSuite(() => {
    TestBed.configureTestingModule({
      declarations: [OfferTableComponent],
      imports: [
        AgGridModule.withComponents([
          FinishOfferButtonComponent,
          RemoveFromOfferButtonComponent,
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
    fixture = TestBed.createComponent(OfferTableComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
    params = ({
      api: {
        sizeColumnsToFit: jest.fn(),
      },
    } as unknown) as IStatusPanelParams;
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  describe('onFirstDataRendered', () => {
    it('should call autoSizeAllColumns', () => {
      component.onFirstDataRendered(params);

      expect(params.api.sizeColumnsToFit).toHaveBeenCalled();
    });
  });

  describe('onGridReady', () => {
    test('should set selections', () => {
      component.onGridReady(params);

      expect(params.api.sizeColumnsToFit).toHaveBeenCalled();
    });
  });
});
