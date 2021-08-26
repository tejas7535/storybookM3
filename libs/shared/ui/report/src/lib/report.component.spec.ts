import { CommonModule } from '@angular/common';
import { HttpClientModule } from '@angular/common/http';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatExpansionModule } from '@angular/material/expansion';
import { MatIconModule } from '@angular/material/icon';

import { of, throwError } from 'rxjs';

import { createComponentFactory, Spectator } from '@ngneat/spectator/jest';
import { ReactiveComponentModule } from '@ngrx/component';

import { SnackBarModule, SnackBarService } from '@schaeffler/snackbar';

import { ReportComponent } from './report.component';
import { ReportService } from './report.service';

describe('ReportComponent', () => {
  let component: ReportComponent;
  let spectator: Spectator<ReportComponent>;
  let reportService: ReportService;
  let snackbarService: SnackBarService;
  let shouldThrowAnError = false;

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
      {
        provide: ReportService,
        useValue: {
          getReport: jest.fn(() =>
            shouldThrowAnError
              ? throwError(() => new Error('sometext'))
              : of({})
          ),
        },
      },
    ],
  });

  beforeEach(() => {
    shouldThrowAnError = false;
    Object.defineProperty(window, 'matchMedia', {
      value: () => ({
        matches: false,
        addListener: () => {},
        removeListener: () => {},
      }),
    });
    spectator = createComponent();
    component = spectator.debugElement.componentInstance;
    reportService = spectator.inject(ReportService);
    snackbarService = spectator.inject(SnackBarService);
    snackbarService.showErrorMessage = jest.fn();

    component.displayReport = 'mockDisplayReportUrl';
    component.title = 'mockTitle';
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('getReport should call getReport from reportService', () => {
    component.getReport();

    component.result$.subscribe(() => {
      expect(reportService.getReport).toBeCalledTimes(1);
      expect(reportService.getReport).toBeCalledWith('mockDisplayReportUrl');
    });
  });

  it('getReport should call snackbar service if report service throws an error', () => {
    shouldThrowAnError = true;
    component.getReport();

    component.result$.subscribe(() => {
      expect(snackbarService.showErrorMessage).toBeCalledTimes(1);
    });
  });
});
