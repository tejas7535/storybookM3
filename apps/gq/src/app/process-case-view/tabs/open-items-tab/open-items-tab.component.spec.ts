import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';

import { of } from 'rxjs';

import { ActiveCaseFacade } from '@gq/core/store/active-case/active-case.facade';
import {
  createComponentFactory,
  mockProvider,
  Spectator,
} from '@ngneat/spectator/jest';
import { PushPipe } from '@ngrx/component';
import { MockComponent } from 'ng-mocks';
import { marbles } from 'rxjs-marbles';

import { provideTranslocoTestingModule } from '@schaeffler/transloco/testing';

import { OpenItemsTabComponent } from './open-items-tab.component';
import { OpenItemsTableComponent } from './open-items-table/open-items-table.component';

describe('OpenItemsTabComponent', () => {
  let component: OpenItemsTabComponent;
  let spectator: Spectator<OpenItemsTabComponent>;

  const createComponent = createComponentFactory({
    component: OpenItemsTabComponent,
    imports: [provideTranslocoTestingModule({ en: {} }), PushPipe],
    providers: [
      mockProvider(ActiveCaseFacade, {
        quotationLoading$: of(false),
      }),
    ],
    declarations: [MockComponent(OpenItemsTableComponent)],
    schemas: [CUSTOM_ELEMENTS_SCHEMA],
  });

  beforeEach(() => {
    spectator = createComponent();
    component = spectator.debugElement.componentInstance;
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  test(
    'should provide dataLoading$',
    marbles((m) => {
      m.expect(component.dataLoading$).toBeObservable(
        m.cold('(a|)', { a: false })
      );
    })
  );
});
