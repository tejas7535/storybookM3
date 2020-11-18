import { ComponentFixture, TestBed } from '@angular/core/testing';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';

import { provideMockStore } from '@ngrx/store/testing';
import { configureTestSuite } from 'ng-bullet';

import { provideTranslocoTestingModule } from '@schaeffler/transloco';

import { CUSTOMER_MOCK } from '../../../testing/mocks';
import { CustomerDetailsModule } from '../customer-details/customer-details.module';
import { CaseHeaderComponent } from './case-header.component';

jest.mock('@ngneat/transloco', () => ({
  ...jest.requireActual('@ngneat/transloco'),
  translate: jest.fn(() => 'translate it'),
}));

describe('ProcessCaseHeaderComponent', () => {
  let component: CaseHeaderComponent;
  let fixture: ComponentFixture<CaseHeaderComponent>;

  configureTestSuite(() => {
    TestBed.configureTestingModule({
      declarations: [CaseHeaderComponent],
      imports: [
        MatCardModule,
        MatIconModule,
        provideTranslocoTestingModule({}),
        CustomerDetailsModule,
      ],
      providers: [
        provideMockStore({
          initialState: {
            processCase: {
              customer: {
                item: CUSTOMER_MOCK,
              },
            },
          },
        }),
      ],
    });
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(CaseHeaderComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  test('should create', () => {
    expect(component).toBeTruthy();
  });

  describe('drawerToggle', () => {
    test('toggle drawer', () => {
      component['toggleOfferDrawer'].emit = jest.fn();

      component.drawerToggle();
      expect(component['toggleOfferDrawer'].emit).toHaveBeenCalledTimes(1);
    });
  });
  describe('backClicked', () => {
    test('backClicked', () => {
      component['_location'].back = jest.fn();

      component.backClicked();
      expect(component['_location'].back).toHaveBeenCalledTimes(1);
    });
  });
});
