import { ComponentFixture, TestBed } from '@angular/core/testing';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { RouterTestingModule } from '@angular/router/testing';

import { provideMockStore } from '@ngrx/store/testing';
import { configureTestSuite } from 'ng-bullet';

import { provideTranslocoTestingModule } from '@schaeffler/transloco';

import { CUSTOMER_MOCK, QUOTATION_MOCK } from '../../../testing/mocks';
import { OfferTableModule } from '../offer-table/offer-table.module';
import { OfferDrawerComponent } from './offer-drawer.component';

jest.mock('@ngneat/transloco', () => ({
  ...jest.requireActual('@ngneat/transloco'),
  translate: jest.fn(() => 'translate it'),
}));

describe('OfferDrawerComponent', () => {
  let component: OfferDrawerComponent;
  let fixture: ComponentFixture<OfferDrawerComponent>;

  configureTestSuite(() => {
    TestBed.configureTestingModule({
      declarations: [OfferDrawerComponent],
      imports: [
        OfferTableModule,
        MatIconModule,
        MatButtonModule,
        provideTranslocoTestingModule({}),
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
    fixture = TestBed.createComponent(OfferDrawerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('toggle drawer', () => {
    component['toggleOfferDrawer'].emit = jest.fn();

    component.drawerToggle();
    expect(component['toggleOfferDrawer'].emit).toHaveBeenCalledTimes(1);
  });
});
