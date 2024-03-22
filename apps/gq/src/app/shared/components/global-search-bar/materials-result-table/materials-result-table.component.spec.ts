import { createServiceFactory, SpectatorService } from '@ngneat/spectator/jest';

import { MaterialsResultTableComponent } from './materials-result-table.component';

describe('CasesResultTableComponent', () => {
  let component: MaterialsResultTableComponent;
  let spectator: SpectatorService<MaterialsResultTableComponent>;

  const createService = createServiceFactory({
    service: MaterialsResultTableComponent,
  });

  beforeEach(() => {
    spectator = createService();
    component = spectator.inject(MaterialsResultTableComponent);
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
  });
});
