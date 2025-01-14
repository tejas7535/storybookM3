import { DatePipe } from '@angular/common';
import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';

import { of, Subject } from 'rxjs';

import { TranslocoModule } from '@jsverse/transloco';
import { createComponentFactory, Spectator } from '@ngneat/spectator/jest';
import { LetDirective, PushPipe } from '@ngrx/component';
import { provideMockStore } from '@ngrx/store/testing';
import { ColumnApi, GridApi } from 'ag-grid-community';
import { MockDirective, MockPipe, MockProvider } from 'ng-mocks';

import { ApplicationInsightsService } from '@schaeffler/application-insights';
import { provideTranslocoTestingModule } from '@schaeffler/transloco/testing';

import {
  MaterialClass,
  NavigationLevel,
} from '@mac/feature/materials-supplier-database/constants';
import {
  MsdAgGridReadyService,
  MsdDialogService,
} from '@mac/feature/materials-supplier-database/services';
import { DataFacade } from '@mac/feature/materials-supplier-database/store/facades/data';

import { VitescoMaterialControlPanelComponent } from './vitesco-material-control-panel.component';

jest.mock('@jsverse/transloco', () => ({
  ...jest.requireActual<TranslocoModule>('@jsverse/transloco'),
  translate: jest.fn((string) => string),
}));

jest.mock('../../util', () => ({
  getStatus: jest.fn(),
}));

describe('VitescoMaterialControlPanelComponent', () => {
  let component: VitescoMaterialControlPanelComponent;
  let spectator: Spectator<VitescoMaterialControlPanelComponent>;
  const gridApiMock = {
    refreshServerSide: jest.fn(),
  } as unknown as GridApi;
  const columnApiMock = {} as unknown as ColumnApi;
  const navigationMock = new Subject();

  const createComponent = createComponentFactory({
    component: VitescoMaterialControlPanelComponent,
    imports: [
      MockPipe(PushPipe),
      MockDirective(LetDirective),
      provideTranslocoTestingModule({ en: {} }),
    ],
    providers: [
      provideMockStore({}),
      MockProvider(
        DataFacade,
        {
          agGridFilter$: of(),
          navigation$: navigationMock,
          hasEditorRole$: of(true),
          isBulkEditAllowed$: of(true),
          hasMinimizedDialog$: of(true),
          resultCount$: of(true),
        },
        'useValue'
      ),
      MockProvider(
        MsdAgGridReadyService,
        {
          agGridApi$: of({ gridApi: gridApiMock, columnApi: columnApiMock }),
        },
        'useValue'
      ),
      MockProvider(DatePipe),
      MockProvider(
        ApplicationInsightsService,
        {
          logEvent: jest.fn(),
        },
        'useValue'
      ),
      MockProvider(MsdDialogService),
    ],
    schemas: [CUSTOM_ELEMENTS_SCHEMA],
  });

  beforeEach(() => {
    spectator = createComponent();
    component = spectator.debugElement.componentInstance;
    navigationMock.next({
      materialClass: MaterialClass.STEEL,
      navigationLevel: NavigationLevel.MATERIAL,
    });
  });

  it('should create', () => {
    expect(component).toBeTruthy();
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
