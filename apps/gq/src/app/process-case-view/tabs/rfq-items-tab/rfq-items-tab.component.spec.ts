import { of } from 'rxjs';

import { ActiveCaseFacade } from '@gq/core/store/active-case/active-case.facade';
import { createComponentFactory, Spectator } from '@ngneat/spectator/jest';
import { MockBuilder } from 'ng-mocks';
import { marbles } from 'rxjs-marbles';

import { RfqItemsTabComponent } from './rfq-items-tab.component';

describe('RfqItemsTabComponent', () => {
  let component: RfqItemsTabComponent;
  let spectator: Spectator<RfqItemsTabComponent>;

  const dependencies = MockBuilder(RfqItemsTabComponent)
    .mock(ActiveCaseFacade, {
      quotationLoading$: of(false),
    })
    .build();

  const createComponent = createComponentFactory({
    component: RfqItemsTabComponent,
    ...dependencies,
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
