import { CommonModule } from '@angular/common';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { MatSidenavModule } from '@angular/material/sidenav';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';

import { AgGridModule } from '@ag-grid-community/angular';
import { MockStore, provideMockStore } from '@ngrx/store/testing';
import { configureTestSuite } from 'ng-bullet';

import { provideTranslocoTestingModule } from '@schaeffler/transloco';

import { BOM_MOCK } from '../../../testing/mocks';
import { selectBomItem } from '../../core/store';
import { CustomLoadingOverlayComponent } from '../../shared/table/custom-overlay/custom-loading-overlay/custom-loading-overlay.component';
import { CustomOverlayModule } from '../../shared/table/custom-overlay/custom-overlay.module';
import { AdditionalInformationModule } from './additional-information/additional-information.module';
import { BomTabComponent } from './bom-tab.component';
import { BomTableModule } from './bom-table/bom-table.module';

jest.mock('@ngneat/transloco', () => ({
  ...jest.requireActual('@ngneat/transloco'),
  translate: jest.fn(() => 'translate it'),
}));

describe('BomTabComponent', () => {
  let component: BomTabComponent;
  let fixture: ComponentFixture<BomTabComponent>;
  let store: MockStore;

  configureTestSuite(() => {
    TestBed.configureTestingModule({
      imports: [
        CommonModule,
        NoopAnimationsModule,
        MatCardModule,
        MatIconModule,
        AgGridModule.withComponents([CustomLoadingOverlayComponent]),
        provideTranslocoTestingModule({}),
        CustomOverlayModule,
        BomTableModule,
        MatSidenavModule,
        AdditionalInformationModule,
      ],
      declarations: [BomTabComponent],
      providers: [provideMockStore({})],
    });
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(BomTabComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();

    store = TestBed.inject(MockStore);
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
