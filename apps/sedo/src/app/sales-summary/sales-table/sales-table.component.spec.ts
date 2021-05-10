import { CommonModule } from '@angular/common';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { ReactiveFormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatNativeDateModule } from '@angular/material/core';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatListModule } from '@angular/material/list';
import { BrowserDynamicTestingModule } from '@angular/platform-browser-dynamic/testing';
import { ActivatedRoute } from '@angular/router';

import { AgGridModule } from '@ag-grid-community/angular';
import {
  ClientSideRowModelModule,
  ColumnsToolPanelModule,
  FiltersToolPanelModule,
  GridApi,
  IStatusPanelParams,
  MasterDetailModule,
  MultiFilterModule,
  RowClickedEvent,
  SetFilterModule,
  SideBarModule,
} from '@ag-grid-enterprise/all-modules';
import { createComponentFactory, Spectator } from '@ngneat/spectator/jest';

import { salesSummaryMock } from '../../../testing/mocks/sales-summary.mock';
import { DataService } from '../../shared/data.service';
import { SalesTableComponent } from './sales-table.component';

describe('SalesTableComponent', () => {
  let component: SalesTableComponent;
  let spectator: Spectator<SalesTableComponent>;
  let dataService: DataService;
  let activatedRoute: ActivatedRoute;

  const createComponent = createComponentFactory({
    component: SalesTableComponent,
    imports: [
      CommonModule,
      HttpClientTestingModule,
      MatFormFieldModule,
      MatInputModule,
      ReactiveFormsModule,
      MatListModule,
      MatDatepickerModule,
      MatNativeDateModule,
      MatButtonModule,
      BrowserDynamicTestingModule,
      AgGridModule.withComponents([
        ClientSideRowModelModule,
        ColumnsToolPanelModule,
        FiltersToolPanelModule,
        MasterDetailModule,
        MultiFilterModule,
        SetFilterModule,
        SideBarModule,
      ]),
    ],
    declarations: [SalesTableComponent],
    providers: [
      DataService,
      {
        provide: ActivatedRoute,
        useValue: {
          snapshot: {
            queryParams: {},
          },
        },
      },
    ],
  });

  beforeEach(() => {
    spectator = createComponent();
    component = spectator.debugElement.componentInstance;
    dataService = spectator.inject(DataService);
    activatedRoute = spectator.inject(ActivatedRoute);
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  describe('ngOnInit', () => {
    it('should load the data', async () => {
      dataService.getAllSales = jest.fn().mockResolvedValue([salesSummaryMock]);

      // eslint-disable-next-line @angular-eslint/no-lifecycle-call
      await component.ngOnInit();

      expect(dataService.getAllSales).toHaveBeenCalledTimes(1);
      expect(component.rowData).toEqual([salesSummaryMock]);
    });
  });

  describe('onFirstDataRendered', () => {
    it('should set combinedKey filter from queryparams when defined', () => {
      const combinedKey = 'abc key';
      activatedRoute.snapshot.queryParams = { combinedKey };

      const fakeApi = new GridApi();

      const fakeFilterModel = {
        setModel: jest.fn(),
      };

      fakeApi.getFilterInstance = jest.fn().mockReturnValue(fakeFilterModel);
      const fakeNode = {
        setExpanded: jest.fn(),
      };
      fakeApi.getDisplayedRowAtIndex = jest.fn().mockReturnValue(fakeNode);
      fakeApi.onFilterChanged = jest.fn();

      const fakeEvent: IStatusPanelParams = {
        api: fakeApi,
        columnApi: undefined,
        context: undefined,
      };

      component.onFirstDataRendered(fakeEvent);

      expect(fakeEvent.api.getFilterInstance).toHaveBeenCalledTimes(1);
      expect(fakeEvent.api.getFilterInstance).toHaveBeenCalledWith(
        'combinedKey'
      );

      expect(fakeFilterModel.setModel).toHaveBeenCalledTimes(1);
      expect(fakeFilterModel.setModel).toHaveBeenCalledWith({
        values: [combinedKey],
      });

      expect(fakeNode.setExpanded).toHaveBeenCalledTimes(1);
      expect(fakeNode.setExpanded).toHaveBeenCalledWith(true);

      expect(fakeEvent.api.getDisplayedRowAtIndex).toHaveBeenCalledTimes(1);
      expect(fakeEvent.api.getDisplayedRowAtIndex).toHaveBeenCalledWith(0);

      expect(fakeApi.onFilterChanged).toHaveBeenCalledTimes(1);
    });

    it('should set materialNumber filter from queryparams when defined', () => {
      const materialNumber = '0000-111-222-333';
      activatedRoute.snapshot.queryParams = { materialNumber };

      const fakeApi = new GridApi();

      const fakeFilterModel = {
        setModel: jest.fn(),
      };

      fakeApi.getFilterInstance = jest.fn().mockReturnValue(fakeFilterModel);
      fakeApi.onFilterChanged = jest.fn();

      const fakeEvent: IStatusPanelParams = {
        api: fakeApi,
        columnApi: undefined,
        context: undefined,
      };

      component.onFirstDataRendered(fakeEvent);

      expect(fakeEvent.api.getFilterInstance).toHaveBeenCalledTimes(1);
      expect(fakeEvent.api.getFilterInstance).toHaveBeenCalledWith(
        'socoArticleNumberGlobalKey'
      );

      expect(fakeFilterModel.setModel).toHaveBeenCalledTimes(1);
      expect(fakeFilterModel.setModel).toHaveBeenCalledWith({
        values: [materialNumber],
      });

      expect(fakeApi.onFilterChanged).toHaveBeenCalledTimes(1);
    });

    it('should not set filter if no queryParams', () => {
      activatedRoute.snapshot.queryParams = {};
      const fakeApi = new GridApi();

      const fakeFilterModel = {
        setModel: jest.fn(),
      };

      fakeApi.getFilterInstance = jest.fn().mockReturnValue(fakeFilterModel);

      const fakeEvent: IStatusPanelParams = {
        api: fakeApi,
        columnApi: undefined,
        context: undefined,
      };

      component.onFirstDataRendered(fakeEvent);

      expect(fakeEvent.api.getFilterInstance).toHaveBeenCalledTimes(0);

      expect(fakeFilterModel.setModel).toHaveBeenCalledTimes(0);
    });
  });

  describe('onRowClicked', () => {
    it('should set node expanded to true', () => {
      const fakeEvent = ({
        node: {
          setExpanded: jest.fn(),
          expanded: false,
        },
      } as unknown) as RowClickedEvent;

      component.onRowClicked(fakeEvent);
      expect(fakeEvent.node.setExpanded).toHaveBeenCalledTimes(1);
      expect(fakeEvent.node.setExpanded).toHaveBeenCalledWith(true);
    });

    it('should set node expanded to false', () => {
      const fakeEvent = ({
        node: {
          setExpanded: jest.fn(),
          expanded: true,
        },
      } as unknown) as RowClickedEvent;

      component.onRowClicked(fakeEvent);
      expect(fakeEvent.node.setExpanded).toHaveBeenCalledTimes(1);
      expect(fakeEvent.node.setExpanded).toHaveBeenCalledWith(false);
    });
  });
});
