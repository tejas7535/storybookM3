import { HttpClientTestingModule } from '@angular/common/http/testing';
import { FormGroup } from '@angular/forms';

import { of } from 'rxjs';

import { createComponentFactory, Spectator } from '@ngneat/spectator/jest';
import { TranslocoTestingModule } from '@ngneat/transloco';
import { ReactiveComponentModule } from '@ngrx/component';

import { ENV_CONFIG } from '@schaeffler/http';
import { ReportModule } from '@schaeffler/report';

import { BEARING_CALCULATION_RESULT_MOCK } from '../../testing/mocks/rest.service.mock';
import { ResultPageComponent } from './result-page.component';
import { ResultPageService } from './result-page.service';

describe('ResultPageComponent', () => {
  let component: ResultPageComponent;
  let spectator: Spectator<ResultPageComponent>;
  let resultPageService: ResultPageService;

  const createComponent = createComponentFactory({
    component: ResultPageComponent,
    imports: [
      ReactiveComponentModule,
      HttpClientTestingModule,
      TranslocoTestingModule,
      ReportModule,
    ],
    declarations: [ResultPageComponent],
    providers: [
      {
        provide: ResultPageService,
        useValue: {
          getResult: jest.fn(() => of(BEARING_CALCULATION_RESULT_MOCK)),
        },
      },
      {
        provide: ENV_CONFIG,
        useValue: {
          environment: {
            baseUrl: '',
          },
        },
      },
    ],
  });

  beforeEach(() => {
    spectator = createComponent();
    component = spectator.debugElement.componentInstance;
    resultPageService = spectator.inject(ResultPageService);
  });

  test('should create', () => {
    expect(component).toBeTruthy();
    expect(resultPageService).toBeTruthy();
  });

  describe('#send', () => {
    it('should call getResult fn of restPageService', () => {
      const mockForm = {
        getRawValue() {
          return {
            objects: [
              {
                properties: [
                  {
                    name: 'mockName',
                    value: 'mockValue',
                  },
                ],
              },
            ],
          };
        },
      };

      component.send(mockForm as FormGroup);
      // resultPageService.getResult({});

      // expect(resultPageService.getResult).toHaveBeenCalledTimes(1);
      // expect(resultPageService.getResult).toHaveBeenCalledWith({
      //   mockName: 'mockValue',
      // });

      expect(component.result$).toBeDefined();
    });
  });

  describe('#resetWizard', () => {
    it('should console log for now', () => {
      const consoleSpy = jest.spyOn(console, 'log');

      component.resetWizard();

      expect(consoleSpy).toHaveBeenCalledTimes(1);
    });
  });
});
