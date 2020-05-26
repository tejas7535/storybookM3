import { CommonModule } from '@angular/common';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { FlexLayoutModule } from '@angular/flex-layout';
import { ReactiveFormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import {
  MAT_DIALOG_DATA,
  MatDialogModule,
  MatDialogRef,
} from '@angular/material/dialog';
import { MatDividerModule } from '@angular/material/divider';
import { MatExpansionModule } from '@angular/material/expansion';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatMenuModule } from '@angular/material/menu';
import { MatRadioModule } from '@angular/material/radio';
import { MatTabsModule } from '@angular/material/tabs';
import { BrowserDynamicTestingModule } from '@angular/platform-browser-dynamic/testing';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';

import { of } from 'rxjs';

import { Store, StoreModule } from '@ngrx/store';
import { MockStore, provideMockStore } from '@ngrx/store/testing';
import { configureTestSuite } from 'ng-bullet';

import { BannerModule, BannerState } from '@schaeffler/banner';
import { Icon, IconsModule } from '@schaeffler/icons';
import { provideTranslocoTestingModule } from '@schaeffler/transloco';

import * as en from '../../../assets/i18n/en.json';
import * as fromStore from '../../core/store';
import { initialState as initialInputState } from '../../core/store/reducers/input.reducer';
import { initialState as initialPredictionState } from '../../core/store/reducers/prediction.reducer';
import { TooltipModule } from '../../shared/components/tooltip/tooltip.module';
import { CHART_SETTINGS_WOEHLER } from '../../shared/constants';
import { ChartType } from '../../shared/enums';
import { ChartModule } from './chart/chart.module';
import { KpiComponent } from './kpi/kpi.component';
import { PredictionComponent } from './prediction.component';
import { UploadModalComponent } from './upload-modal/upload-modal.component';

