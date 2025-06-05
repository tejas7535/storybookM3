import { provideHttpClient } from '@angular/common/http';
import { provideHttpClientTesting } from '@angular/common/http/testing';

import {
  createComponentFactory,
  mockProvider,
  Spectator,
} from '@ngneat/spectator/jest';
import { provideMockStore } from '@ngrx/store/testing';

import { provideTranslocoTestingModule } from '@schaeffler/transloco/testing';

import { Rfq4OverviewViewComponent } from './rfq-4-overview-view.component';
import { Rfq4OverviewStore } from './store/rfq-4-overview.store';

describe('Rfq-4-OverviewViewComponent', () => {
  let component: Rfq4OverviewViewComponent;
  let spectator: Spectator<Rfq4OverviewViewComponent>;

  const createComponent = createComponentFactory({
    component: Rfq4OverviewViewComponent,
    imports: [provideTranslocoTestingModule({ en: {} })],
    providers: [
      provideMockStore({
        initialState: {
          router: {
            state: {
              params: {},
            },
          },
        },
      }),
      provideHttpClient(),
      provideHttpClientTesting(),
      mockProvider(Rfq4OverviewStore),
    ],
    detectChanges: false,
  });
  beforeEach(() => {
    spectator = createComponent();
    component = spectator.debugElement.componentInstance;
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  describe('onViewToggle', () => {
    test('should call loadItemsForView with the view id', () => {
      spectator.inject(Rfq4OverviewStore);
      const viewId = 1;
      const view = { id: viewId } as any;
      component['rfq4OverviewStore'].updateActiveTabByViewId = jest.fn();

      component.onViewToggle(view);

      expect(
        component['rfq4OverviewStore'].updateActiveTabByViewId
      ).toHaveBeenCalledWith(viewId);
    });
  });
});
