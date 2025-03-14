import { mockProvider } from '@ngneat/spectator/jest';

import { AlertService } from '../../feature/alerts/alert.service';
import { SelectableOptionsService } from '../../shared/services/selectable-options.service';
import { Stub } from '../../shared/test/stub.class';
import { OverviewComponent } from './overview.component';

describe('OverviewComponent', () => {
  let component: OverviewComponent;

  beforeEach(() => {
    component = Stub.get<OverviewComponent>({
      component: OverviewComponent,
      providers: [
        mockProvider(AlertService),
        mockProvider(SelectableOptionsService, {
          get: jest.fn().mockReturnValue({
            options: [],
            loading: false,
            loadingError: null,
          }),
        }),
      ],
    });
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should compute the filters for the priority grid', () => {
    const overviewComponent = component;
    overviewComponent['overviewFilterValue'].set({
      gkams: [{ id: 'gkam-id', text: 'gkam-name' }],
      customers: [{ id: 'customer-id', text: 'customer-name' }],
    });
    expect(overviewComponent['gkamFilterIds']()).toEqual(['gkam-id']);
    expect(overviewComponent['customerFilterIds']()).toEqual(['customer-id']);
  });
});
