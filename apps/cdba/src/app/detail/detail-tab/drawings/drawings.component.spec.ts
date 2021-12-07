import { selectDrawing } from '@cdba/core/store';
import { ENV, getEnv } from '@cdba/environments/environment.provider';
import { LoadingSpinnerModule } from '@cdba/shared/components';
import { Drawing } from '@cdba/shared/models';
import { MaterialNumberModule } from '@cdba/shared/pipes';
import { DETAIL_STATE_MOCK } from '@cdba/testing/mocks';
import { createComponentFactory, Spectator } from '@ngneat/spectator/jest';
import { ReactiveComponentModule } from '@ngrx/component';
import { MockStore, provideMockStore } from '@ngrx/store/testing';
import { MockModule } from 'ng-mocks';

import { UnderConstructionModule } from '@schaeffler/empty-states';
import { provideTranslocoTestingModule } from '@schaeffler/transloco/testing';

import { DrawingsComponent } from './drawings.component';
import { DrawingsTableModule } from './drawings-table/drawings-table.module';

describe('DrawingsComponent', () => {
  let component: DrawingsComponent;
  let spectator: Spectator<DrawingsComponent>;

  let store: MockStore;

  const createComponent = createComponentFactory({
    component: DrawingsComponent,
    imports: [
      ReactiveComponentModule,
      provideTranslocoTestingModule({ en: {} }),
      MockModule(LoadingSpinnerModule),
      MaterialNumberModule,
      UnderConstructionModule,
      MockModule(DrawingsTableModule),
    ],
    providers: [
      { provide: ENV, useValue: { ...getEnv() } },
      provideMockStore({
        initialState: {
          detail: DETAIL_STATE_MOCK,
        },
      }),
    ],
  });

  beforeEach(() => {
    spectator = createComponent();
    component = spectator.component;

    store = spectator.inject(MockStore);
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  describe('selectDrawing', () => {
    it('should dispatch selectDrawing Action', () => {
      store.dispatch = jest.fn();
      const event = {
        nodeId: '5',
        drawing: new Drawing(
          'Pivot element hydr.',
          'EDD',
          'Delivery Document',
          '00',
          'F-46400.03',
          'C00',
          'FR',
          'Released',
          new Date('2096-04-18'),
          'EDD_F-46400_03_E00_00.tif',
          'TIF',
          'http://foo.bar'
        ),
      };
      component.selectDrawing(event);

      const expected = selectDrawing(event);

      expect(store.dispatch).toHaveBeenCalledWith(expected);
    });
  });
});
