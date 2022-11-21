import { createServiceFactory, SpectatorService } from '@ngneat/spectator';
import { provideMockStore } from '@ngrx/store/testing';

import { MaterialClass } from '@mac/msd/constants';
import {
  ALUMINUM_STATIC_QUICKFILTERS,
  STEEL_STATIC_QUICKFILTERS,
} from '@mac/msd/main-table/quick-filter/config';
import {
  ALUMINUM_COLUMN_DEFINITIONS,
  STEEL_COLUMN_DEFINITIONS,
} from '@mac/msd/main-table/table-config/materials';
import { DataFacade } from '@mac/msd/store/facades/data';
import { initialState } from '@mac/msd/store/reducers/data/data.reducer';

import { MsdAgGridConfigService } from './msd-ag-grid-config.service';

describe('MsdAgGridConfigService', () => {
  let spectator: SpectatorService<MsdAgGridConfigService>;
  let service: MsdAgGridConfigService;
  let dataFacade: DataFacade;

  const createService = createServiceFactory({
    service: MsdAgGridConfigService,
    providers: [
      provideMockStore({
        initialState: {
          msd: {
            data: initialState,
          },
        },
      }),
      DataFacade,
    ],
  });

  beforeEach(() => {
    spectator = createService();
    service = spectator.inject(MsdAgGridConfigService);
    dataFacade = spectator.inject(DataFacade);
    dataFacade.dispatch = jest.fn();
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  describe('getDefaultColumnDefinitions', () => {
    it.each([
      [MaterialClass.ALUMINUM, ALUMINUM_COLUMN_DEFINITIONS],
      [MaterialClass.STEEL, STEEL_COLUMN_DEFINITIONS],
      [undefined, undefined],
    ])(
      'should return the default column definitions for %p',
      (materialClass, expected) => {
        const result = service.getDefaultColumnDefinitions(materialClass);

        expect(result).toEqual(expected);
      }
    );
  });

  describe('getStaticQuickFilters', () => {
    it.each([
      [MaterialClass.ALUMINUM, ALUMINUM_STATIC_QUICKFILTERS],
      [MaterialClass.STEEL, STEEL_STATIC_QUICKFILTERS],
      [undefined, undefined],
    ])(
      'should return the static quick filters for %p',
      (materialClass, expected) => {
        const result = service.getStaticQuickFilters(materialClass);

        expect(result).toEqual(expected);
      }
    );
  });
});
