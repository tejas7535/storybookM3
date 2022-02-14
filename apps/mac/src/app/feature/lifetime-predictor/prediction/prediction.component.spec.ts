import { DecimalPipe } from '@angular/common';
import { TestBed } from '@angular/core/testing';
import { ReactiveFormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MATERIAL_SANITY_CHECKS } from '@angular/material/core';
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
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { BrowserDynamicTestingModule } from '@angular/platform-browser-dynamic/testing';

import { of } from 'rxjs';

import { createComponentFactory, Spectator } from '@ngneat/spectator/jest';
import { translate } from '@ngneat/transloco';
import { ReactiveComponentModule } from '@ngrx/component';
import { StoreModule } from '@ngrx/store';
import { MockStore, provideMockStore } from '@ngrx/store/testing';
import { ParseConfig, ParseResult } from 'ngx-papaparse';
import resize_observer_polyfill from 'resize-observer-polyfill';

import { BannerModule, BannerState } from '@schaeffler/banner';
import { provideTranslocoTestingModule } from '@schaeffler/transloco/testing';

import * as en from '../../../../assets/i18n/en.json';
import { initialState as initialInputState } from '../store/reducers/input.reducer';
import { initialState as initialPredictionState } from '../store/reducers/prediction.reducer';
import { TooltipModule } from './../../../shared/components/tooltip/tooltip.module';
import { BreadcrumbsService } from './../../../shared/services/breadcrumbs/breadcrumbs.service';
import { SharedModule } from './../../../shared/shared.module';
import { ChartType } from './../enums/chart-type.enum';
import { postPrediction, setChartType, setLoadsRequest } from './../store';
import { ChartModule } from './chart/chart.module';
import { KpiComponent } from './kpi/kpi.component';
import { PredictionComponent } from './prediction.component';
import { UploadModalComponent } from './upload-modal/upload-modal.component';
window.ResizeObserver = resize_observer_polyfill;

