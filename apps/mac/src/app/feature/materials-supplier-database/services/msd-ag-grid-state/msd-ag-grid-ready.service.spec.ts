import { createServiceFactory, SpectatorService } from '@ngneat/spectator';
import { ColumnApi, GridApi } from 'ag-grid-enterprise';

import { MsdAgGridReadyService } from './msd-ag-grid-ready.service';

describe('MsdAgGridStateService', () => {
  let spectator: SpectatorService<MsdAgGridReadyService>;
  let service: MsdAgGridReadyService;

  const createService = createServiceFactory({
    service: MsdAgGridReadyService,
  });

  beforeEach(() => {
    spectator = createService();
    service = spectator.inject(MsdAgGridReadyService);
  });

  test('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('subscribe should subscribe to updates', () => {
    let fail = true;
    service.agGridApi.subscribe(() => (fail = false));
    service.agGridApiready({} as GridApi, {} as ColumnApi);
    expect(fail).toBe(false);
  });
});
