import { HttpClientTestingModule } from '@angular/common/http/testing';
import { FormGroup } from '@angular/forms';

import { createComponentFactory, Spectator } from '@ngneat/spectator/jest';
import { ReactiveComponentModule } from '@ngrx/component';

import { ResultPageComponent } from './result-page.component';
import { ResultPageService } from './result-page.service';

describe('PictureCardListComponent', () => {
  let component: ResultPageComponent;
  let spectator: Spectator<ResultPageComponent>;
  let resultPageService: ResultPageService;

  const createComponent = createComponentFactory({
    component: ResultPageComponent,
    imports: [ReactiveComponentModule, HttpClientTestingModule],
    declarations: [ResultPageComponent],
    providers: [
      {
        provide: ResultPageService,
        useValue: {
          getResult: jest.fn(),
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
  });

  test('send should call getResult fn of restPageService', () => {
    const mockForm = {
      getRawValue() {
        return {
          objects: [
            {
              properties: [
                {
                  name: 'mockName',
                  value: 'mockvalue',
                },
              ],
            },
          ],
        };
      },
    };

    const mockFormProperties = {
      data: {},
      state: false,
      _links: [
        {
          rel: 'body',
          href: 'bodyLink',
        },
        {
          rel: 'pdf',
          href: 'pdfLink',
        },
      ],
    };

    component.send(mockForm as FormGroup);
    component.result$.subscribe();

    component.result$.subscribe(() => {
      expect(resultPageService.getResult).toHaveBeenCalledTimes(1);
      expect(resultPageService.getResult).toHaveBeenCalledWith(
        mockFormProperties
      );
    });
  });
});
