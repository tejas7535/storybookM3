import { CommonModule } from '@angular/common';
import { HttpClientModule } from '@angular/common/http';
import { MatExpansionModule } from '@angular/material/expansion';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { RouterTestingModule } from '@angular/router/testing';

import { of, throwError } from 'rxjs';

import { createComponentFactory, Spectator } from '@ngneat/spectator/jest';
import { ReactiveComponentModule } from '@ngrx/component';

import { provideTranslocoTestingModule } from '@schaeffler/transloco/testing';

import { HtmlReportComponent } from './html-report.component';
import { ReportService } from '../../report.service';

describe('HtmlReportComponent', () => {
  let component: HtmlReportComponent;
  let spectator: Spectator<HtmlReportComponent>;
  let snackBar: MatSnackBar;

  const createComponent = createComponentFactory({
    component: HtmlReportComponent,
    declarations: [HtmlReportComponent],
    imports: [
      CommonModule,
      HttpClientModule,
      provideTranslocoTestingModule({ en: {} }),
      RouterTestingModule,

      ReactiveComponentModule,

      MatExpansionModule,
      MatSnackBarModule,
    ],
    providers: [ReportService],
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

    component.htmlReportUrl = '';

    snackBar.open = jest.fn();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  describe('ngOnInit', () => {
    it('should call getHtmlReport if htmlReport is set', () => {
      component.htmlReportUrl = 'jup';
      component.getHtmlReport = jest.fn();

      component.ngOnInit();

      expect(component.getHtmlReport).toHaveBeenCalledTimes(1);
    });

    it('should do nothing if jsonReport and htmlReport are not set', () => {
      component.getHtmlReport = jest.fn();

      component.ngOnInit();

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
      component.htmlReportUrl = 'mockDisplayReportUrl';
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

  describe('showSnackBarError', () => {
    it('should open the snackbar', () => {
      component.showSnackBarError();
      expect(snackBar.open).toBeCalledTimes(1);
    });
  });
});
