import { ComponentFixture, TestBed } from '@angular/core/testing';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';

import { provideTranslocoTestingModule } from '@schaeffler/transloco';

import { configureTestSuite } from 'ng-bullet';
import { CUSTOMER_MOCK } from '../../../testing/mocks';

import { SharedModule } from '../index';
import { CustomerDetailsComponent } from './customer-details.component';

jest.mock('@ngneat/transloco', () => ({
  ...jest.requireActual('@ngneat/transloco'),
  translate: jest.fn(() => 'translate it'),
}));

describe('CustomerDetailsComponent', () => {
  let component: CustomerDetailsComponent;
  let fixture: ComponentFixture<CustomerDetailsComponent>;

  configureTestSuite(() => {
    TestBed.configureTestingModule({
      declarations: [CustomerDetailsComponent],
      imports: [
        SharedModule,
        provideTranslocoTestingModule({}),
        MatCardModule,
        MatButtonModule,
      ],
    });
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(CustomerDetailsComponent);
    component = fixture.componentInstance;
    component.customer = CUSTOMER_MOCK;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
  describe('customerToArray', () => {
    test('should return a customer', () => {
      const responseArray = component.customerToArray(CUSTOMER_MOCK);
      expect(responseArray).toEqual([
        ['name', 'mock customer'],
        ['id', '123'],
        ['keyAccount', ''],
        ['subKeyAccount', ''],
        ['subRegion', 'subRegion'],
        ['country', 'mock country'],
        ['sectorManagement', 'sectorManagement'],
        ['subSector', 'subSector'],
      ]);
    });
    test('should return empty array if no customer', () => {
      const customer = undefined as any;
      const responseArray = component.customerToArray(customer);
      expect(responseArray).toEqual([]);
    });
  });
  describe('trackByFn()', () => {
    test('should return the loop index to track usersArray', () => {
      const indexNum = 1337;
      const retId = component.trackByFn(indexNum);
      expect(retId).toEqual(indexNum);
    });
  });
});
