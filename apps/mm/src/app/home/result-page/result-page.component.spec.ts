import { provideHttpClient } from '@angular/common/http';
import { provideHttpClientTesting } from '@angular/common/http/testing';
import { MATERIAL_SANITY_CHECKS } from '@angular/material/core';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { provideRouter } from '@angular/router';

import { createComponentFactory, Spectator } from '@ngneat/spectator/jest';
import { PushPipe } from '@ngrx/component';
import { provideMockStore } from '@ngrx/store/testing';

import { ApplicationInsightsModule } from '@schaeffler/application-insights';
import { ReportModule } from '@schaeffler/report';
import { provideTranslocoTestingModule } from '@schaeffler/transloco/testing';

import { environment } from '../../../environments/environment';
import { ResultPageService } from '../../core/services/result-page/result-page.service';
import { ResultPageComponent } from './result-page.component';

describe('ResultPageComponent', () => {
  let component: ResultPageComponent;
  let spectator: Spectator<ResultPageComponent>;
  let resultPageService: ResultPageService;

  const createComponent = createComponentFactory({
    component: ResultPageComponent,
    imports: [
      provideTranslocoTestingModule({ en: {} }),
      ReportModule,
      PushPipe,
      MatSnackBarModule,
      ApplicationInsightsModule.forRoot(environment.applicationInsights),
    ],
    declarations: [ResultPageComponent],
    providers: [
      provideHttpClient(),
      provideHttpClientTesting(),
      provideRouter([]),
      ResultPageService,
      {
        provide: MATERIAL_SANITY_CHECKS,
        useValue: false,
      },
      provideMockStore({}),
    ],
  });

  beforeEach(() => {
    spectator = createComponent();
    component = spectator.debugElement.componentInstance;
    resultPageService = spectator.inject(ResultPageService);
    // snackBar = spectator.inject(MatSnackBar);
    const location: Location = window.location;
    delete window.location;
    window.location = {
      ...location,
      reload: jest.fn(),
    };
  });

  it('should create', () => {
    expect(component).toBeTruthy();
    expect(resultPageService).toBeTruthy();
  });

  describe('#resetWizard', () => {
    it('should console log for now', () => {
      const reloadSpy = jest.spyOn(window.location, 'reload');

      component.resetWizard();

      expect(reloadSpy).toHaveBeenCalledTimes(1);
    });
  });
});
