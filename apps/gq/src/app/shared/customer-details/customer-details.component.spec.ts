import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { RouterTestingModule } from '@angular/router/testing';

import { createComponentFactory, Spectator } from '@ngneat/spectator/jest';

import { provideTranslocoTestingModule } from '@schaeffler/transloco';

import { SharedModule } from '..';
import { CUSTOMER_MOCK } from '../../../testing/mocks';
import { CustomerDetailsComponent } from './customer-details.component';

jest.mock('@ngneat/transloco', () => ({
  ...jest.requireActual('@ngneat/transloco'),
  translate: jest.fn(() => 'translate it'),
}));

describe('CustomerDetailsComponent', () => {
  let component: CustomerDetailsComponent;
  let spectator: Spectator<CustomerDetailsComponent>;

  const createComponent = createComponentFactory({
    component: CustomerDetailsComponent,
    declarations: [CustomerDetailsComponent],
    imports: [
      SharedModule,
      MatCardModule,
      MatButtonModule,
      provideTranslocoTestingModule({}),
      RouterTestingModule,
    ],
  });

  beforeEach(() => {
    spectator = createComponent();
    component = spectator.debugElement.componentInstance;
    component.customer = CUSTOMER_MOCK;
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
  describe('customerToArray', () => {
    test('should return a customer', () => {
      const responseArray = component.customerToArray(CUSTOMER_MOCK);
      expect(responseArray).toEqual([
        ['name', CUSTOMER_MOCK.name],
        ['keyAccount', CUSTOMER_MOCK.keyAccount],
        ['id', CUSTOMER_MOCK.identifiers.customerId],
        ['subKeyAccount', CUSTOMER_MOCK.subKeyAccount],
        ['classification', CUSTOMER_MOCK.abcClassification],
        ['sectorManagement', CUSTOMER_MOCK.sectorManagement],
        ['lastYearNetSales', undefined],
        ['lastYearGPI', undefined],
      ]);
    });
    test('should return empty array if no customer', () => {
      const customer = undefined as any;
      const responseArray = component.customerToArray(customer);
      expect(responseArray).toEqual([]);
    });
  });

  describe('insertData', () => {
    test('should return lastYear', () => {
      const key = 'lastYearNetSales';
      component.lastYear = 2020;
      const result = component.insertLastYear(key);
      expect(result).toEqual(`${2020}`);
    });
    test('should return empty string', () => {
      const result = component.insertLastYear('');
      expect(result).toEqual('');
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
