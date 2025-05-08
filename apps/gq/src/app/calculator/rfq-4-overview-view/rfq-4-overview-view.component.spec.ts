import {
  createComponentFactory,
  mockProvider,
  Spectator,
} from '@ngneat/spectator/jest';
import { MockModule } from 'ng-mocks';

import { provideTranslocoTestingModule } from '@schaeffler/transloco/testing';

import { Rfq4OverviewModule } from './rfq-4-overview.module';
import { Rfq4OverviewViewComponent } from './rfq-4-overview-view.component';
import { Rfq4OverviewFacade } from './store/rfq-4-overview.facade';

describe('Rfq-4OverviewViewComponent', () => {
  let component: Rfq4OverviewViewComponent;
  let spectator: Spectator<Rfq4OverviewViewComponent>;

  const createComponent = createComponentFactory({
    component: Rfq4OverviewViewComponent,
    imports: [
      MockModule(Rfq4OverviewModule),
      provideTranslocoTestingModule({ en: {} }),
    ],
    providers: [
      mockProvider(Rfq4OverviewFacade, {
        loadItemsForView: jest.fn(),
      }),
    ],
    detectChanges: false,
  });
  beforeEach(() => {
    spectator = createComponent();
    component = spectator.component;
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  describe('onViewToggle', () => {
    test('should call loadItemsForView with the view id', () => {
      const viewId = 1;
      const view = { id: viewId } as any;
      component['rfq4Facade'].loadItemsForView = jest.fn();

      component.onViewToggle(view);

      expect(component['rfq4Facade'].loadItemsForView).toHaveBeenCalledWith(
        viewId
      );
    });
  });
});
