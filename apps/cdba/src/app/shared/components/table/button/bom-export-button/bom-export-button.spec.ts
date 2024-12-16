import { MatButtonModule } from '@angular/material/button';
import { MatTooltipModule } from '@angular/material/tooltip';

import { Subscription } from 'rxjs';

import { createComponentFactory, Spectator } from '@ngneat/spectator/jest';
import { PushPipe } from '@ngrx/component';
import { MockStore, provideMockStore } from '@ngrx/store/testing';
import { MockModule, MockPipe } from 'ng-mocks';

import { provideTranslocoTestingModule } from '@schaeffler/transloco/testing';

import {
  getBomExportFeature,
  getSelectedRefTypeNodeIds,
  isBomExportFeatureRunning,
} from '@cdba/core/store';
import { SearchState } from '@cdba/core/store/reducers/search/search.reducer';
import { BomExportFeature } from '@cdba/core/store/reducers/user-interaction/user-interaction.reducer';
import { BomExportStatus } from '@cdba/user-interaction/model/feature/bom-export/bom-export-status.model';
import { BomExportProgress } from '@cdba/user-interaction/model/feature/bom-export/bom-export-status-enum.model';

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
          },
        } as unknown as SearchState,
        selectors: [
          {
            selector: getBomExportFeature,
            value: {
              loading: false,
              errorMessage: '',
              status: {
                requestedBy: '',
                downloadUrl: '',
                downloadUrlExpiry: undefined,
                progress: BomExportProgress.FINISHED,
                started: '',
                stopped: '',
              } as BomExportStatus,
            } as BomExportFeature,
          },
        ],
      }),
    ],
  });

  beforeEach(() => {
    spectator = createComponent();
    component = spectator.component;
    store = spectator.inject(MockStore);

    component['selectedNodeIdsSubscription'] = {
      unsubscribe: jest.fn(),
    } as unknown as Subscription;
    component['isExportRunningSubscription'] = {
      unsubscribe: jest.fn(),
    } as unknown as Subscription;
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  describe('ngOnInit', () => {
    it('should setup component when waiting', () => {
      component.ngOnInit();

      expect(component.selectedNodeIds).toEqual(['1', '2']);
      expect(component.tooltip).toEqual('search.bomExport.tooltips.default');
    });

    it('should setup component when running', () => {
      store.overrideSelector(isBomExportFeatureRunning, true);

      component.ngOnInit();

      expect(component.selectedNodeIds).toEqual(['1', '2']);
      expect(component.tooltip).toEqual('search.bomExport.tooltips.running');
    });
  });

  describe('ngOnDestroy', () => {
    it('should unsubscribe from subscriptions', () => {
      component.ngOnDestroy();

      expect(
        component['selectedNodeIdsSubscription'].unsubscribe
      ).toHaveBeenCalled();
      expect(
        component['isExportRunningSubscription'].unsubscribe
      ).toHaveBeenCalled();
    });
  });

  describe('onRequestBomExport', () => {
    it('should emit selectedNodeIds', () => {
      const emitSpy = jest.spyOn(component.bomExportEvent, 'emit');

      component.onRequestBomExport();

      expect(emitSpy).toHaveBeenCalledWith([]);
    });
  });

  describe('isDisabled', () => {
    it('should disable the button when less than minimum ref types are selected', () => {
      store.overrideSelector(getSelectedRefTypeNodeIds, []);

      component.ngOnInit();

      expect(component.isDisabled()).toEqual(true);
    });
    it('should disable the button when more than maximum ref types are selected', () => {
      const values = [];
      for (let i = 0; i < 31; i += 1) {
        values.push(i.toString());
      }
      store.overrideSelector(getSelectedRefTypeNodeIds, values);

      expect(component.isDisabled()).toEqual(true);
    });
  });
});
