import { SimpleChange, SimpleChanges } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';

import { Subject } from 'rxjs';

import { PDFGeneratorService } from '@lsa/core/services/pdf-generation/pdf-generator.service';
import { createComponentFactory, Spectator } from '@ngneat/spectator/jest';

import { provideTranslocoTestingModule } from '@schaeffler/transloco/testing';

import { AccessoryTableComponent } from './accessory-table.component';
import {
  generateFormGroup,
  transformAccessories,
} from './accessory-table.helper';
import { AccessoryTableGroup, TableItem } from './accessory-table.model';

jest.mock('./accessory-table.helper', () => ({
  generateFormGroup: jest.fn(),
  transformAccessories: jest.fn(),
  valueChanges: jest.fn(),
}));

describe('AccessoryTableComponent', () => {
  let spectator: Spectator<AccessoryTableComponent>;
  let component: AccessoryTableComponent;

  const createComponent = createComponentFactory({
    component: AccessoryTableComponent,
    imports: [provideTranslocoTestingModule({ en: {} })],
    providers: [
      {
        provide: PDFGeneratorService,
        useValue: {
          setFormData: jest.fn(),
        },
      },
    ],
  });

  beforeEach(() => {
    spectator = createComponent();
    component = spectator.component;
  });

  it('should create the component', () => {
    expect(spectator.component).toBeTruthy();
  });

  describe('ngOnChanges', () => {
    const className = 'Adapter for lubricator';
    const firstFifteenDigit = '789666050000010';
    const secondFifteenDigit = '123466050000010';
    let mockFormGroup: FormGroup;
    let mockBaseTableGroups: { [key: string]: AccessoryTableGroup };
    let changes: SimpleChanges;

    beforeEach(() => {
      mockFormGroup = new FormGroup({
        'Adapter for lubricator': new FormGroup({
          [firstFifteenDigit]: new FormControl<number>(1),
          [secondFifteenDigit]: new FormControl<number>(2),
        }),
      });

      (generateFormGroup as jest.Mock).mockReturnValue(mockFormGroup);

      mockBaseTableGroups = {
        'Adapter for lubricator': {
          groupTitle: className,
          groupClassId: '1',
          items: [
            {
              pim_code: '123456',
              fifteen_digit: firstFifteenDigit,
              class: 'Adapter',
            } as Partial<TableItem> as TableItem,
            {
              pim_code: '7890321',
              fifteen_digit: secondFifteenDigit,
              class: 'Adapter',
            } as Partial<TableItem> as TableItem,
          ],
        },
      };

      const accessories = [
        { id: 1, name: 'Accessory 1', class: 'Adapter for lubricator' },
      ];
      changes = {
        accessories: new SimpleChange(undefined, accessories, true),
      };
    });

    it('should provide state with pricing information', () => {
      const mockTableGroups = {
        'Adapter for lubricator': {
          groupTitle: className,
          items: [
            {
              ...mockBaseTableGroups[className].items[0],
              qty: 0,
              price: 0.51,
              currency: '$',
            },
            {
              ...mockBaseTableGroups[className].items[1],
              qty: 1,
              price: 0.68,
              currency: '$',
            },
          ],
        },
      };

      (transformAccessories as jest.Mock).mockReturnValue(mockTableGroups);

      jest.spyOn(component['formUpdate$'], 'next');
      jest.spyOn(spectator.component, 'generateAccessoriesForInput');

      spectator.component.ngOnChanges(changes);

      expect(spectator.component['formUpdate$'].next).toHaveBeenCalled();
      expect(spectator.component.accGroups).toEqual(mockTableGroups);
      expect(spectator.component.tableGroupStates).toMatchSnapshot();

      expect(
        spectator.component.generateAccessoriesForInput
      ).toHaveBeenCalled();
      expect(spectator.component.showEmptyState).toBe(false);
    });

    it('should provide pricing information with euro', () => {
      const mockItems = [
        {
          ...mockBaseTableGroups[className].items[0],
          qty: 0,
          price: 0.51,
          currency: '€',
        },
        {
          ...mockBaseTableGroups[className].items[1],
          qty: 1,
          price: 0.68,
          currency: '€',
        },
      ];

      const mockTableGroups = {
        [className]: {
          groupTitle: className,
          items: mockItems,
        },
      };

      (transformAccessories as jest.Mock).mockReturnValue(mockTableGroups);

      spectator.component.ngOnChanges(changes);

      expect(spectator.component.tableGroupStates).toMatchSnapshot();
    });

    it('should set showEmptyState to true when accessories is null', () => {
      const newChanges: SimpleChanges = {
        accessories: new SimpleChange(
          [{ id: 1, name: 'Accessory 1' }],
          undefined,
          true
        ),
      };

      spectator.component.ngOnChanges(newChanges);

      expect(spectator.component.showEmptyState).toBe(true);
    });

    describe('when values are changing', () => {
      beforeEach(() => {
        const mockItems = [
          {
            ...mockBaseTableGroups[className].items[0],
            qty: 0,
            price: 0.51,
            currency: '€',
          },
          {
            ...mockBaseTableGroups[className].items[1],
            qty: 1,
            price: 0.68,
            currency: '€',
          },
        ];

        const mockTableGroups = {
          [className]: {
            groupTitle: className,
            items: mockItems,
          },
        };

        (transformAccessories as jest.Mock).mockReturnValue(mockTableGroups);

        spectator.component.ngOnChanges(changes);
      });

      it('should recalculates the totalQty and totalPrice', () => {
        mockFormGroup.patchValue({
          [className]: {
            [firstFifteenDigit]: 10,
          },
        });

        mockFormGroup.updateValueAndValidity();

        expect(spectator.component.tableGroupStates).toMatchSnapshot();
      });
    });
  });

  describe('ngOnDestroy', () => {
    it('should complete the observable', () => {
      const destroy$ = spectator.component['destroy$'] as Subject<void>;
      const nextSpy = jest.spyOn(destroy$, 'next');
      const completeSpy = jest.spyOn(destroy$, 'complete');

      component.ngOnDestroy();

      expect(nextSpy).toHaveBeenCalled();
      expect(completeSpy).toHaveBeenCalled();
    });
  });

  describe('should show price columnt', () => {
    it('should return true if any state has a totalNetPrice', () => {
      component.tableGroupStates = {
        group1: { isOpen: true, totalQty: 0, totalNetPrice: 100 },
        group2: { isOpen: true, totalQty: 0, totalNetPrice: 0 },
      };
      expect(component.shouldShowPriceColumn()).toBe(true);
    });
    it('should return false if tableGroupStates is empty', () => {
      component.tableGroupStates = {};
      expect(component.shouldShowPriceColumn()).toBe(false);
    });
  });

  describe('isNaN', () => {
    it('should return true for NaN', () => {
      expect(component.isNaN(Number.NaN)).toBe(true);
    });

    it('should return false for a number', () => {
      expect(component.isNaN(123)).toBe(false);
    });

    it('should return false for a number string', () => {
      expect(component.isNaN('123')).toBe(false);
    });
  });

  describe('when setting priceAvailabiltyResponses', () => {
    let mockFormGroup: FormGroup;
    const firstFifteenDigit = '789666050000010';
    const secondFifteenDigit = '123466050000010';
    const className = 'Adapter for lubricator';
    let mockBaseTableGroups: { [key: string]: AccessoryTableGroup };

    beforeEach(() => {
      mockBaseTableGroups = {
        'Adapter for lubricator': {
          groupTitle: className,
          groupClassId: '1',
          items: [
            {
              pim_code: '123456',
              fifteen_digit: firstFifteenDigit,
              class: 'Adapter',
            } as Partial<TableItem> as TableItem,
            {
              pim_code: '7890321',
              fifteen_digit: secondFifteenDigit,
              class: 'Adapter',
            } as Partial<TableItem> as TableItem,
          ],
        },
      };

      const mockTableGroups = {
        'Adapter for lubricator': {
          groupTitle: className,
          items: [
            {
              ...mockBaseTableGroups[className].items[0],
            },
            {
              ...mockBaseTableGroups[className].items[1],
            },
          ],
        },
      };

      (transformAccessories as jest.Mock).mockReturnValue(mockTableGroups);

      mockFormGroup = new FormGroup({
        'Adapter for lubricator': new FormGroup({
          [firstFifteenDigit]: new FormControl<number>(1),
          [secondFifteenDigit]: new FormControl<number>(2),
        }),
      });

      (generateFormGroup as jest.Mock).mockReturnValue(mockFormGroup);

      spectator.setInput('accessories', [
        {
          id: 1,
          matnr: firstFifteenDigit,
          pim_code: '123456',
          name: 'Accessory 1',
          class: 'Adapter for lubricator',
        },
      ]);

      spectator.setInput('priceAndAvailabilityResponses', {
        '123456': { available: true, price: 100, currency: 'USD' },
        '7890321': { available: false, currency: 'USD' },
      });
    });

    it('should update price and availability', () => {
      spectator.detectChanges();

      expect(component.priceAndAvailabilityResponses).toMatchSnapshot();
    });

    it('should update accessory with price and availability', () => {
      spectator.detectChanges();

      expect(component.accessories).toMatchSnapshot();
    });
  });
});