jest.mock('../../../shared/change-favicon.ts', () => ({
  changeFavicon: jest.fn(() => {}),
}));
describe('PredictionComponent', () => {
  let component: PredictionComponent;
  let spectator: Spectator<PredictionComponent>;
  let store: MockStore;

  const initialBannerState: BannerState = {
    text: undefined,
    buttonText: undefined,
    icon: undefined,
    truncateSize: undefined,
    showFullText: false,
    open: false,
  };

  const createComponent = createComponentFactory({
    component: PredictionComponent,
    declarations: [PredictionComponent, KpiComponent, UploadModalComponent],
    imports: [
      NoopAnimationsModule,
      MatButtonModule,
      MatMenuModule,
      MatTabsModule,
      MatDialogModule,
      MatCardModule,
      StoreModule.forRoot({}),
      provideTranslocoTestingModule({ en }),
      ChartModule,
      MatExpansionModule,
      MatDividerModule,
      TooltipModule,
      MatIconModule,
      ReactiveFormsModule,
      ReactiveComponentModule,
      MatFormFieldModule,
      MatInputModule,
      MatRadioModule,
      SharedModule,
      BannerModule,
    ],
    providers: [
      provideMockStore({
        initialState: {
          ltp: {
            prediction: initialPredictionState,
            input: initialInputState,
          },
          banner: initialBannerState,
        },
      }),
      { provide: MatDialogRef, useValue: {} },
      { provide: MAT_DIALOG_DATA, useValue: [] },
      {
        provide: BreadcrumbsService,
        useValue: {
          updateBreadcrumb: jest.fn(() => {}),
        },
      },
      DecimalPipe,
      {
        provide: MATERIAL_SANITY_CHECKS,
        useValue: false,
      },
    ],
    overrideModules: [
      [
        BrowserDynamicTestingModule,
        { set: { entryComponents: [UploadModalComponent] } },
      ],
    ],
  });

  beforeEach(() => {
    spectator = createComponent();
    component = spectator.debugElement.componentInstance;
    store = TestBed.inject(MockStore);

    store.dispatch = jest.fn();
    // component.openBanner = jest.fn();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  describe('#ngOnInit', () => {
    it('should dispatch action postPrediction', () => {
      component.ngOnInit();

      expect(store.dispatch).toHaveBeenCalledWith(postPrediction());
    });
  });

  describe('openBanner', () => {
    it('should dispatch openBanner action', () => {
      const banner = {
        text: translate('ltp.disclaimer'),
        icon: 'info',
        buttonText: translate('ltp.disclaimerClose'),
        truncateSize: 0,
        type: '[Banner] Open Banner',
      };
      store.dispatch = jest.fn();

      component.openBanner();
      expect(store.dispatch).toHaveBeenCalledWith(banner);
    });
  });

  describe('#parseLoadFile', () => {
    let file: File;
    beforeEach(() => {
      component.openDialog = jest.fn();
    });

    it('should call openDialog', async () => {
      component['papa'].parse = jest.fn(
        (_csv: string | Blob, config: ParseConfig): ParseResult => {
          const result: ParseResult = {
            data: [['input1', 'input2']],
          } as unknown as ParseResult;
          config.complete(result);

          return result;
        }
      );
      store.overrideSelector('getBannerOpen', true);
      file = new File(['input1', ',', 'input2'], 'file');

      component.parseLoadFile(file);

      expect(component.openDialog).toHaveBeenCalledWith([['input1', 'input2']]);
    });

    it('should print the error to console in error case', async () => {
      console.error = jest.fn();
      component['papa'].parse = jest.fn(
        (csv: string | Blob, config: ParseConfig): ParseResult => {
          config.error('some error', csv);

          return undefined;
        }
      );

      // eslint-disable-next-line unicorn/no-useless-undefined
      component.parseLoadFile(undefined);
      expect(console.error).toHaveBeenCalledWith(
        'An error occured: some error'
      );
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

    component.parseLoadFile = jest.fn();
    component.handleFileInput(mockFileList);
    expect(component.parseLoadFile).toHaveBeenCalledWith(mockFile);
  });

  it('should call dispatchLoad when openedDialog afterClosed is called', () => {
    const mockSettings = {
      conversionFactor: 1,
      repetitionFactor: 1,
      method: 'FKM',
    };

    jest
      .spyOn(component['dialog'], 'open')
      .mockReturnValue({ afterClosed: () => of(mockSettings) } as MatDialogRef<
        unknown,
        unknown
      >);

    const mockArray = [['powerapps'], ['1'], [2, 4], [3]];

    jest.spyOn(component, 'dispatchLoad');
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

    component.parseLoadFile = jest.fn();
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
    const action = setLoadsRequest({
      loadsRequest: { ...mockCleanedArray, ...mockSettings },
    });

    component.dispatchLoad(mockArray, mockSettings);
    expect(store.dispatch).toHaveBeenCalledWith(action);
  });

  it('should call dispatchLoad method that dispatches a cleaned number array to store and slice arrays longer than 50000', () => {
    const mockArray = [['powerapps'], ['1'], [2, 4], [3]];
    const mockSettings = {
      conversionFactor: 1,
      repetitionFactor: 1,
      method: 'FKM',
    };

    mockArray.reduce = jest.fn(() => [50_001]);

    component.dispatchLoad(mockArray, mockSettings);
    expect(store.dispatch).toHaveBeenCalled();
  });

  it('customize tooltip should add text if 10000 <= x <= 10000000', () => {
    const testObj: any = component.customizeTooltip({
      value: {
        x: 10_001,
        y2: 1,
      },
      axisValue: 5,
    });
    expect(testObj).toBeTruthy();
  });

  it('customize tooltip should not add text if 10000 > x | x > 10000000', () => {
    const testObj: any = component.customizeTooltip([
      {
        value: {
          x: 9999,
          y2: 1,
        },
        axisValue: 5,
      },
    ]);
    expect(testObj).not.toBeDefined();
  });

  it('filterLegendGraphs should return true if a given value name is inside a given data object, otherwise false', () => {
    let filterValue = component.filterLegendGraphs('y1', [{ y1: 123 }]);
    expect(filterValue).toEqual(true);

    filterValue = component.filterLegendGraphs('y1', [{ y: 123 }, { x: 123 }]);
    expect(filterValue).toEqual(false);
  });

  it('should set Haigh chart settings when chartType is changed', () => {
    component.selectChartType(1);
    const action = setChartType({ chartType: ChartType.Haigh });

    expect(store.dispatch).toHaveBeenCalledWith(action);
  });

  describe('handleDummyLoad', () => {
    it('should call parseLoadsFile', () => {
      jest.spyOn(component, 'parseLoadFile');
      component.handleDummyLoad();

      expect(component.parseLoadFile).toHaveBeenCalledWith(
        '/assets/loads/cca-sql-dump.txt',
        true
      );
    });
  });
});
