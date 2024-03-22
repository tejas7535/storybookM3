import { createServiceFactory, SpectatorService } from '@ngneat/spectator/jest';

import { CasesResultTableComponent } from './cases-result-table.component';

describe('CasesResultTableComponent', () => {
  let component: CasesResultTableComponent;
  let spectator: SpectatorService<CasesResultTableComponent>;

  const createService = createServiceFactory({
    service: CasesResultTableComponent,
  });

  beforeEach(() => {
    spectator = createService();
    component = spectator.inject(CasesResultTableComponent);
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
  });
});
