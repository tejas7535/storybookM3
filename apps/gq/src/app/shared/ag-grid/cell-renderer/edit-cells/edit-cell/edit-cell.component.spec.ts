import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';

import { of } from 'rxjs';

import { ActiveCaseFacade } from '@gq/core/store/active-case/active-case.facade';
import { activeCaseFeature } from '@gq/core/store/active-case/active-case.reducer';
import { RolesFacade } from '@gq/core/store/facades';
import { ColumnFields } from '@gq/shared/ag-grid/constants/column-fields.enum';
import { EditingModalService } from '@gq/shared/components/modal/editing-modal/editing-modal.service';
import { UserRoles } from '@gq/shared/constants';
import {
  createComponentFactory,
  mockProvider,
  Spectator,
  SpyObject,
} from '@ngneat/spectator/jest';
import { provideMockStore } from '@ngrx/store/testing';
import { marbles } from 'rxjs-marbles/marbles';

import {
  QUOTATION_DETAIL_MOCK,
  QUOTATION_MOCK,
} from '../../../../../../testing/mocks';
import { EditCellComponent } from './edit-cell.component';

describe('EditCellComponent', () => {
  let component: EditCellComponent;
  let spectator: Spectator<EditCellComponent>;
  let editingModalServiceSpy: SpyObject<EditingModalService>;
  // TODO: add mock store and test if simulatedQuotation$ gets initialized for the right column fields

  const createComponent = createComponentFactory({
    component: EditCellComponent,
    detectChanges: false,
    providers: [
      provideMockStore({}),
      mockProvider(EditingModalService),
      mockProvider(ActiveCaseFacade, {
        getSimulatedQuotationDetailByItemId$: jest
          .fn()
          .mockReturnValue(of(QUOTATION_DETAIL_MOCK)),
      }),
      mockProvider(RolesFacade, {
        userHasRole$: jest
          .fn()
          .mockReturnValueOnce(of(true))
          .mockReturnValueOnce(of(false)),
      }),
    ],
    schemas: [CUSTOM_ELEMENTS_SCHEMA],
  });

  beforeEach(() => {
    spectator = createComponent();
    component = spectator.debugElement.componentInstance;
    editingModalServiceSpy = spectator.inject(EditingModalService);
  });

  test('should create', () => {
    expect(component).toBeTruthy();
  });

  describe('agInit', () => {
    test('should handle input', () => {
      const params = {
        data: QUOTATION_DETAIL_MOCK,
        condition: {
          enabled: true,
          conditionField: ColumnFields.GPC,
        },
        context: { quotation: QUOTATION_MOCK },
      } as any;

      component.handleCellEditing = jest.fn();
      component.handleInvalidStates = jest.fn();
      component.handleQuotationSimulation = jest.fn();

      component.agInit(params);

      expect(component.params).toEqual(params);
      expect(component.handleCellEditing).toHaveBeenCalledWith(params);
      expect(component.handleInvalidStates).toHaveBeenCalledWith(params);
      expect(component.handleQuotationSimulation).toHaveBeenCalledWith(params);
    });
  });

  describe('handleQuotationSimulation', () => {
    let selectorResult: any;

    beforeEach(() => {
      selectorResult = {} as any;
      jest
        .spyOn(activeCaseFeature, 'selectSelectedQuotationDetail')
        .mockReturnValue(selectorResult);
    });

    test('should load simulated quotation if field is PRICE', () => {
      marbles((m) => {
        const params = {
          field: ColumnFields.PRICE,
        } as any;

        component.handleQuotationSimulation(params);

        m.expect(component.simulatedQuotation$).toBeObservable(
          m.cold('a', {
            a: selectorResult,
          })
        );
      });
    });

    test('should load simulated quotation if field is DISCOUNT', () => {
      marbles((m) => {
        const params = {
          field: ColumnFields.DISCOUNT,
        } as any;

        component.handleQuotationSimulation(params);

        m.expect(component.simulatedQuotation$).toBeObservable(
          m.cold('a', {
            a: selectorResult,
          })
        );
      });
    });

    test('should load simulated quotation if field is GPI', () => {
      marbles((m) => {
        const params = {
          field: ColumnFields.GPI,
        } as any;

        component.handleQuotationSimulation(params);

        m.expect(component.simulatedQuotation$).toBeObservable(
          m.cold('a', {
            a: selectorResult,
          })
        );
      });
    });

    test('should load simulated quotation if field is GPM', () => {
      marbles((m) => {
        const params = {
          field: ColumnFields.GPM,
        } as any;

        component.handleQuotationSimulation(params);

        m.expect(component.simulatedQuotation$).toBeObservable(
          m.cold('a', {
            a: selectorResult,
          })
        );
      });
    });

    test('should load simulated quotation if field is PRICE_DIFF', () => {
      marbles((m) => {
        const params = {
          field: ColumnFields.PRICE_DIFF,
        } as any;

        component.handleQuotationSimulation(params);

        m.expect(component.simulatedQuotation$).toBeObservable(
          m.cold('a', {
            a: selectorResult,
          })
        );
      });
    });

    test('should load simulated quotation if field is RLM', () => {
      marbles((m) => {
        const params = {
          field: ColumnFields.RLM,
        } as any;

        component.handleQuotationSimulation(params);

        m.expect(component.simulatedQuotation$).toBeObservable(
          m.cold('a', {
            a: selectorResult,
          })
        );
      });
    });

    test('should load simulated quotation if field is NET_VALUE', () => {
      marbles((m) => {
        const params = {
          field: ColumnFields.GPI,
        } as any;

        component.handleQuotationSimulation(params);

        m.expect(component.simulatedQuotation$).toBeObservable(
          m.cold('a', {
            a: selectorResult,
          })
        );
      });
    });

    test('should load simulated quotation if field is PRICE_SOURCE', () => {
      marbles((m) => {
        const params = {
          field: ColumnFields.PRICE_SOURCE,
        } as any;

        component.handleQuotationSimulation(params);

        m.expect(component.simulatedQuotation$).toBeObservable(
          m.cold('a', {
            a: selectorResult,
          })
        );
      });
    });

    test('should do nothing when field is not qualified for simulation', () => {
      marbles((m) => {
        const params = {
          field: ColumnFields.ORDER_QUANTITY,
        } as any;

        component.handleQuotationSimulation(params);

        m.expect(component.simulatedQuotation$).toBeObservable(m.cold('-'));
      });
    });
  });

  describe('handleCellEditing', () => {
    test('should disable cell editing when condition enabled and field is PRICE_DIFF', () => {
      const params = {
        data: QUOTATION_DETAIL_MOCK,
        condition: {
          enabled: true,
          conditionField: ColumnFields.GPC,
        },
        field: ColumnFields.PRICE_DIFF,
      } as any;

      component.handleCellEditing(params);

      expect(component.isCellEditingAllowed).toBeFalsy();
    });

    test('should disable cell editing when condition enabled and field is RLM', () => {
      const params = {
        data: QUOTATION_DETAIL_MOCK,
        condition: {
          enabled: true,
          conditionField: ColumnFields.GPC,
        },
        field: ColumnFields.RLM,
      } as any;

      component.handleCellEditing(params);

      expect(component.isCellEditingAllowed).toBeFalsy();
    });
    test('should disable cell editing when condition enabled and field is NET_VALUE', () => {
      const params = {
        data: QUOTATION_DETAIL_MOCK,
        condition: {
          enabled: true,
          conditionField: ColumnFields.GPC,
        },
        field: ColumnFields.NET_VALUE,
      } as any;

      component.handleCellEditing(params);

      expect(component.isCellEditingAllowed).toBeFalsy();
    });
    test('should disable cell editing when condition enabled and field is PRICE_SOURCE', () => {
      const params = {
        data: QUOTATION_DETAIL_MOCK,
        condition: {
          enabled: true,
          conditionField: ColumnFields.GPC,
        },
        field: ColumnFields.PRICE_SOURCE,
      } as any;

      component.handleCellEditing(params);

      expect(component.isCellEditingAllowed).toBeFalsy();
    });

    test('should disable cell editing when condition field is not in data', () => {
      const params = {
        data: QUOTATION_DETAIL_MOCK,
        condition: {
          enabled: true,
          conditionField: 'nonexisting',
        },
        field: ColumnFields.PRICE_SOURCE,
      } as any;

      component.handleCellEditing(params);

      expect(component.isCellEditingAllowed).toBeFalsy();
    });

    test('should allow cell editing when condition is disabled and field is not affected', () => {
      const params = {
        data: QUOTATION_DETAIL_MOCK,
        condition: {
          enabled: false,
          conditionField: 'nonexisting',
        },
        field: ColumnFields.ORDER_QUANTITY,
      } as any;

      component.handleCellEditing(params);

      expect(component.isCellEditingAllowed).toBeTruthy();
    });

    test('should allow cell editing when condition field is available and field is not affected', () => {
      const params = {
        data: QUOTATION_DETAIL_MOCK,
        condition: {
          enabled: true,
          conditionField: ColumnFields.GPC,
        },
        field: ColumnFields.ORDER_QUANTITY,
      } as any;

      component.handleCellEditing(params);

      expect(component.isCellEditingAllowed).toBeTruthy();
    });

    test('should allow cell editing if user has the needed role', () => {
      const params = {
        data: QUOTATION_DETAIL_MOCK,
        field: ColumnFields.PRICE,
        condition: {
          enabled: false,
        },
        role: UserRoles.BASIC,
      } as any;

      component.handleCellEditing(params);

      expect(component.isCellEditingAllowed).toBeTruthy();
    });

    test('should not allow cell editing if user does not have the needed role', () => {
      const params = {
        data: QUOTATION_DETAIL_MOCK,
        field: ColumnFields.PRICE,
        condition: {
          enabled: false,
        },
        role: UserRoles.MANUAL_PRICE,
      } as any;

      component.handleCellEditing(params);

      expect(component.isCellEditingAllowed).toBeFalsy();
    });
  });

  describe('handleInvalidStates', () => {
    test('should check price validity if field is price', () => {
      component.checkPriceValidity = jest.fn();

      const params = {
        field: ColumnFields.PRICE,
        value: 10,
        data: { msp: 10, gpi: 10, gpm: 10 },
      } as any;

      component.handleInvalidStates(params);

      expect(component.checkPriceValidity).toHaveBeenCalledWith(
        params.value,
        params.data.msp,
        params.data.gpi,
        params.data.gpm
      );
    });
    test('should check quantity validity if field is order quantity', () => {
      component.checkQuantityValidity = jest.fn();

      const params = {
        field: ColumnFields.ORDER_QUANTITY,
        value: 10,
        data: { deliveryUnit: 5 },
      } as any;

      component.handleInvalidStates(params);

      expect(component.checkQuantityValidity).toHaveBeenCalledWith(
        params.value,
        params.data.deliveryUnit
      );
    });

    test('should do nothing if field needs no validation', () => {
      component.checkPriceValidity = jest.fn();
      component.checkQuantityValidity = jest.fn();

      const params = {
        field: ColumnFields.DISCOUNT,
        value: 10,
        data: { msp: 10, gpi: 10, gpm: 10 },
      } as any;

      component.handleInvalidStates(params);

      expect(component.checkPriceValidity).not.toHaveBeenCalled();
      expect(component.checkQuantityValidity).not.toHaveBeenCalled();
    });
  });

  describe('checkPriceValidity', () => {
    test('should set invalid price if price < msp', () => {
      component.checkPriceValidity(10, 20, 5, 5);

      expect(component.warningTooltip).toEqual('priceLowerThanMsp');
      expect(component.isInvalidPriceError).toBeTruthy();
      expect(component.isWarningEnabled).toBeTruthy();
    });

    test('should set invalid price if gpi < threshold', () => {
      component.checkPriceValidity(30, 20, 5, 50);

      expect(component.warningTooltip).toEqual('gpmOrGpiTooLow');
      expect(component.isInvalidPriceError).toBeFalsy();
      expect(component.isWarningEnabled).toBeTruthy();
    });

    test('should set invalid price if gpm < threshold', () => {
      component.checkPriceValidity(30, 20, 50, 6);

      expect(component.warningTooltip).toEqual('gpmOrGpiTooLow');
      expect(component.isInvalidPriceError).toBeFalsy();
      expect(component.isWarningEnabled).toBeTruthy();
    });

    test('should do nothing if valid', () => {
      component.checkPriceValidity(30, 20, 50, 50);

      expect(component.warningTooltip).toEqual('');
      expect(component.isInvalidPriceError).toBeFalsy();
      expect(component.isWarningEnabled).toBeFalsy();
    });
  });

  describe('checkQuantityValidity', () => {
    test('should set invalid order quantity if quantity not multiple of delivery unit', () => {
      component.checkQuantityValidity(5, 10);

      expect(component.warningTooltip).toEqual('orderQuantityMustBeMultipleOf');
      expect(component.isWarningEnabled).toBeTruthy();
    });
    test('should do nothing if quantity is valid', () => {
      component.checkQuantityValidity(20, 10);

      expect(component.warningTooltip).toEqual('');
      expect(component.isWarningEnabled).toBeFalsy();
    });

    test('should accept every quantity if delivery unit is not set', () => {
      component.checkQuantityValidity(99, undefined as any);

      expect(component.warningTooltip).toEqual('');
      expect(component.isWarningEnabled).toBeFalsy();
    });
  });

  describe('onIconClick', () => {
    test('should open dialog', () => {
      component.params = {
        data: QUOTATION_DETAIL_MOCK,
        condition: {},
        field: ColumnFields.GPM,
      } as any;
      component.onIconClick();

      expect(editingModalServiceSpy.openEditingModal).toHaveBeenCalledWith({
        quotationDetail: QUOTATION_DETAIL_MOCK,
        field: ColumnFields.GPM,
      });
    });
  });
});
