import { CommonModule } from '@angular/common';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { MatSidenavModule } from '@angular/material/sidenav';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';

import { AgGridModule } from '@ag-grid-community/angular';
import { provideMockStore } from '@ngrx/store/testing';
import { configureTestSuite } from 'ng-bullet';

import { provideTranslocoTestingModule } from '@schaeffler/transloco';

import { CustomLoadingOverlayComponent } from '../../shared/table/custom-overlay/custom-loading-overlay/custom-loading-overlay.component';
import { CustomOverlayModule } from '../../shared/table/custom-overlay/custom-overlay.module';
import { AdditionalInformationModule } from './additional-information/additional-information.module';
import { BomTabComponent } from './bom-tab.component';
import { BomTableModule } from './bom-table/bom-table.module';

describe('BomTabComponent', () => {
  let component: BomTabComponent;
  let fixture: ComponentFixture<BomTabComponent>;

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
});
