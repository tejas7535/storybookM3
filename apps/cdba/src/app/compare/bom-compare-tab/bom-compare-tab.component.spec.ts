import { createComponentFactory, Spectator } from '@ngneat/spectator/jest';
import { provideMockStore } from '@ngrx/store/testing';
import { MockModule } from 'ng-mocks';

import { provideTranslocoTestingModule } from '@schaeffler/transloco';

import { SharedModule } from '@cdba/shared';
import { BomTableModule } from '@cdba/shared/components';
import { COMPARE_STATE_MOCK } from '@cdba/testing/mocks';

import { BomCompareTabComponent } from './bom-compare-tab.component';

describe('BomCompareTabComponent', () => {
  let component: BomCompareTabComponent;
  let spectator: Spectator<BomCompareTabComponent>;

  const createComponent = createComponentFactory({
    component: BomCompareTabComponent,
    imports: [
      provideTranslocoTestingModule({}),
      SharedModule,
      MockModule(BomTableModule),
    ],
    providers: [
      provideMockStore({ initialState: { compare: COMPARE_STATE_MOCK } }),
    ],
  });

  beforeEach(() => {
    spectator = createComponent();
    component = spectator.component;
  });

  test('should create', () => {
    expect(component).toBeTruthy();
  });
});
