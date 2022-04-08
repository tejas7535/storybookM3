import { CommonModule } from '@angular/common';
import { HttpClientModule } from '@angular/common/http';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MATERIAL_SANITY_CHECKS } from '@angular/material/core';
import { MatExpansionModule } from '@angular/material/expansion';
import { MatIconModule } from '@angular/material/icon';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { RouterTestingModule } from '@angular/router/testing';

import { of, throwError } from 'rxjs';

import { OneTrustModule } from '@altack/ngx-onetrust';
import { createComponentFactory, Spectator } from '@ngneat/spectator/jest';
import { ReactiveComponentModule } from '@ngrx/component';

import { COOKIE_GROUPS } from '@schaeffler/application-insights';
import { provideTranslocoTestingModule } from '@schaeffler/transloco/testing';

import { formattedGreaseJson, greaseReport } from '../mocks';
import { MEDIASGREASE, TitleId } from './models';
import { ReportComponent } from './report.component';
import { ReportService } from './report.service';

describe('ReportComponent', () => {
  let component: ReportComponent;
  let spectator: Spectator<ReportComponent>;
  let snackBar: MatSnackBar;

  const createComponent = createComponentFactory({
    component: ReportComponent,
    declarations: [ReportComponent],
    imports: [
      CommonModule,
      HttpClientModule,
      provideTranslocoTestingModule({ en: {} }),
      RouterTestingModule,

      ReactiveComponentModule,

      MatCardModule,
      MatIconModule,
      MatButtonModule,
      MatExpansionModule,
      MatSnackBarModule,
      OneTrustModule.forRoot({
        cookiesGroups: COOKIE_GROUPS,
        domainScript: 'mockOneTrustId',
      }),
    ],
    providers: [
      ReportService,
      {
        provide: MATERIAL_SANITY_CHECKS,
        useValue: false,
      },
    ],
  });

  beforeEach(() => {
    Object.defineProperty(window, 'matchMedia', {
      value: () => ({
        matches: false,
        addListener: () => {},
        removeListener: () => {},
      }),
    });
    spectator = createComponent();
    snackBar = spectator.inject(MatSnackBar);
    component = spectator.debugElement.componentInstance;

    component.jsonReport = undefined;
    component.htmlReport = undefined;

    component.title = 'mockTitle';
    snackBar.open = jest.fn();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  describe('ngOnInit', () => {
    it('should call getHtmlReport if htmlReport is set', () => {
      component.htmlReport = 'jup';
      component.getHtmlReport = jest.fn();

      component.ngOnInit();

      expect(component.getHtmlReport).toHaveBeenCalledTimes(1);
    });
    it('should call getJsonReport if jsonReport is set', () => {
      component.jsonReport = 'jup';
      component.getJsonReport = jest.fn();

      component.ngOnInit();

      expect(component.getJsonReport).toHaveBeenCalledTimes(1);
    });
    it('should do nothing if jsonReport and htmlReport are not set', () => {
      component.getJsonReport = jest.fn();
      component.getHtmlReport = jest.fn();

      component.ngOnInit();

      expect(component.getJsonReport).not.toHaveBeenCalled();
      expect(component.getHtmlReport).not.toHaveBeenCalled();
    });
  });

  describe('ngOnDestroy', () => {
    it('should complete destroy and dismiss the snackbar', () => {
      component['destroy$'].next = jest.fn();
      component['destroy$'].complete = jest.fn();

      component.ngOnDestroy();

      expect(component['destroy$'].next).toHaveBeenCalledTimes(1);
      expect(component['destroy$'].complete).toHaveBeenCalledTimes(1);
    });
  });

  describe('getHtmlReport', () => {
    beforeEach(() => {
      component.htmlReport = 'mockDisplayReportUrl';
      component.reportSelector = 'mockReportSelector';
    });
    it('getHtmlReport should call getReport from reportService', (done) => {
      component['reportService'].getHtmlReport = jest
        .fn()
        .mockImplementation((_url: string) => of(''));

      component.htmlResult$.subscribe(() => {
        expect(component['reportService'].getHtmlReport).toBeCalledTimes(1);
        expect(component['reportService'].getHtmlReport).toBeCalledWith(
          'mockDisplayReportUrl',
          'mockReportSelector'
        );
        done();
      });
      component.getHtmlReport();
    });

    it('getHtmlReport should call snackbar service if report service throws an error', () => {
      const showSnackBarErrorSpy = jest.spyOn(component, 'showSnackBarError');
      component['reportService'].getHtmlReport = jest
        .fn()
        .mockImplementation((_url: string) => throwError('someerror'));

      component.getHtmlReport();

      expect(showSnackBarErrorSpy).toBeCalledTimes(1);
    });
  });

  describe('getJsonReport', () => {
    it('getJsonReport should call getReport from reportService', (done) => {
      component['reportService'].getJsonReport = jest
        .fn()
        .mockImplementation((_url: string) => of([]));

      component.jsonResult$.subscribe(() => {
        expect(component['reportService'].getJsonReport).toHaveBeenCalledTimes(
          1
        );
        expect(component['reportService'].getJsonReport).toHaveBeenCalledWith(
          undefined
        );
        done();
      });

      component.getJsonReport();
    });

    it('getJsonReport should call snackbar service if report service throws an error', () => {
      const showSnackBarErrorSpy = jest.spyOn(component, 'showSnackBarError');

      component['reportService'].getJsonReport = jest
        .fn()
        .mockImplementation((_url: string) => throwError('someerror'));

      component.getJsonReport();

      expect(showSnackBarErrorSpy).toBeCalledTimes(1);
    });
  });

  describe('showSnackBarError', () => {
    it('should open the snackbar', () => {
      component.showSnackBarError();
      expect(snackBar.open).toBeCalledTimes(1);
    });
  });

  describe('getItem', () => {
    it('should find the correct item in a row', () => {
      const row = [
        {
          value: 'a',
          field: 'a',
        },
        {
          value: 'b',
          field: 'b',
        },
        {
          value: 'c',
          field: 'c',
        },
      ];
      const field = 'c';

      const result = component.getItem(row, field);

      expect(result).toEqual({ value: 'c', field: 'c' });
    });
  });

  describe('getHeaders', () => {
    it('should return a list of field names combined with their index', () => {
      const fields = ['a', 'b', 'c'];

      const result = component.getHeaders(fields);

      expect(result).toEqual(['a0', 'b1', 'c2']);
    });
  });

  describe('toggleShowValues', () => {
    it('should trigger some grease report service methods', () => {
      component.jsonResult$.next = jest.fn();

      const toggleShowValuesSpy = jest.spyOn(
        component['greaseReportService'],
        'toggleShowValues'
      );
      const showActiveDataSpy = jest.spyOn(
        component['greaseReportService'],
        'showActiveData'
      );

      component.formattedResult = component['greaseReportService'][
        'formatGreaseReport'
      ](greaseReport.subordinates);

      const mockSubordinate = (component.formattedResult as any).find(
        ({ titleID }: any) => titleID === TitleId.STRING_OUTP_RESULTS
      ).subordinates[1];

      component.toggleShowValues(mockSubordinate);

      expect(toggleShowValuesSpy).toHaveBeenCalledTimes(1);

      // Todo: make this work
      // expect(toggleShowValuesSpy).toHaveBeenCalledWith(
      //   mockSubordinate,
      //   component.formattedResult
      // );
      expect(showActiveDataSpy).toHaveBeenCalledTimes(1);

      expect(component.jsonResult$.next).toHaveBeenCalled();
    });
  });

  describe('isGreaseResultSection', () => {
    it('should return true if the titleID is the result titleID', () => {
      const result = component.isGreaseResultSection(
        TitleId.STRING_OUTP_RESULTS
      );

      expect(result).toBeTruthy();
    });

    it('should return false if the titleID is not the result titleID', () => {
      const result = component.isGreaseResultSection(TitleId.STRING_OUTP_INPUT);

      expect(result).toBeFalsy();
    });
  });

  describe('toggleLimitResults', () => {
    it('should toggle the limitResults component var', () => {
      component.limitResults = false;

      component.toggleLimitResults();

      expect(component.limitResults).toBeTruthy();
    });
  });

  describe('limitSubordinates', () => {
    it('should limit the subordinate to the amount of limitResults', () => {
      component.limitResults = true;
      const mockLength = 2;
      component.resultAmount = mockLength;

      const result = component.limitSubordinates(
        formattedGreaseJson[1].subordinates,
        TitleId.STRING_OUTP_RESULTS
      );

      expect(result).toHaveLength(mockLength);
    });

    it('should not limit the subordinate to the amount of limitResults', () => {
      component.limitResults = false;
      const mockLength = 2;
      component.resultAmount = mockLength;

      const result = component.limitSubordinates(
        formattedGreaseJson[1].subordinates,
        TitleId.STRING_OUTP_RESULTS
      );

      expect(result).toHaveLength(formattedGreaseJson[1].subordinates.length);
    });
  });

  describe('getResultAmount', () => {
    it('should set the length of allResultAmount', () => {
      const getResultAmountSpy = jest.spyOn(
        component['greaseReportService'],
        'getResultAmount'
      );
      component.formattedResult = formattedGreaseJson;

      component.getResultAmount();

      expect(getResultAmountSpy).toHaveBeenCalledTimes(1);
      expect(component.allResultAmount).toBe(
        formattedGreaseJson[1].subordinates.length
      );
    });
  });

  describe('filteredData', () => {
    it('should only return entries that are not undefined', () => {
      const mockData = [undefined, { title: 'mockTitle', value: 'mockValue' }];
      const result = component.filteredData(mockData);

      expect(result).toHaveLength(1);
    });
  });

  describe('#trackGreaseSelection', () => {
    it('should call the logEvent method', () => {
      const mockGrease = 'RESI SCHMELZ';

      const trackingSpy = jest.spyOn(
        component['applicationInsightsService'],
        'logEvent'
      );

      component.trackGreaseSelection(mockGrease);

      expect(trackingSpy).toHaveBeenCalledWith(MEDIASGREASE, {
        grease: mockGrease,
      });
    });
  });
});
