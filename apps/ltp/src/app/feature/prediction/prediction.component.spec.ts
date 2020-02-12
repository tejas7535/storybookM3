import { CommonModule } from '@angular/common';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { FlexLayoutModule } from '@angular/flex-layout';
import {
  MatButtonModule,
  MatDividerModule,
  MatExpansionModule,
  MatMenuModule,
  MatTabsModule
} from '@angular/material';
import { HAMMER_LOADER } from '@angular/platform-browser';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';

import { Store, StoreModule } from '@ngrx/store';
import { MockStore, provideMockStore } from '@ngrx/store/testing';
import { provideTranslocoTestingModule } from '@schaeffler/shared/transloco';
import { BannerModule, BannerState } from '@schaeffler/shared/ui-components';

import { configureTestSuite } from 'ng-bullet';

import { TooltipModule } from '../../shared/components/tooltip/tooltip.module';
import { ChartModule } from './chart/chart.module';

import { KpiComponent } from './kpi/kpi.component';
import { PredictionComponent } from './prediction.component';

import { initialState as initialInputState } from '../../core/store/reducers/input.reducer';
import { initialState as initialPredictionState } from '../../core/store/reducers/prediction.reducer';

import * as en from '../../../assets/i18n/en.json';
import * as fromStore from '../../core/store';
import { CHART_SETTINGS_WOEHLER } from '../../shared/constants';
import { ChartType } from '../../shared/enums';

describe('PredictionComponent', () => {
  let component: PredictionComponent;
  let fixture: ComponentFixture<PredictionComponent>;
  let store: MockStore<fromStore.LTPState>;

  const initialBannerState: BannerState = {
    text: '',
    buttonText: 'OK',
    truncateSize: 120,
    isFullTextShown: false,
    open: true,
    url: undefined
  };

  configureTestSuite(() => {
    TestBed.configureTestingModule({
      declarations: [PredictionComponent, KpiComponent],
      imports: [
        CommonModule,
        NoopAnimationsModule,
        BannerModule,
        FlexLayoutModule,
        MatButtonModule,
        MatMenuModule,
        MatTabsModule,
        provideTranslocoTestingModule({ en }),
        StoreModule.forRoot({}),
        ChartModule,
        MatExpansionModule,
        MatDividerModule,
        TooltipModule
      ],
      providers: [
        provideMockStore({
          initialState: {
            prediction: initialPredictionState,
            input: initialInputState,
            banner: initialBannerState
          }
        }),
        {
          provide: HAMMER_LOADER,
          useValue: async () => new Promise(() => {})
        }
      ]
    });
  });

  beforeEach(() => {
    window.matchMedia = jest.fn().mockImplementation(query => {
      return {
        matches: false,
        media: query,
        onchange: undefined,
        addListener: jest.fn(), // deprecated
        removeListener: jest.fn(), // deprecated
        addEventListener: jest.fn(),
        removeEventListener: jest.fn(),
        dispatchEvent: jest.fn()
      };
    });
    fixture = TestBed.createComponent(PredictionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();

    store = TestBed.get(Store);
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
      component.dispatchLoad = jest.fn();
      Object.defineProperty(window, 'matchMedia', {
        value: jest.fn(() => {
          return { matches: true };
        })
      });
    });

    it('should call dispatchLoad', async () => {
      store.overrideSelector('getBannerOpen', true);
      file = new File(['input1', ',', 'input2'], 'file');

      await component.parseLoadFile(file);

      expect(component.dispatchLoad).toHaveBeenCalledWith([
        ['input1', 'input2']
      ]);
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
      name: 'filename'
    };
    const blob = new Blob([JSON.stringify(blobProps, undefined, 2)], {
      type: 'text/csv'
    });
    const mockFile = blob as File;
    const mockFileList = {
      0: mockFile,
      1: mockFile,
      length: 2,
      item: (_index: number) => mockFile
    };

    spyOn(component, 'parseLoadFile');
    component.handleFileInput(mockFileList);
    expect(component.parseLoadFile).toHaveBeenCalledWith(mockFile);
  });

  it('should dispatch dispatchLoad action when parseLoadFile is called', () => {
    const blobProps = {
      lastModifiedDate: '',
      name: 'filename'
    };
    const blob = new Blob([JSON.stringify(blobProps, undefined, 2)], {
      type: 'text/csv'
    });
    const mockFile = blob as File;
    const mockFileList = {
      0: mockFile,
      1: mockFile,
      length: 2,
      item: (_index: number) => mockFile
    };

    spyOn(component, 'parseLoadFile');
    component.handleFileInput(mockFileList);
    expect(component.parseLoadFile).toHaveBeenCalledWith(mockFile);
  });

  it('should call dispatchLoad method that dispatches a cleaned number array to store', () => {
    const mockArray = [['powerapps'], ['1'], [2, 4], [3]];
    const mockCleanedArray = { data: [1, 2, 3], status: 1 };
    const action = fromStore.postLoadsData({ loadsRequest: mockCleanedArray });

    component.dispatchLoad(mockArray);
    expect(store.dispatch).toHaveBeenCalledWith(action);
  });

  it('customize tooltip should add text if 10000 < x < 10000000', () => {
    const testObj: any = component.customizeTooltip({
      argument: 10001,
      value: 1
    });
    expect(testObj.text).toBeTruthy();
    expect(testObj.html).not.toBeDefined();
  });

  it('customize tooltip should not add text if 10000 > x | x > 10000000', () => {
    const testObj: any = component.customizeTooltip({
      argument: 1001,
      value: 1
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
});
