import {
  FormsModule,
  ReactiveFormsModule,
  UntypedFormControl,
} from '@angular/forms';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatTooltipModule } from '@angular/material/tooltip';

import { of } from 'rxjs';

import { getIsQuotationStatusActive } from '@gq/core/store/active-case';
import { UserRoles } from '@gq/shared/constants';
import {
  createComponentFactory,
  mockProvider,
  Spectator,
} from '@ngneat/spectator/jest';
import { TranslocoLocaleService } from '@ngneat/transloco-locale';
import { PushModule } from '@ngrx/component';
import { MockStore, provideMockStore } from '@ngrx/store/testing';
import { marbles } from 'rxjs-marbles';

import { ApplicationInsightsService } from '@schaeffler/application-insights';

import {
  ACTIVE_CASE_STATE_MOCK,
  PROCESS_CASE_STATE_MOCK,
} from '../../../../../testing/mocks';
import { InfoIconModule } from '../../../components/info-icon/info-icon.module';
import { SharedDirectivesModule } from '../../../directives/shared-directives.module';
import { EVENT_NAMES } from '../../../models';
import { PriceSource, QuotationDetail } from '../../../models/quotation-detail';
import { ColumnFields } from '../../constants/column-fields.enum';
import { ExtendedColumnHeaderComponent } from './extended-column-header.component';
import { ExtendedColumnHeaderComponentParams } from './models/extended-column-header-component-params.model';
import { PriceSourceOptions } from './models/price-source-options.enum';

