import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';

import { of, Subject } from 'rxjs';

import { TranslocoModule } from '@jsverse/transloco';
import { createComponentFactory, Spectator } from '@ngneat/spectator/jest';
import { LetDirective, PushPipe } from '@ngrx/component';
import { provideMockStore } from '@ngrx/store/testing';
import { AgGridAngular } from 'ag-grid-angular';
import { GridApi } from 'ag-grid-community';
import { MockComponent, MockDirective, MockPipe, MockProvider } from 'ng-mocks';

import { provideTranslocoTestingModule } from '@schaeffler/transloco/testing';

import {
  MsdAgGridConfigService,
  MsdAgGridReadyService,
  MsdAgGridStateService,
} from '@mac/feature/materials-supplier-database/services';
import { DataFacade } from '@mac/feature/materials-supplier-database/store/facades/data';
import { QuickFilterFacade } from '@mac/feature/materials-supplier-database/store/facades/quickfilter';

import { RawMaterialDatagridComponent } from './raw-material-datagrid.component';

jest.mock('@jsverse/transloco', () => ({
  ...jest.requireActual<TranslocoModule>('@jsverse/transloco'),
  translate: jest.fn((string) => string),
}));

jest.mock('../../util', () => ({
  getStatus: jest.fn(),
}));

describe('RawMaterialDatagridComponent', () => {
  let component: RawMaterialDatagridComponent;
  let spectator: Spectator<RawMaterialDatagridComponent>;

  const createComponent = createComponentFactory({
    component: RawMaterialDatagridComponent,
    imports: [
      MockPipe(PushPipe),
      MockDirective(LetDirective),
      provideTranslocoTestingModule({ en: {} }),
      MockComponent(AgGridAngular),
    ],
    providers: [
      provideMockStore({}),
      {
        provide: MsdAgGridConfigService,
        useValue: {
          columnDefinitions$: new Subject(),
        },
      },
      {
        provide: DataFacade,
        useValue: {
          agGridFilter$: new Subject(),
          hasEditorRole$: of(true),
          result$: new Subject(),
          setAgGridFilter: jest.fn(),
          setAgGridColumns: jest.fn(),
        },
      },
      MockProvider(MsdAgGridStateService),
      MockProvider(MsdAgGridReadyService),
      MockProvider(QuickFilterFacade),
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
    it('should set filter model for non-empty values', () => {
      expect(component.hasEditorRole).toBeTruthy();
    });
  });

  describe('onGridReady', () => {
    it('should listen for filter Change event to delesect', () => {
      // prevent column restoration
      component['restoredColumnState'] = undefined;
      const api = {
        // instantly execute passed function
        addEventListener: jest.fn((_name, fkt) => fkt()),
        deselectAll: jest.fn(),
      } as unknown as GridApi;
      component.onGridReady({ api });

      expect(api.addEventListener).toHaveBeenCalledWith(
        'filterChanged',
        expect.any(Function)
      );
      expect(api.deselectAll).toHaveBeenCalled();
    });
  });

  describe('getCellRendererParams', () => {
    it('should set params for cell renderer', () => {
      expect(component['getCellRendererParams']()).toStrictEqual({
        hasEditorRole: true,
      });
    });
  });
});
