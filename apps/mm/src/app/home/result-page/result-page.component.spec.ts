import { HttpClientTestingModule } from '@angular/common/http/testing';
import { FormGroup } from '@angular/forms';

import { filter, of, throwError } from 'rxjs';

import { createComponentFactory, Spectator } from '@ngneat/spectator/jest';
import { TranslocoService, TranslocoTestingModule } from '@ngneat/transloco';
import { ReactiveComponentModule } from '@ngrx/component';

import { ENV_CONFIG } from '@schaeffler/http';
import { ReportModule } from '@schaeffler/report';

import { BEARING_CALCULATION_RESULT_MOCK } from '../../../testing/mocks/rest.service.mock';
import { ResultPageComponent } from './result-page.component';
import { ResultPageService } from './result-page.service';
import { SnackBarService } from '@schaeffler/snackbar';

describe('ResultPageComponent', () => {
  let component: ResultPageComponent;
  let spectator: Spectator<ResultPageComponent>;
  let resultPageService: ResultPageService;
  let snackbarService: SnackBarService;

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
          getResult: jest.fn((testVal) =>
            testVal['errorBait']
              ? throwError(() => new Error('sometext'))
              : of(BEARING_CALCULATION_RESULT_MOCK)
          ),
        },
      },
      {
        provide: TranslocoService,
        useValue: {
          translate: jest.fn(() => 'some text'),
        },
      },
      {
        provide: SnackBarService,
        useValue: {
          showErrorMessage: jest.fn((_msg: string) => ({})),
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
    snackbarService = spectator.inject(SnackBarService);
    const location: Location = window.location;
    delete window.location;
    window.location = {
      ...location,
      reload: jest.fn(),
    };
  });

  test('should create', () => {
    expect(component).toBeTruthy();
    expect(resultPageService).toBeTruthy();
    expect(snackbarService).toBeTruthy();
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

    it('should display a snackbar error msg if the restPageService throws an error', () => {
      const mockForm = {
        getRawValue() {
          return {
            objects: [
              {
                properties: [
                  {
                    name: 'errorBait',
                    value: 'properlyBadValue',
                  },
                ],
              },
            ],
          };
        },
      };
      const resultSpy = jest.spyOn(component['resultPageService'], 'getResult');
      const snackSpy = jest.spyOn(
        component['snackbarService'],
        'showErrorMessage'
      );
      component.send(mockForm as FormGroup);

      component.error$.pipe(filter((val) => val)).subscribe(() => {
        expect(snackSpy).toHaveBeenCalled();
      });
      expect(resultSpy).toHaveBeenCalled();
    });
  });

  describe('#resetWizard', () => {
    it('should console log for now', () => {
      const reloadSpy = jest.spyOn(window.location, 'reload');

      component.resetWizard();

      expect(reloadSpy).toHaveBeenCalledTimes(1);
    });
  });
});
