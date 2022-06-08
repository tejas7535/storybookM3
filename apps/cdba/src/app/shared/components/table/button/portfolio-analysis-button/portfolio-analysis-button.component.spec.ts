import { MatButtonModule } from '@angular/material/button';
import { MatTooltipModule } from '@angular/material/tooltip';
import { Router } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';

import { createComponentFactory, Spectator } from '@ngneat/spectator/jest';
import { LetModule } from '@ngrx/component';
import { provideMockStore } from '@ngrx/store/testing';
import { MockModule } from 'ng-mocks';
import { marbles } from 'rxjs-marbles';

import { provideTranslocoTestingModule } from '@schaeffler/transloco/testing';

import { DETAIL_STATE_MOCK } from '@cdba/testing/mocks';

import { PortfolioAnalysisButtonComponent } from './portfolio-analysis-button.component';

describe('PortfolioAnalysisButtonComponent', () => {
  let spectator: Spectator<PortfolioAnalysisButtonComponent>;
  let component: PortfolioAnalysisButtonComponent;
  let router: Router;

  const createComponent = createComponentFactory({
    component: PortfolioAnalysisButtonComponent,
    imports: [
      MockModule(LetModule),
      MockModule(MatButtonModule),
      MockModule(MatTooltipModule),
      RouterTestingModule,
      provideTranslocoTestingModule({ en: {} }),
    ],
    providers: [
      provideMockStore({
        initialState: {
          search: {
            referenceTypes: {
              selectedNodeIds: ['2', '4'],
            },
          },
          detail: DETAIL_STATE_MOCK,
        },
      }),
    ],
  });

  beforeEach(() => {
    spectator = createComponent();
    component = spectator.component;

    router = spectator.inject(Router);

    router.navigate = jest.fn();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  describe('ngOnInit', () => {
    it(
      'should init with search selector',
      marbles((m) => {
        router.routerState.snapshot.url = '/results';

        component.ngOnInit();

        m.expect(component.selectedNodeIds$).toBeObservable(
          m.cold('a', {
            a: ['2', '4'],
          })
        );
      })
    );

    it(
      'should init with detail selector',
      marbles((m) => {
        router.routerState.snapshot.url = '/detail/detail';

        component.ngOnInit();

        m.expect(component.selectedNodeIds$).toBeObservable(
          m.cold('a', {
            a: DETAIL_STATE_MOCK.calculations.selectedNodeIds,
          })
        );
      })
    );
  });
});
