import { MatButtonModule } from '@angular/material/button';
import { MatTooltipModule } from '@angular/material/tooltip';

import { Subscription } from 'rxjs';

import { createComponentFactory, Spectator } from '@ngneat/spectator/jest';
import { PushPipe } from '@ngrx/component';
import { MockStore, provideMockStore } from '@ngrx/store/testing';
import { GridApi } from 'ag-grid-community';
import { MockModule, MockPipe } from 'ng-mocks';

import { provideTranslocoTestingModule } from '@schaeffler/transloco/testing';

import { exportBoms, getBomExportLoading } from '@cdba/core/store';
import { SearchState } from '@cdba/core/store/reducers/search/search.reducer';
import { ReferenceTypeIdentifier } from '@cdba/shared/models';

import { BomExportButtonComponent } from './bom-export-button.component';

describe('BomExportButtonComponent', () => {
  let spectator: Spectator<BomExportButtonComponent>;
  let component: BomExportButtonComponent;
  let store: MockStore;

  const createComponent = createComponentFactory({
    component: BomExportButtonComponent,
    imports: [
      MockModule(MatButtonModule),
      MockModule(MatTooltipModule),
      MockPipe(PushPipe),
      provideTranslocoTestingModule({ en: {} }),
    ],
    detectChanges: false,
    providers: [
      provideMockStore({
        initialState: {
          search: {
            referenceTypes: {
              selectedNodeIds: ['1', '2'],
            },
            export: {
              loading: false,
            },
          },
        } as unknown as SearchState,
      }),
    ],
  });

  const gridApi = {
    hideOverlay: jest.fn(),
    showLoadingOverlay: jest.fn(),
    getRowNode: jest.fn((nodeId: string) =>
      nodeId === '1'
        ? { data: { materialNumber: '123-456', plant: '123' } }
        : { data: { materialNumber: '456-789', plant: '456' } }
    ),
  } as unknown as GridApi;

  beforeEach(() => {
    spectator = createComponent();
    component = spectator.component;
    store = spectator.inject(MockStore);

    component.gridApi = gridApi;

    spectator.setInput('gridApi', gridApi);
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  describe('ngOnInit', () => {
    it('should setup component when not loading', () => {
      component.ngOnInit();

      expect(component.selectedNodeIds).toEqual(['1', '2']);
      expect(component.tooltip).toEqual('search.bomExport.tooltips.default');
      expect(component.gridApi.hideOverlay).toHaveBeenCalled();
    });

    it('should setup component when loading', () => {
      store.overrideSelector(getBomExportLoading, true);

      component.ngOnInit();

      expect(component.selectedNodeIds).toEqual(['1', '2']);
      expect(component.tooltip).toEqual('search.bomExport.tooltips.default');
      expect(component.gridApi.showLoadingOverlay).toHaveBeenCalled();
    });
  });

  describe('ngOnDestroy', () => {
    it('should unsubscribe from subscriptions', () => {
      component['selectedNodeIdsSubscription'] = {
        unsubscribe: jest.fn(),
      } as unknown as Subscription;
      component['isLoadingSubscription'] = {
        unsubscribe: jest.fn(),
      } as unknown as Subscription;

      component.ngOnDestroy();

      expect(
        component['selectedNodeIdsSubscription'].unsubscribe
      ).toHaveBeenCalled();
      expect(component['isLoadingSubscription'].unsubscribe).toHaveBeenCalled();
    });
  });

  describe('onClick', () => {
    it('should dispatch exportBoms with identifiers', () => {
      const storeSpy = jest.spyOn(component['store'], 'dispatch');

      component.onClick();

      expect(storeSpy).toHaveBeenCalledWith(
        exportBoms({
          identifiers: [
            {
              materialNumber: '123456',
              plant: '123',
            } as ReferenceTypeIdentifier,
            {
              materialNumber: '456789',
              plant: '456',
            } as ReferenceTypeIdentifier,
          ],
        })
      );
    });

    it('should not dispatch exportBoms when there are no identifiers', () => {
      component.gridApi = {
        getRowNode: jest.fn(() => {}),
      } as unknown as GridApi;
      const storeSpy = jest.spyOn(component['store'], 'dispatch');

      component.onClick();

      expect(storeSpy).not.toHaveBeenCalled();
    });
  });
});
