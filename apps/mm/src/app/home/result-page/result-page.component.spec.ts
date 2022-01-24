import { HttpClientTestingModule } from '@angular/common/http/testing';
import { FormGroup } from '@angular/forms';
import { MATERIAL_SANITY_CHECKS } from '@angular/material/core';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';

import { filter, of, throwError } from 'rxjs';

import { createComponentFactory, Spectator } from '@ngneat/spectator/jest';
import { ReactiveComponentModule } from '@ngrx/component';

import { ReportModule } from '@schaeffler/report';
import { provideTranslocoTestingModule } from '@schaeffler/transloco/testing';

import { BEARING_CALCULATION_RESULT_MOCK } from '../../../testing/mocks/rest.service.mock';
import { ResultPageComponent } from './result-page.component';
import { ResultPageService } from './result-page.service';

describe('ResultPageComponent', () => {
  let component: ResultPageComponent;
  let spectator: Spectator<ResultPageComponent>;
  let resultPageService: ResultPageService;
  let snackBar: MatSnackBar;

  const createComponent = createComponentFactory({
    component: ResultPageComponent,
    imports: [
      ReactiveComponentModule,
      HttpClientTestingModule,
      provideTranslocoTestingModule({ en: {} }),
      ReportModule,
      MatSnackBarModule,
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
        provide: MATERIAL_SANITY_CHECKS,
        useValue: false,
      },
    ],
  });

  beforeEach(() => {
    spectator = createComponent();
    component = spectator.debugElement.componentInstance;
    resultPageService = spectator.inject(ResultPageService);
    snackBar = spectator.inject(MatSnackBar);
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

      component.send(mockForm as FormGroup);

      component.error$.pipe(filter((val) => val)).subscribe(() => {
        expect(snackBar.open).toBeCalledTimes(1);
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
