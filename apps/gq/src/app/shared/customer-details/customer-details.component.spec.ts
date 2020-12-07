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
