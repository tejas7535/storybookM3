import { signal } from '@angular/core';

import { Stub } from './../../../../../test/stub.class';
import { CustomerMaterialNumbersModalComponent } from './customer-material-numbers-modal.component';

describe('CustomerMaterialNumbersModalComponent', () => {
  let component: CustomerMaterialNumbersModalComponent;

  const mockData = {
    customerMaterialNumbers: signal(['123', '456', '789']),
    isLoading: signal(false),
  };

  beforeEach(() => {
    component = Stub.getForEffect<CustomerMaterialNumbersModalComponent>({
      component: CustomerMaterialNumbersModalComponent,
      providers: [Stub.getMatDialogDataProvider(mockData)],
    });

    Stub.detectChanges();
  });

  afterEach(() => {
    mockData.customerMaterialNumbers.set(['123', '456', '789']);
    mockData.isLoading.set(false);
  });

  it('should initialize with data from MAT_DIALOG_DATA', () => {
    expect(component['customerMaterialNumbers']()).toEqual([
      '123',
      '456',
      '789',
    ]);
    expect(component['isLoading']()).toBe(false);
  });

  it('should update isLoading signal correctly', () => {
    mockData.isLoading.set(true);
    expect(component['isLoading']()).toBe(true);

    mockData.isLoading.set(false);
    expect(component['isLoading']()).toBe(false);
  });

  it('should update customerMaterialNumbers signal correctly', () => {
    mockData.customerMaterialNumbers.set(['111', '222']);
    expect(component['customerMaterialNumbers']()).toEqual(['111', '222']);
  });

  describe('ngOnInit', () => {
    it('should set isLoading and customerMaterialNumbers from data', () => {
      component.ngOnInit();

      expect(component['isLoading']()).toBe(false);
      expect(component['customerMaterialNumbers']()).toEqual([
        '123',
        '456',
        '789',
      ]);
    });
  });

  describe('copyCustomerMaterialNumbersToClipboard', () => {
    const original = globalThis.navigator;
    let writeTextSpy: jest.SpyInstance;

    beforeEach(() => {
      Object.defineProperty(globalThis, 'navigator', {
        configurable: true,
        writable: true,
        value: {
          clipboard: { writeText: jest.fn() },
        },
      });

      writeTextSpy = jest
        .spyOn(globalThis.navigator.clipboard, 'writeText')
        .mockImplementation(() => Promise.resolve());
    });

    afterEach(() => {
      writeTextSpy.mockRestore();
    });

    afterAll(() => {
      globalThis.navigator = original;
    });

    it('should copy customer material numbers to clipboard', async () => {
      component['copyCustomerMaterialNumbersToClipboard']();

      expect(writeTextSpy).toHaveBeenCalledWith('123\n456\n789');

      writeTextSpy.mockRestore();
    });
  });
});
