import { MatButtonModule } from '@angular/material/button';
import { MatTooltipModule } from '@angular/material/tooltip';
import { provideRouter, Router } from '@angular/router';

import { createComponentFactory, Spectator } from '@ngneat/spectator/jest';
import { LetDirective } from '@ngrx/component';
import { provideMockStore } from '@ngrx/store/testing';
import { MockDirective, MockModule } from 'ng-mocks';
import { marbles } from 'rxjs-marbles';

import { provideTranslocoTestingModule } from '@schaeffler/transloco/testing';

import { DETAIL_STATE_MOCK } from '@cdba/testing/mocks';

import { CompareButtonComponent } from './compare-button.component';

describe('CompareButtonComponent', () => {
  let spectator: Spectator<CompareButtonComponent>;
  let component: CompareButtonComponent;
  let router: Router;

  const createComponent = createComponentFactory({
    component: CompareButtonComponent,
    imports: [
      MockDirective(LetDirective),
      MockModule(MatButtonModule),
      MockModule(MatTooltipModule),
      provideTranslocoTestingModule({ en: {} }),
    ],
    providers: [
      provideRouter([]),
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

  describe('showCompareView', () => {
    it('should emit showCompareViewEvent', () => {
      const emitSpy = jest.spyOn(component.showCompareViewEvent, 'emit');

      component.showCompareView();

      expect(emitSpy).toHaveBeenCalled();
    });
  });
});
