import { CommonModule } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { MatSidenavModule } from '@angular/material/sidenav';

import { AgGridModule } from '@ag-grid-community/angular';
import { createComponentFactory, Spectator } from '@ngneat/spectator/jest';
import { MockStore, provideMockStore } from '@ngrx/store/testing';
import { MockModule } from 'ng-mocks';

import { provideTranslocoTestingModule } from '@schaeffler/transloco';

import { BOM_MOCK, DETAIL_STATE_MOCK } from '@cdba/testing/mocks';

import { selectBomItem } from '../../core/store';
import { CustomLoadingOverlayComponent } from '../../shared/table/custom-overlay/custom-loading-overlay/custom-loading-overlay.component';
import { CustomOverlayModule } from '../../shared/table/custom-overlay/custom-overlay.module';
import { AdditionalInformationModule } from './additional-information/additional-information.module';
import { BomTabComponent } from './bom-tab.component';
import { BomTableModule } from './bom-table/bom-table.module';

describe('BomTabComponent', () => {
  let spectator: Spectator<BomTabComponent>;
  let component: BomTabComponent;
  let store: MockStore;

  const createComponent = createComponentFactory({
    component: BomTabComponent,
    imports: [
      CommonModule,
      MatCardModule,
      MatIconModule,
      AgGridModule.withComponents([CustomLoadingOverlayComponent]),
      provideTranslocoTestingModule({}),
      CustomOverlayModule,
      MatSidenavModule,
      MockModule(BomTableModule),
      MockModule(AdditionalInformationModule),
    ],
    providers: [
      provideMockStore({
        initialState: { detail: DETAIL_STATE_MOCK },
      }),
    ],
    disableAnimations: true,
  });

  beforeEach(() => {
    spectator = createComponent();
    component = spectator.component;
    spectator.detectChanges();

    store = spectator.inject(MockStore);
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  describe('ngOnInit', () => {
    it('should set observable', () => {
      // tslint:disable-next-line: no-lifecycle-call
      component.ngOnInit();

      expect(component.bomItems$).toBeDefined();
      expect(component.bomLoading$).toBeDefined();
      expect(component.bomErrorMessage$).toBeDefined();
    });
  });

  describe('selectBomItem', () => {
    it('should dispatch selectBomItem Action', () => {
      store.dispatch = jest.fn();
      const item = BOM_MOCK[0];

      component.selectBomItem(item);

      expect(store.dispatch).toHaveBeenCalledWith(selectBomItem({ item }));
    });
  });
});
