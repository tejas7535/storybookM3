import { CommonModule } from '@angular/common';
import { HttpClientModule } from '@angular/common/http';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MATERIAL_SANITY_CHECKS } from '@angular/material/core';
import { MatExpansionModule } from '@angular/material/expansion';
import { MatIconModule } from '@angular/material/icon';

import { Observable, of, Subject, throwError } from 'rxjs';

import { createComponentFactory, Spectator } from '@ngneat/spectator/jest';
import { ReactiveComponentModule } from '@ngrx/component';

import { SnackBarModule, SnackBarService } from '@schaeffler/snackbar';

import { ReportComponent } from './report.component';
import { ReportService } from './report.service';

describe('ReportComponent', () => {
  let component: ReportComponent;
  let spectator: Spectator<ReportComponent>;

  const createComponent = createComponentFactory({
    component: ReportComponent,
    declarations: [ReportComponent],
    imports: [
      CommonModule,
      HttpClientModule,

      ReactiveComponentModule,

      MatCardModule,
      MatIconModule,
      MatButtonModule,
      MatExpansionModule,
      SnackBarModule,
    ],
    providers: [
      ReportService,
      SnackBarService,
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
    component = spectator.debugElement.componentInstance;

    component.jsonReport = undefined;
    component.htmlReport = undefined;

    component.title = 'mockTitle';
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
      component['snackbarService'].dismiss = jest.fn();
      component['destroy$'].next = jest.fn();
      component['destroy$'].complete = jest.fn();

      component.ngOnDestroy();

      expect(component['snackbarService'].dismiss).toHaveBeenCalledTimes(1);
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

    it('getHtmlReport should call snackbar service if report service throws an error', (done) => {
      component['reportService'].getHtmlReport = jest
        .fn()
        .mockImplementation((_url: string) => throwError('someerror'));

      const snackbarSubject = new Subject<string>();

      component['snackbarService'].showErrorMessage = jest
        .fn()
        .mockImplementation(() => {
          snackbarSubject.next('ok');

          return new Observable<string>();
        });

      snackbarSubject.subscribe(() => {
        expect(component['snackbarService'].showErrorMessage).toBeCalledTimes(
          1
        );
        done();
      });
      component.getHtmlReport();
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

    it('getJsonReport should call snackbar service if report service throws an error', (done) => {
      component['reportService'].getJsonReport = jest
        .fn()
        .mockImplementation((_url: string) => throwError('someerror'));

      const snackbarSubject = new Subject<string>();

      component['snackbarService'].showErrorMessage = jest
        .fn()
        .mockImplementation(() => {
          snackbarSubject.next('ok');

          return new Observable<string>();
        });

      snackbarSubject.subscribe(() => {
        expect(component['snackbarService'].showErrorMessage).toBeCalledTimes(
          1
        );
        done();
      });
      component.getJsonReport();
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
});
