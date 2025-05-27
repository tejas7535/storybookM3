import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';

import { of, Subject } from 'rxjs';

import { TranslocoModule } from '@jsverse/transloco';
import { createComponentFactory, Spectator } from '@ngneat/spectator/jest';
import { LetDirective } from '@ngrx/component';
import { provideMockStore } from '@ngrx/store/testing';
import { GridApi } from 'ag-grid-community';
import { MockDirective, MockProvider } from 'ng-mocks';

import { provideTranslocoTestingModule } from '@schaeffler/transloco/testing';

import { MsdAgGridReadyService } from '@mac/feature/materials-supplier-database/services';
import { DataFacade } from '@mac/feature/materials-supplier-database/store/facades/data';

import { BaseControlPanelComponent } from './base-control-panel.component';

jest.mock('@jsverse/transloco', () => ({
  ...jest.requireActual<TranslocoModule>('@jsverse/transloco'),
  translate: jest.fn((string) => string),
}));

describe('BaseControlPanelComponent', () => {
  let component: BaseControlPanelComponent;
  let spectator: Spectator<BaseControlPanelComponent>;

  const gridApiMock = {
    setFilterModel: jest.fn(),
    onFilterChanged: jest.fn(),
  } as unknown as GridApi;
  const agGridFilterMock = new Subject();

  const createComponent = createComponentFactory({
    component: BaseControlPanelComponent,
    imports: [
      MockDirective(LetDirective),
      provideTranslocoTestingModule({ en: {} }),
    ],
    providers: [
      provideMockStore({}),
      MockProvider(
        DataFacade,
        {
          agGridFilter$: agGridFilterMock,
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
    it('should set agGridApi', () => {
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

  describe('fireReload', () => {
    it('should call refreshServerSide', () => {
      component.reload.emit = jest.fn();
      component.fireReload();
      expect(component.reload.emit).toHaveBeenCalled();
    });
  });

  describe('resetForm', () => {
    it('should complete the observable', () => {
      component.resetForm();

      expect(gridApiMock.setFilterModel).toHaveBeenCalledWith({});
      expect(gridApiMock.onFilterChanged).toHaveBeenCalled();
    });
  });
});
