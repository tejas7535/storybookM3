import { DatePipe } from '@angular/common';
import {
  Component,
  CUSTOM_ELEMENTS_SCHEMA,
  OnDestroy,
  OnInit,
} from '@angular/core';

import { of, Subject } from 'rxjs';

import { TranslocoModule } from '@jsverse/transloco';
import { createComponentFactory, Spectator } from '@ngneat/spectator/jest';
import { LetDirective, PushPipe } from '@ngrx/component';
import { provideMockStore } from '@ngrx/store/testing';
import { GridApi } from 'ag-grid-community';
import { MockDirective, MockPipe, MockProvider } from 'ng-mocks';

import { ApplicationInsightsService } from '@schaeffler/application-insights';
import { provideTranslocoTestingModule } from '@schaeffler/transloco/testing';

import {
  MsdAgGridReadyService,
  MsdDialogService,
} from '@mac/feature/materials-supplier-database/services';
import { DataFacade } from '@mac/feature/materials-supplier-database/store/facades/data';

import { BaseControlPanelComponent } from './base-control-panel.component';

jest.mock('@jsverse/transloco', () => ({
  ...jest.requireActual<TranslocoModule>('@jsverse/transloco'),
  translate: jest.fn((string) => string),
}));

// create a minimum class to test the abstract methods
@Component({
  selector: 'mac-cp-xyz',
  standalone: true,
  template: '<p>test</p>',
})
class MockControlPanelComponent
  extends BaseControlPanelComponent
  implements OnInit, OnDestroy
{
  public constructor(
    protected readonly dataFacade: DataFacade,
    protected readonly agGridReadyService: MsdAgGridReadyService,
    protected readonly datePipe: DatePipe,
    protected readonly applicationInsightsService: ApplicationInsightsService,
    protected readonly dialogService: MsdDialogService
  ) {
    super(
      dataFacade,
      agGridReadyService,
      datePipe,
      applicationInsightsService,
      dialogService
    );
  }

  public reload() {}
}

describe('MockControlPanelComponent', () => {
  let component: MockControlPanelComponent;
  let spectator: Spectator<MockControlPanelComponent>;
  const gridApiMock = {
    setFilterModel: jest.fn(),
    onFilterChanged: jest.fn(),
  } as unknown as GridApi;
  const agGridFilterMock = new Subject();

  const createComponent = createComponentFactory({
    component: MockControlPanelComponent,
    imports: [
      MockPipe(PushPipe),
      MockDirective(LetDirective),
      provideTranslocoTestingModule({ en: {} }),
    ],
    providers: [
      provideMockStore({}),
      MockProvider(DataFacade, { agGridFilter$: agGridFilterMock }, 'useValue'),
      MockProvider(
        MsdAgGridReadyService,
        {
          agGridApi$: of({ gridApi: gridApiMock }),
        },
        'useValue'
      ),
      MockProvider(DatePipe),
      MockProvider(ApplicationInsightsService),
      MockProvider(MsdDialogService),
    ],
    schemas: [CUSTOM_ELEMENTS_SCHEMA],
  });

  beforeEach(() => {
    spectator = createComponent();
    component = spectator.debugElement.componentInstance;
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  describe('ngOnInit', () => {
    it('should set agGridApi and agGridColumnApi', () => {
      expect(component['agGridApi']).toBe(gridApiMock);
    });

    it('should set resetFormDisabled', () => {
      expect(component['resetFormDisabled']).toBe(true);
    });

    it('should set resetFormDisabled to false', () => {
      agGridFilterMock.next({ a: 1 });
      expect(component['resetFormDisabled']).toBe(false);
    });
  });

  describe('ngOnDestroy', () => {
    it('should complete the observable', () => {
      component['destroy$'].next = jest.fn();
      component['destroy$'].complete = jest.fn();

      component.ngOnDestroy();

      expect(component['destroy$'].next).toHaveBeenCalled();
      expect(component['destroy$'].complete).toHaveBeenCalled();
    });
  });

  describe('resetForm', () => {
    it('should complete the observable', () => {
      component.resetForm();

      expect(gridApiMock.setFilterModel).toHaveBeenCalledWith({});
      expect(gridApiMock.onFilterChanged).toHaveBeenCalled();
    });
  });

  describe('getVisibleColumns', () => {
    it('should complete the observable', () => {
      gridApiMock.getColumnState = jest.fn(() => [
        { hide: false, colId: 'a' },
        { hide: true, colId: 'b' },
        { hide: false, colId: 'c' },
      ]);
      const expected = ['a', 'c'];
      const result = component['getVisibleColumns']();

      expect(gridApiMock.getColumnState).toHaveBeenCalled();
      expect(result).toStrictEqual(expected);
    });
  });
});
