import { createServiceFactory, SpectatorService } from '@ngneat/spectator/jest';
import { provideMockStore } from '@ngrx/store/testing';

import { getSelectedBearing } from '../../selectors';
import { BearingSelectionFacade } from './bearing-selection.facade';

describe('BearingSelectionFacade', () => {
  let facade: BearingSelectionFacade;
  let spectator: SpectatorService<BearingSelectionFacade>;

  const createFacade = createServiceFactory({
    service: BearingSelectionFacade,
    providers: [
      provideMockStore({
        selectors: [
          {
            selector: getSelectedBearing,
            value: '6226',
          },
        ],
      }),
    ],
  });

  beforeEach(() => {
    spectator = createFacade();
    facade = spectator.service;
  });

  it('should be created', () => {
    expect(facade).toBeTruthy();
  });

  describe('selectedBearing', () => {
    it('should return the selector value', () => {
      expect(facade.selectedBearing()).toEqual('6226');
    });
  });
});
