import { ComponentFixture, TestBed } from '@angular/core/testing';
import { MatIconModule } from '@angular/material/icon';

import { provideMockStore } from '@ngrx/store/testing';
import { configureTestSuite } from 'ng-bullet';

import { provideTranslocoTestingModule } from '@schaeffler/transloco';

import { CUSTOMER_MOCK } from '../../../testing/mocks';
import { CustomerDetailsModule } from '../../shared/process-case-header/customer-details.component/customer-details.module';
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
    fixture = TestBed.createComponent(ProcessCaseHeaderComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  test('should create', () => {
    expect(component).toBeTruthy();
  });

  test('toggle drawer', () => {
    component['toggleOfferDrawer'].emit = jest.fn();

    component.drawerToggle();
    expect(component['toggleOfferDrawer'].emit).toHaveBeenCalledTimes(1);
  });
});
