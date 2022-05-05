import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';

import { createComponentFactory, Spectator } from '@ngneat/spectator';
import { provideMockStore } from '@ngrx/store/testing';

import { ApplicationInsightsService } from '@schaeffler/application-insights';

import { PROCESS_CASE_STATE_MOCK } from '../../../../../testing/mocks';
import { EVENT_NAMES } from '../../../models';
import { PriceSource, QuotationDetail } from '../../../models/quotation-detail';
import { HelperService } from '../../../services/helper-service/helper-service.service';
import { ColumnFields } from '../../constants/column-fields.enum';
import { EditableColumnHeaderComponent } from './editable-column-header.component';
import { PriceSourceOptions } from './models/price-source-options.enum';

describe('EditableColumnHeaderComponent', () => {
  let component: EditableColumnHeaderComponent;
  let spectator: Spectator<EditableColumnHeaderComponent>;
  let applicationInsightsService: ApplicationInsightsService;

  const DEFAULT_PARAMS = {
    template: '',
    displayName: 'Test',
    enableMenu: true,
    enableSorting: true,
    context: { onMultipleMaterialSimulation: jest.fn() },
    column: {
      addEventListener: jest.fn(),
      isSortAscending: jest.fn(),
      isSortDescending: jest.fn(),
      getId: jest.fn().mockReturnValue('price'),
    } as any,
    api: {
      addEventListener: jest.fn(),
      getSelectedRows: jest.fn().mockReturnValue([]),
    } as any,
    columnApi: {} as any,
    eGridHeader: {} as any,
    showColumnMenu: jest.fn(),
    setSort: jest.fn(),
    progressSort: jest.fn(),
  };

  const createComponent = createComponentFactory({
    component: EditableColumnHeaderComponent,
    imports: [MatIconModule, MatInputModule, ReactiveFormsModule, FormsModule],
    providers: [
      provideMockStore({
        initialState: {
          processCase: PROCESS_CASE_STATE_MOCK,
        },
      }),
      {
        provide: ApplicationInsightsService,
        useValue: {
          logEvent: jest.fn(),
        },
      },
    ],
    detectChanges: false,
  });

  beforeEach(() => {
    spectator = createComponent();
    component = spectator.debugElement.componentInstance;
    component.params = DEFAULT_PARAMS;
    applicationInsightsService = spectator.inject(ApplicationInsightsService);
  });

  it('should create', () => {
    spectator.detectChanges();
    expect(component).toBeTruthy();
  });

  describe('ngOnInit', () => {
    test('should call addSubscriptions', () => {
      component.addSubscriptions = jest.fn();

      component.ngOnInit();

      expect(component.addSubscriptions).toHaveBeenCalledTimes(1);
    });
    // TODO: Add Unit Test for addSubscription
  });
  describe('ngOnDestroy', () => {
    test('should unsubscribe subscriptions', () => {
      component['subscription'].unsubscribe = jest.fn();

      component.ngOnDestroy();

      expect(component['subscription'].unsubscribe).toHaveBeenCalledTimes(1);
    });
  });

  describe('addSubscriptions', () => {
    test('should add subscriptions', () => {
      component['subscription'].add = jest.fn();

      component.addSubscriptions();

      expect(component['subscription'].add).toHaveBeenCalledTimes(2);
    });
  });

  describe('onSortChanged', () => {
    it('should set the sort to asc from the params', () => {
      component.params = {
        ...DEFAULT_PARAMS,
        column: {
          isSortAscending: jest.fn().mockReturnValue(true),
          isSortDescending: jest.fn().mockReturnValue(false),
        } as any,
      };

      spectator.detectChanges();
      expect(component.sort).toEqual(undefined);

      component.onSortChanged();
      expect(component.sort).toEqual('asc');
    });

    it('should set the sort to desc from the params', () => {
      component.params = {
        ...DEFAULT_PARAMS,
        column: {
          isSortAscending: jest.fn().mockReturnValue(false),
          isSortDescending: jest.fn().mockReturnValue(true),
        } as any,
      };

      spectator.detectChanges();
      expect(component.sort).toEqual(undefined);

      component.onSortChanged();
      expect(component.sort).toEqual('desc');
    });

    it('should set the sort to none from the params', () => {
      component.params = {
        ...DEFAULT_PARAMS,
        column: {
          isSortAscending: jest.fn().mockReturnValue(false),
          isSortDescending: jest.fn().mockReturnValue(false),
        } as any,
      };

      spectator.detectChanges();
      expect(component.sort).toEqual(undefined);

      component.onSortChanged();
      expect(component.sort).toEqual(undefined);
    });
  });

  describe('onMenuClicked', () => {
    it('should call the showColumnMenu function', () => {
      component.menuButton = { nativeElement: {} } as any;
      component.onMenuClicked({
        stopPropagation: jest.fn(),
        preventDefault: jest.fn(),
      } as any);

      expect(component.params.showColumnMenu).toHaveBeenCalledWith(
        component.menuButton.nativeElement
      );
    });
  });

  describe('onSortRequested', () => {
    it('should call setSort with undefined if it was desc', () => {
      component.sort = 'desc';
      spectator.detectChanges();

      component.onSortRequested({ shiftKey: false } as MouseEvent);

      expect(component.params.setSort).toHaveBeenCalledWith(undefined, false);
    });

    it('should call setSort with asc if it was none', () => {
      component.sort = undefined;
      spectator.detectChanges();

      component.onSortRequested({ shiftKey: false } as MouseEvent);

      expect(component.params.setSort).toHaveBeenCalledWith('asc', false);
    });

    it('should call setSort with desc if it was asc', () => {
      component.sort = 'asc';
      spectator.detectChanges();

      component.onSortRequested({ shiftKey: false } as MouseEvent);

      expect(component.params.setSort).toHaveBeenCalledWith('desc', false);
    });
  });

  describe('enableEditMode', () => {
    beforeEach(() => {
      component.switchPriceSource = jest.fn();
    });
    it('should enable edit Mode', () => {
      component.enableEditMode({
        stopPropagation: jest.fn(),
        preventDefault: jest.fn(),
      } as any);

      expect(component.editMode).toBe(true);
      expect(component.switchPriceSource).toHaveBeenCalledTimes(0);
    });
    it('should enable edit Mode for priceSource', () => {
      component.agInit({
        ...DEFAULT_PARAMS,
        column: {
          ...DEFAULT_PARAMS.column,
          getId: () => ColumnFields.PRICE_SOURCE,
        },
      });
      component.enableEditMode({
        stopPropagation: jest.fn(),
        preventDefault: jest.fn(),
      } as any);

      expect(component.editMode).toBe(true);
      expect(component.switchPriceSource).toHaveBeenCalledTimes(1);
    });
  });

  describe('disableEditMode', () => {
    beforeEach(() => {
      spectator.detectChanges();
      component.agInit(DEFAULT_PARAMS);
      component.editMode = true;
    });

    it("should disable editMode if the user didn't enter a value", () => {
      component.editFormControl.setValue(15);
      component.submitValue({ stopPropagation: jest.fn() } as any);

      component.disableEditMode();

      expect(component.editMode).toEqual(true);
    });

    it("should not disable editMode if the user didn't enter any values", () => {
      component.disableEditMode();
      spectator.detectChanges();

      expect(component.editMode).toEqual(false);
    });
  });

  describe('submitValue', () => {
    beforeEach(() => {
      jest.clearAllMocks();
      spectator.detectChanges();
      component.agInit(DEFAULT_PARAMS);
    });

    it('should not submit if the value is bigger then 100', () => {
      component.editFormControl.setValue(101);

      component.submitValue({ stopPropagation: jest.fn() } as any);

      expect(
        component.params.context.onMultipleMaterialSimulation
      ).not.toHaveBeenCalled();
    });

    it('should not submit if the value is bigger less then -100', () => {
      component.editFormControl.setValue(-101);

      component.submitValue({ stopPropagation: jest.fn() } as any);

      expect(
        component.params.context.onMultipleMaterialSimulation
      ).not.toHaveBeenCalled();
    });

    it('should submit if the form is valid', () => {
      component.editFormControl.setValue(25.05);

      component.submitValue({ stopPropagation: jest.fn() } as any);

      expect(component.value).toEqual(25.05);
      expect(
        component.params.context.onMultipleMaterialSimulation
      ).toHaveBeenCalledWith('price', 25.05);
    });

    it('should submit if the form is valid with a negative value', () => {
      component.editFormControl.setValue(-25.05);

      component.submitValue({ stopPropagation: jest.fn() } as any);

      expect(component.value).toEqual(-25.05);
      expect(
        component.params.context.onMultipleMaterialSimulation
      ).toHaveBeenCalledWith('price', -25.05);
    });
  });

  describe('validate input', () => {
    beforeEach(() => {
      spectator.detectChanges();
      component.agInit(DEFAULT_PARAMS);
    });

    it('should validate number input onKeyPress', () => {
      HelperService.validateNumberInputKeyPress = jest.fn();

      component.onKeyPress({ preventDefault: jest.fn() } as any);
      expect(HelperService.validateNumberInputKeyPress).toHaveBeenCalledTimes(
        1
      );
    });

    it('should validate number input onPaste', () => {
      component.editFormControl = {} as any;

      HelperService.validateNumberInputPaste = jest.fn();

      component.onPaste({} as any);
      expect(HelperService.validateNumberInputPaste).toHaveBeenCalledTimes(1);
      expect(HelperService.validateNumberInputPaste).toHaveBeenCalledWith(
        {},
        {},
        true
      );
    });
  });

  describe('Enable edit icon', () => {
    it('should not show the edit icon by default', () => {
      spectator.detectChanges();
      component.params.column.getId = jest.fn().mockReturnValue('price');

      expect(component.showEditIcon).toBe(false);
    });

    it('should show the edit icon after row selection', () => {
      spectator.detectChanges();
      component.params.api.getSelectedRows = jest
        .fn()
        .mockReturnValue([{ price: 10 } as QuotationDetail]);

      component.updateShowEditIcon();

      expect(component.showEditIcon).toBe(true);
    });

    it('should hide the edit icon after all rows are deselected', () => {
      spectator.detectChanges();
      component.params.api.getSelectedRows = jest
        .fn()
        .mockReturnValueOnce([{ price: 10 } as QuotationDetail])
        .mockReturnValueOnce([{ price: 10 } as QuotationDetail]);

      component.updateShowEditIcon();

      expect(component.showEditIcon).toBe(true);

      component.updateShowEditIcon();

      expect(component.showEditIcon).toBe(false);
    });
    describe('priceSource edge cases', () => {
      it('should not show edit icon if only gq price available', () => {
        component.isPriceSource = true;
        spectator.detectChanges();

        component.params.api.getSelectedRows = jest.fn().mockReturnValue([
          {
            price: 10,
            priceSource: PriceSource.GQ,
            recommendedPrice: 1,
          } as QuotationDetail,
        ]);

        component.updateShowEditIcon();
        expect(component.showEditIcon).toBe(false);
      });
      it('should not show edit icon if only strategic price available', () => {
        component.isPriceSource = true;
        spectator.detectChanges();

        component.params.api.getSelectedRows = jest.fn().mockReturnValue([
          {
            price: 10,
            priceSource: PriceSource.STRATEGIC,
            strategicPrice: 1,
          } as QuotationDetail,
        ]);

        component.updateShowEditIcon();
        expect(component.showEditIcon).toBe(false);
      });
      it('should not show edit icon if only sap price available', () => {
        component.isPriceSource = true;
        spectator.detectChanges();

        component.params.api.getSelectedRows = jest.fn().mockReturnValue([
          {
            price: 10,
            priceSource: PriceSource.SAP_STANDARD,
            sapPrice: 1,
          } as QuotationDetail,
        ]);

        component.updateShowEditIcon();
        expect(component.showEditIcon).toBe(false);
      });
    });
  });

  describe('update simulation on value change', () => {
    afterEach(() => {
      jest.clearAllMocks();
    });

    it('should update on value change', () => {
      component.agInit(DEFAULT_PARAMS);
      component.ngOnInit();

      component.editFormControl.setValue(2);

      expect(
        component.params.context.onMultipleMaterialSimulation
      ).toHaveBeenCalledWith('price', 2);
    });

    it('should update for NULL values', () => {
      component.agInit(DEFAULT_PARAMS);
      component.ngOnInit();

      // eslint-disable-next-line unicorn/no-null
      component.editFormControl.setValue(null as unknown as number);

      expect(
        component.params.context.onMultipleMaterialSimulation
      ).toHaveBeenCalledWith('price', 0);
    });

    it('should NOT update for undefined values', () => {
      component.agInit(DEFAULT_PARAMS);
      component.ngOnInit();

      component.editFormControl.setValue(undefined as unknown as number);

      expect(
        component.params.context.onMultipleMaterialSimulation
      ).not.toHaveBeenCalled();
    });
  });
  describe('initalize isPriceSource', () => {
    it('should set isPriceSource to false', () => {
      component.agInit(DEFAULT_PARAMS);

      expect(component.isPriceSource).toBeFalsy();
    });
    it('should set isPriceSource to true', () => {
      component.agInit({
        ...DEFAULT_PARAMS,
        column: {
          ...DEFAULT_PARAMS.column,
          getId: () => ColumnFields.PRICE_SOURCE,
        },
      });

      expect(component.isPriceSource).toBeTruthy();
    });
  });
  describe('switchPriceSource', () => {
    beforeEach(() => {
      component.params = {
        context: {
          onPriceSourceSimulation: jest.fn(),
        },
      } as any;
    });
    test('should set selectedPriceSource to GQ', () => {
      component.selectedPriceSource = undefined as any;
      component.switchPriceSource();

      expect(component.selectedPriceSource).toEqual(PriceSourceOptions.GQ);
      expect(
        component.params.context.onPriceSourceSimulation
      ).toHaveBeenCalledTimes(1);
      expect(
        component.params.context.onPriceSourceSimulation
      ).toHaveBeenCalledWith(PriceSourceOptions.GQ);
    });
    test('should set selectedPriceSource to SAP', () => {
      component.selectedPriceSource = PriceSourceOptions.GQ;

      component.switchPriceSource();

      expect(component.selectedPriceSource).toEqual(PriceSourceOptions.SAP);
      expect(
        component.params.context.onPriceSourceSimulation
      ).toHaveBeenCalledTimes(1);
      expect(
        component.params.context.onPriceSourceSimulation
      ).toHaveBeenCalledWith(PriceSourceOptions.SAP);
    });
  });

  describe('tracking', () => {
    beforeEach(() => {
      component.agInit(DEFAULT_PARAMS);

      component.params = {
        column: {
          getId: jest.fn().mockReturnValue('price'),
        } as any,
        api: {
          getSelectedRows: jest.fn().mockReturnValue([1]),
        } as any,
        context: {
          onMultipleMaterialSimulation: jest.fn(),
        },
      } as any;
    });

    test('should track MASS_SIMULATION_STARTED after edit mode was enabled', () => {
      component.enableEditMode({
        stopPropagation: jest.fn(),
        preventDefault: jest.fn(),
      } as any);

      expect(applicationInsightsService.logEvent).toHaveBeenCalledWith(
        EVENT_NAMES.MASS_SIMULATION_STARTED,
        { type: 'price', numberOfSimulatedRows: 1 }
      );
    });

    test('should track MASS_SIMULATION_UPDATED after a simulation was updated', () => {
      component.editFormControl.setValue(2);
      component.submitValue({ stopPropagation: jest.fn() } as any);

      expect(applicationInsightsService.logEvent).toHaveBeenCalledWith(
        EVENT_NAMES.MASS_SIMULATION_UPDATED,
        { type: 'price', numberOfSimulatedRows: 1, simulatedValue: 2 }
      );
    });
  });
});
