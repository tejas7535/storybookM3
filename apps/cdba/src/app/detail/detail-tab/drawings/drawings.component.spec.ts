import { createComponentFactory, Spectator } from '@ngneat/spectator/jest';
import { MockStore, provideMockStore } from '@ngrx/store/testing';
import { MockModule } from 'ng-mocks';

import { selectDrawing } from '@cdba/core/store';
import { Drawing } from '@cdba/core/store/reducers/shared/models';
import { SharedModule } from '@cdba/shared';
import { DETAIL_STATE_MOCK } from '@cdba/testing/mocks';

import { DrawingsTableModule } from './drawings-table/drawings-table.module';
import { DrawingsComponent } from './drawings.component';

describe('DrawingsComponent', () => {
  let component: DrawingsComponent;
  let spectator: Spectator<DrawingsComponent>;

  let store: MockStore;

  const createComponent = createComponentFactory({
    component: DrawingsComponent,
    imports: [SharedModule, MockModule(DrawingsTableModule)],
    providers: [
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