describe('ExtendedColumnHeaderComponent', () => {
  let component: ExtendedColumnHeaderComponent;
  let spectator: Spectator<ExtendedColumnHeaderComponent>;
  let applicationInsightsService: ApplicationInsightsService;
  let store: MockStore;

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
      getId: jest.fn().mockReturnValue(ColumnFields.PRICE),
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
    tooltipText: '',
    editableColumn: true,
  } as ExtendedColumnHeaderComponentParams;

  const createComponent = createComponentFactory({
    component: ExtendedColumnHeaderComponent,
    imports: [
      MatIconModule,
      MatInputModule,
      ReactiveFormsModule,
      FormsModule,
      InfoIconModule,
      SharedDirectivesModule,
      MatTooltipModule,
      PushModule,
    ],
    providers: [
      mockProvider(TranslocoLocaleService),
      provideMockStore({
        initialState: {
          processCase: PROCESS_CASE_STATE_MOCK,
          'azure-auth': {
            accountInfo: {
              idTokenClaims: {
                roles: [
                  UserRoles.BASIC,
                  UserRoles.COST_GPC,
                  UserRoles.REGION_WORLD,
                  UserRoles.SECTOR_ALL,
                ],
              },
            },
          },
          activeCase: ACTIVE_CASE_STATE_MOCK,
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
    component.editFormControl = new UntypedFormControl();
    applicationInsightsService = spectator.inject(ApplicationInsightsService);
    store = spectator.inject(MockStore);
  });

  it('should create', () => {
    spectator.detectChanges();
    expect(component).toBeTruthy();
  });

  describe('ngOnInit', () => {
    afterEach(() => {
      jest.clearAllMocks();
    });

    test('should call addSubscriptions', () => {
      component.addSubscriptions = jest.fn();

      component.ngOnInit();

      expect(component.addSubscriptions).toHaveBeenCalledTimes(1);
    });

    test(
      'should get quotation status',
      marbles((m) => {
        store.overrideSelector(getIsQuotationStatusActive, true);
        component.ngOnInit();

        const expected = m.cold('a', {
          a: true,
        });
        m.expect(component.quotationStatus$).toBeObservable(expected);
      })
    );
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
      } as ExtendedColumnHeaderComponentParams);
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
      ).toHaveBeenCalledWith(ColumnFields.PRICE, 101, true);
      expect(component['insightsService'].logEvent).not.toHaveBeenCalled();
    });

    it('should submit with input invalid if value is bigger less then -100', () => {
      component.editFormControl.setValue(-101);

      component.submitValue({ stopPropagation: jest.fn() } as any);

      expect(
        component.params.context.onMultipleMaterialSimulation
      ).toHaveBeenCalledWith(ColumnFields.PRICE, -101, true);
      expect(component['insightsService'].logEvent).not.toHaveBeenCalled();
    });

    it('should submit if the form is valid', () => {
      component.editFormControl.setValue(25.05);

      component.submitValue({ stopPropagation: jest.fn() } as any);

      expect(component.value).toEqual(25.05);
      expect(
        component.params.context.onMultipleMaterialSimulation
      ).toHaveBeenCalledWith('price', 25.05, false);
      expect(component['insightsService'].logEvent).toHaveBeenCalledTimes(1);
    });

    it('should submit if the form is valid with a negative value', () => {
      component.editFormControl.setValue(-25.05);

      component.submitValue({ stopPropagation: jest.fn() } as any);

      expect(component.value).toEqual(-25.05);
      expect(
        component.params.context.onMultipleMaterialSimulation
      ).toHaveBeenCalledWith('price', -25.05, false);
      expect(component['insightsService'].logEvent).toHaveBeenCalledTimes(1);
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

    it('should show the edit icon after row selection if the user has the needed role', () => {
      spectator.detectChanges();
      component.params.api.getSelectedRows = jest
        .fn()
        .mockReturnValue([{ price: 10 } as QuotationDetail]);

      component.agInit({
        ...DEFAULT_PARAMS,
        editingRole: UserRoles.BASIC,
      });

      component.updateShowEditIcon();

      expect(component.showEditIcon).toBe(true);
    });

    it('should not show the edit icon after row selection if the user does not have the needed role', () => {
      spectator.detectChanges();
      component.params.api.getSelectedRows = jest
        .fn()
        .mockReturnValue([{ price: 10 } as QuotationDetail]);

      component.agInit({
        ...DEFAULT_PARAMS,
        editingRole: UserRoles.MANUAL_PRICE,
      });

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
      it('should not show edit icon if only cap_price available', () => {
        component.isPriceSource = true;
        spectator.detectChanges();

        component.params.api.getSelectedRows = jest.fn().mockReturnValue([
          {
            price: 10,
            priceSource: PriceSource.CAP_PRICE,
            sapPrice: 1,
          } as QuotationDetail,
        ]);

        component.updateShowEditIcon();
        expect(component.showEditIcon).toBe(false);
      });
      it('should not show edit icon if only target price available', () => {
        component.isPriceSource = true;
        spectator.detectChanges();

        component.params.api.getSelectedRows = jest.fn().mockReturnValue([
          {
            price: 10,
            priceSource: PriceSource.TARGET_PRICE,
            targetPrice: 125,
          } as QuotationDetail,
        ]);

        component.updateShowEditIcon();
        expect(component.showEditIcon).toBe(false);
      });
      it('should show edit icon if target price is set but no price source is available', () => {
        component.isPriceSource = true;
        spectator.detectChanges();

        component.params.api.getSelectedRows = jest.fn().mockReturnValue([
          {
            priceSource: undefined,
            targetPrice: 10,
          } as QuotationDetail,
        ]);

        component.updateShowEditIcon();
        expect(component.showEditIcon).toBe(true);
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

      component.editFormControl.setValue('2');
      spectator.detectChanges();

      expect(
        component.params.context.onMultipleMaterialSimulation
      ).toHaveBeenCalledWith(ColumnFields.PRICE, 2, false);
    });

    it('should update for NULL values', () => {
      component.agInit(DEFAULT_PARAMS);
      component.ngOnInit();

      // eslint-disable-next-line unicorn/no-null
      component.editFormControl.setValue(null as unknown as number);

      expect(
        component.params.context.onMultipleMaterialSimulation
      ).toHaveBeenCalledWith(ColumnFields.PRICE, 0, false);
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
      } as ExtendedColumnHeaderComponentParams);

      expect(component.isPriceSource).toBeTruthy();
    });
  });

  describe('switchPriceSource', () => {
    beforeEach(() => {
      component.params = {
        ...DEFAULT_PARAMS,
        context: {
          ...DEFAULT_PARAMS.context,
          onPriceSourceSimulation: jest.fn(),
        },
      } as any;
    });

    test('should set selectedPriceSource to GQ', () => {
      component['userHasManualPriceRole$'] = of(true);
      component.params.api.getSelectedRows = jest.fn().mockReturnValue([
        {
          strategicPrice: 50,
        } as QuotationDetail,
      ]);
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
      component['userHasManualPriceRole$'] = of(true);
      component.params.api.getSelectedRows = jest.fn().mockReturnValue([
        {
          sapPrice: 20,
        } as QuotationDetail,
      ]);
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

    test('should set selectedPriceSource to TARGET_PRICE', () => {
      component['userHasManualPriceRole$'] = of(true);
      component.params.api.getSelectedRows = jest.fn().mockReturnValue([
        {
          targetPrice: 20,
        } as QuotationDetail,
      ]);
      component.selectedPriceSource = PriceSourceOptions.SAP;

      component.switchPriceSource();

      expect(component.selectedPriceSource).toEqual(
        PriceSourceOptions.TARGET_PRICE
      );
      expect(
        component.params.context.onPriceSourceSimulation
      ).toHaveBeenCalledTimes(1);
      expect(
        component.params.context.onPriceSourceSimulation
      ).toHaveBeenCalledWith(PriceSourceOptions.TARGET_PRICE);
    });

    test('TARGET_PRICE should not be available as a price source if user does not have the role PRICE.MANUAL', () => {
      component['userHasManualPriceRole$'] = of(false);
      component.params.api.getSelectedRows = jest.fn().mockReturnValue([
        {
          recommendedPrice: 50,
          sapPrice: 90,
          targetPrice: 20,
        } as QuotationDetail,
      ]);

      component.selectedPriceSource = undefined as any;
      component.switchPriceSource();
      expect(component.selectedPriceSource).toEqual(PriceSourceOptions.GQ);
      component.switchPriceSource();
      expect(component.selectedPriceSource).toEqual(PriceSourceOptions.SAP);
      component.switchPriceSource();
      expect(component.selectedPriceSource).toEqual(PriceSourceOptions.GQ);
    });

    test('TARGET_PRICE should not be available as a price source if target price is not set', () => {
      component['userHasManualPriceRole$'] = of(true);
      component.params.api.getSelectedRows = jest.fn().mockReturnValue([
        {
          sapPrice: 1,
          strategicPrice: 20,
          targetPrice: undefined,
        } as QuotationDetail,
      ]);

      component.selectedPriceSource = undefined as any;
      component.switchPriceSource();
      expect(component.selectedPriceSource).toEqual(PriceSourceOptions.GQ);
      component.switchPriceSource();
      expect(component.selectedPriceSource).toEqual(PriceSourceOptions.SAP);
      component.switchPriceSource();
      expect(component.selectedPriceSource).toEqual(PriceSourceOptions.GQ);
    });

    test('GQ should not be available as a price source if recommended price and strategic price are not set', () => {
      component['userHasManualPriceRole$'] = of(true);
      component.params.api.getSelectedRows = jest.fn().mockReturnValue([
        {
          sapPrice: 1,
          recommendedPrice: undefined,
          strategicPrice: undefined,
          targetPrice: 20,
        } as QuotationDetail,
      ]);

      component.selectedPriceSource = undefined as any;
      component.switchPriceSource();
      expect(component.selectedPriceSource).toEqual(PriceSourceOptions.SAP);
      component.switchPriceSource();
      expect(component.selectedPriceSource).toEqual(
        PriceSourceOptions.TARGET_PRICE
      );
      component.switchPriceSource();
      expect(component.selectedPriceSource).toEqual(PriceSourceOptions.SAP);
    });

    test('SAP should not be available as a price source if SAP price is not set', () => {
      component['userHasManualPriceRole$'] = of(true);
      component.params.api.getSelectedRows = jest.fn().mockReturnValue([
        {
          sapPrice: undefined,
          recommendedPrice: 1,
          strategicPrice: 2,
          targetPrice: 20,
        } as QuotationDetail,
      ]);

      component.selectedPriceSource = undefined as any;
      component.switchPriceSource();
      expect(component.selectedPriceSource).toEqual(PriceSourceOptions.GQ);
      component.switchPriceSource();
      expect(component.selectedPriceSource).toEqual(
        PriceSourceOptions.TARGET_PRICE
      );
      component.switchPriceSource();
      expect(component.selectedPriceSource).toEqual(PriceSourceOptions.GQ);
    });
  });

  describe('getSelectedPriceSourceTranslationKey', () => {
    test('should return the correct translation key for GQ', () => {
      component.selectedPriceSource = PriceSourceOptions.GQ;
      expect(component.getSelectedPriceSourceTranslationKey()).toEqual(
        'gqPriceSource'
      );
    });

    test('should return the correct translation key for SAP', () => {
      component.selectedPriceSource = PriceSourceOptions.SAP;
      expect(component.getSelectedPriceSourceTranslationKey()).toEqual(
        'sapPriceSource'
      );
    });

    test('should return the correct translation key for TARGET_PRICE', () => {
      component.selectedPriceSource = PriceSourceOptions.TARGET_PRICE;
      expect(component.getSelectedPriceSourceTranslationKey()).toEqual(
        'targetPriceSource'
      );
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

  describe('tooltip', () => {
    test('should show tooltip if provided', () => {
      component.params = {
        displayName: 'text',
        tooltipText: 'tooltip-text',
      } as ExtendedColumnHeaderComponentParams;
      component.editMode = false;
      component.showEditIcon = false;

      spectator.detectChanges();

      const infoIcon = spectator.query('gq-info-icon');

      expect(infoIcon).toBeTruthy();
      expect(infoIcon.textContent.trim()).toEqual('info_outline');
    });

    test('should NOT show tooltip if not provided', () => {
      component.params = {
        displayName: 'text',
      } as ExtendedColumnHeaderComponentParams;

      spectator.detectChanges();

      const infoIcon = spectator.query('gq-info-icon');

      expect(infoIcon).toBeFalsy();
    });
  });
});