describe('PredictionComponent', () => {
  let component: PredictionComponent;
  let fixture: ComponentFixture<PredictionComponent>;
  let store: MockStore<fromStore.LTPState>;

  const initialBannerState: BannerState = {
    text: undefined,
    buttonText: undefined,
    icon: undefined,
    truncateSize: undefined,
    showFullText: false,
    open: false,
  };

  configureTestSuite(() => {
    TestBed.configureTestingModule({
      declarations: [PredictionComponent, KpiComponent, UploadModalComponent],
      imports: [
        CommonModule,
        NoopAnimationsModule,
        BannerModule,
        FlexLayoutModule,
        MatButtonModule,
        MatMenuModule,
        MatTabsModule,
        MatDialogModule,
        provideTranslocoTestingModule({ en }),
        StoreModule.forRoot({}),
        ChartModule,
        MatExpansionModule,
        MatDividerModule,
        TooltipModule,
        MatIconModule,
        IconsModule,
        ReactiveFormsModule,
        MatFormFieldModule,
        MatInputModule,
        MatRadioModule,
      ],
      providers: [
        provideMockStore({
          initialState: {
            prediction: initialPredictionState,
            input: initialInputState,
            banner: initialBannerState,
          },
        }),
        { provide: MatDialogRef, useValue: {} },
        { provide: MAT_DIALOG_DATA, useValue: [] },
      ],
    }).overrideModule(BrowserDynamicTestingModule, {
      set: {
        entryComponents: [UploadModalComponent],
      },
    });
  });

  beforeEach(() => {
    window.matchMedia = jest.fn().mockImplementation((query) => {
      return {
        matches: false,
        media: query,
        onchange: undefined,
        addListener: jest.fn(), // deprecated
        removeListener: jest.fn(), // deprecated
        addEventListener: jest.fn(),
        removeEventListener: jest.fn(),
        dispatchEvent: jest.fn(),
      };
    });
    fixture = TestBed.createComponent(PredictionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();

    store = TestBed.inject(Store) as MockStore<fromStore.LTPState>;
    store.dispatch = jest.fn();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
    expect(component.chartSettings).toEqual(CHART_SETTINGS_WOEHLER);
  });

  describe('#ngOnInit', () => {
    it('should dispatch action postPrediction', () => {
      // tslint:disable-next-line: no-lifecycle-call
      component.ngOnInit();

      expect(store.dispatch).toHaveBeenCalledWith(fromStore.postPrediction());
    });
  });

  describe('#parseLoadFile', () => {
    let file: File;
    beforeEach(() => {
      component.openDialog = jest.fn();
      Object.defineProperty(window, 'matchMedia', {
        value: jest.fn(() => {
          return { matches: true };
        }),
      });
    });

    it('should call openDialog', async () => {
      store.overrideSelector('getBannerOpen', true);
      file = new File(['input1', ',', 'input2'], 'file');

      await component.parseLoadFile(file);

      expect(component.openDialog).toHaveBeenCalledWith([['input1', 'input2']]);
    });

    xit('should print the error to console in error case', async () => {
      file = new File([], 'file');
      jest.spyOn(console, 'error');

      await component.parseLoadFile(file);

      expect(console.error).toHaveBeenCalled();
    });
  });

  it('should call parseLoadFile when handleFileInput is called', () => {
    const blobProps = {
      lastModifiedDate: '',
      name: 'filename',
    };
    const blob = new Blob([JSON.stringify(blobProps, undefined, 2)], {
      type: 'text/csv',
    });
    const mockFile = blob as File;
    const mockFileList = {
      0: mockFile,
      1: mockFile,
      length: 2,
      item: (_index: number) => mockFile,
    };

    spyOn(component, 'parseLoadFile');
    component.handleFileInput(mockFileList);
    expect(component.parseLoadFile).toHaveBeenCalledWith(mockFile);
  });

  it('should call dispatchLoad when openedDialog afterClosed is called', () => {
    const mockSettings = {
      conversionFactor: 1,
      repetitionFactor: 1,
      method: 'FKM',
    };

    spyOn(component['dialog'], 'open').and.returnValue({
      afterClosed: () => of(mockSettings),
    });
    const mockArray = [['powerapps'], ['1'], [2, 4], [3]];

    spyOn(component, 'dispatchLoad');
    component.openDialog(mockArray);
    expect(component.dispatchLoad).toHaveBeenCalledWith(
      mockArray,
      mockSettings
    );
  });

  it('should dispatch dispatchLoad action when parseLoadFile is called', () => {
    const blobProps = {
      lastModifiedDate: '',
      name: 'filename',
    };
    const blob = new Blob([JSON.stringify(blobProps, undefined, 2)], {
      type: 'text/csv',
    });
    const mockFile = blob as File;
    const mockFileList = {
      0: mockFile,
      1: mockFile,
      length: 2,
      item: (_index: number) => mockFile,
    };

    spyOn(component, 'parseLoadFile');
    component.handleFileInput(mockFileList);
    expect(component.parseLoadFile).toHaveBeenCalledWith(mockFile);
  });

  it('should call dispatchLoad method that dispatches a cleaned number array to store', () => {
    const mockArray = [['powerapps'], ['1'], [2, 4], [3]];
    const mockCleanedArray = {
      data: [1, 2, 3],
      status: 1,
    };
    const mockSettings = {
      conversionFactor: 1,
      repetitionFactor: 1,
      method: 'FKM',
    };
    const action = fromStore.postLoadsData({
      loadsRequest: { ...mockCleanedArray, ...mockSettings },
    });

    component.dispatchLoad(mockArray, mockSettings);
    expect(store.dispatch).toHaveBeenCalledWith(action);
  });

  it('customize tooltip should add text if 10000 < x < 10000000', () => {
    const testObj: any = component.customizeTooltip({
      argument: 10001,
      value: 1,
    });
    expect(testObj.text).toBeTruthy();
    expect(testObj.html).not.toBeDefined();
  });

  it('customize tooltip should not add text if 10000 > x | x > 10000000', () => {
    const testObj: any = component.customizeTooltip({
      argument: 1001,
      value: 1,
    });
    expect(testObj.text).not.toBeDefined();
    expect(testObj.html).not.toBeTruthy();
  });

  it('filterLegendGraphs should return true if a given value name is inside a given data object, otherwise false', () => {
    let filterValue = component.filterLegendGraphs('y1', [{ y1: 123 }]);
    expect(filterValue).toEqual(true);

    filterValue = component.filterLegendGraphs('y1', [{ y: 123 }]);
    expect(filterValue).toEqual(false);
  });

  it('should set Haigh chart settings when chartType is changed', () => {
    component.selectChartType(1);
    const action = fromStore.setChartType({ chartType: ChartType.Haigh });

    expect(store.dispatch).toHaveBeenCalledWith(action);
  });

  describe('getMaterialIcon', () => {
    it('should return sth of type Icon', () => {
      const mockIcon = 'test-icon';
      const mockedComposedIcon: Icon = {
        icon: mockIcon,
        materialIcon: false,
      };

      expect(component.getIcon(mockIcon)).toEqual(mockedComposedIcon);
    });
  });

  describe('handleDummyLoad', () => {
    it('should call parseLoadsFile', () => {
      spyOn(component, 'parseLoadFile');
      component.handleDummyLoad();

      expect(component.parseLoadFile).toHaveBeenCalledWith(
        '/assets/loads/cca-sql-dump.txt',
        true
      );
    });
  });
});
