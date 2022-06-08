import { CommonModule } from '@angular/common';
import { HttpClientModule } from '@angular/common/http';
import { MatButtonModule } from '@angular/material/button';
import { MATERIAL_SANITY_CHECKS } from '@angular/material/core';
import { MatExpansionModule } from '@angular/material/expansion';
import { MatIconModule } from '@angular/material/icon';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { RouterTestingModule } from '@angular/router/testing';

import { of, throwError } from 'rxjs';

import { createComponentFactory, Spectator } from '@ngneat/spectator/jest';
import { PushModule } from '@ngrx/component';

import { provideTranslocoTestingModule } from '@schaeffler/transloco/testing';
import { TableItem } from '../../models/index';

import { ReportComponent } from './report.component';
import { ReportService } from '../../report.service';

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

      PushModule,

      MatIconModule,
      MatButtonModule,
      MatExpansionModule,
      MatSnackBarModule,
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

    component.title = 'mockTitle';
    snackBar.open = jest.fn();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  describe('ngOnInit', () => {
    it('should call getJsonReport if jsonReport is set', () => {
      component.jsonReportUrl = 'jup';
      component.getJsonReport = jest.fn();

      component.ngOnInit();

      expect(component.getJsonReport).toHaveBeenCalledTimes(1);
    });
    it('should do nothing if jsonReport and htmlReport are not set', () => {
      component.getJsonReport = jest.fn();

      component.ngOnInit();

      expect(component.getJsonReport).not.toHaveBeenCalled();
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
          ''
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
      const tableItems: TableItem[] = [
        {
          value: 'a',
          field: 'BaseOil',
        },
        {
          value: 'b',
          field: 'NLGI',
        },
        {
          value: 'c',
          field: 'Thickener',
        },
      ];
      const field = 'Thickener';

      const result = component.getItem(tableItems, field);

      expect(result).toEqual({ value: 'c', field: 'Thickener' });
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
