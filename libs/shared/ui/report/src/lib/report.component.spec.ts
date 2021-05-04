import { CommonModule } from '@angular/common';
import { HttpClientModule } from '@angular/common/http';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatExpansionModule } from '@angular/material/expansion';
import { MatIconModule } from '@angular/material/icon';

import { createComponentFactory, Spectator } from '@ngneat/spectator/jest';
import { ReactiveComponentModule } from '@ngrx/component';

import { IconsModule } from '@schaeffler/icons';

import { ReportComponent } from './report.component';
import { ReportService } from './report.service';

describe('ReportComponent', () => {
  let component: ReportComponent;
  let spectator: Spectator<ReportComponent>;
  let reportService: ReportService;

  const createComponent = createComponentFactory({
    component: ReportComponent,
    declarations: [ReportComponent],
    imports: [
      CommonModule,
      HttpClientModule,

      ReactiveComponentModule,

      MatCardModule,
      IconsModule,
      MatIconModule,
      MatButtonModule,
      MatExpansionModule,
    ],
    providers: [
      {
        provide: ReportService,
        useValue: {
          getReport: jest.fn(() => {}),
        },
      },
    ],
  });

  beforeEach(() => {
    spectator = createComponent();
    component = spectator.debugElement.componentInstance;
    reportService = spectator.inject(ReportService);

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
});
