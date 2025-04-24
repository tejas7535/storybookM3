import { Stub } from '../../../../shared/test/stub.class';
import { ChangeHistoryColumnSettingsService } from './customer-planning-details-change-history-column-settings.service';

describe('ChangeHistoryColumnSettingsService', () => {
  let service: ChangeHistoryColumnSettingsService<any, any>;

  beforeEach(() => {
    service = Stub.get({
      component: ChangeHistoryColumnSettingsService,
      providers: [Stub.getTranslocoLocaleServiceProvider()],
    });
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should define the change history columns', () => {
    expect(service['columnDefinitions'].length).toBe(10);
  });
});
