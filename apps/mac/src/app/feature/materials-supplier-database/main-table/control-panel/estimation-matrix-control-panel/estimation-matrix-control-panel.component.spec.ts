import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';

import { of } from 'rxjs';

import { TranslocoModule } from '@jsverse/transloco';
import { createComponentFactory, Spectator } from '@ngneat/spectator/jest';
import { LetDirective, PushPipe } from '@ngrx/component';
import { provideMockStore } from '@ngrx/store/testing';
import { GridApi } from 'ag-grid-community';
import { MockComponent, MockDirective, MockPipe, MockProvider } from 'ng-mocks';

import { provideTranslocoTestingModule } from '@schaeffler/transloco/testing';

import { MsdAgGridReadyService } from '@mac/feature/materials-supplier-database/services';
import { DataFacade } from '@mac/feature/materials-supplier-database/store/facades/data';

import { BaseControlPanelComponent } from '../base-control-panel/base-control-panel.component';
import { EstimationMatrixControlPanelComponent } from './estimation-matrix-control-panel.component';

jest.mock('@jsverse/transloco', () => ({
  ...jest.requireActual<TranslocoModule>('@jsverse/transloco'),
  translate: jest.fn((string) => string),
}));

jest.mock('../../util', () => ({
  getStatus: jest.fn(),
}));

describe('EstimationMatrixControlPanelComponent', () => {
  let component: EstimationMatrixControlPanelComponent;
  let spectator: Spectator<EstimationMatrixControlPanelComponent>;

  const gridApiMock = {
    refreshServerSide: jest.fn(),
    addEventListener: jest.fn(),
    removeEventListener: jest.fn(),
    getColumnDef: jest.fn(),
    exportDataAsExcel: jest.fn(),
    setCacheBlockSize: jest.fn(),
  } as unknown as GridApi;

  const createComponent = createComponentFactory({
    component: EstimationMatrixControlPanelComponent,
    imports: [
      MockPipe(PushPipe),
      MockDirective(LetDirective),
      provideTranslocoTestingModule({ en: {} }),
      MockComponent(BaseControlPanelComponent),
    ],
    providers: [
      provideMockStore({}),
      MockProvider(
        DataFacade,
        {
          agGridFilter$: of(),
          estimationMatrixResult$: of([]),
        },
        'useValue'
      ),
      MockProvider(
        MsdAgGridReadyService,
        {
          agGridApi$: of({ gridApi: gridApiMock }),
        },
        'useValue'
      ),
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

  describe('reload', () => {
    it('should call refreshServerSide', () => {
      component.reload();
      expect(gridApiMock.refreshServerSide).toHaveBeenCalled();
    });
  });
});
