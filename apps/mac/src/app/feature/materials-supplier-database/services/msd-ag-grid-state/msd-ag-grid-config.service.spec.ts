import { of, Subject } from 'rxjs';

import { createServiceFactory, SpectatorService } from '@ngneat/spectator';
import { provideMockStore } from '@ngrx/store/testing';

import { MaterialClass, NavigationLevel } from '@mac/msd/constants';
import { STATIC_QUICKFILTERS_MAPPING } from '@mac/msd/main-table/quick-filter/config';
import { COLUMN_DEFINITIONS_MAPPING } from '@mac/msd/main-table/table-config/materials';
import { EDITOR_COLUMN_DEFINITIONS } from '@mac/msd/main-table/table-config/materials/base';
import { DataFacade } from '@mac/msd/store/facades/data';
import { initialState } from '@mac/msd/store/reducers/data/data.reducer';

import { MsdAgGridConfigService } from './msd-ag-grid-config.service';
import { MsdAgGridStateService } from './msd-ag-grid-state.service';

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
      {
        provide: DataFacade,
        useValue: {
          navigation$: of({
            materialClass: MaterialClass.STEEL,
            navigationLevel: NavigationLevel.MATERIAL,
          }),
          hasEditorRole$: of(true),
          dispatch: jest.fn(),
        },
      },
      {
        provide: MsdAgGridStateService,
        useValue: {
          getColumnState: jest.fn(() => []),
        },
      },
    ],
  });

  beforeEach(() => {
    spectator = createService();
    service = spectator.inject(MsdAgGridConfigService);
    dataFacade = spectator.inject(DataFacade);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  describe('init', () => {
    it('should call nex of subject on navigation', () => {
      const mockNavigation = new Subject<{
        materialClass: MaterialClass;
        navigationLevel: NavigationLevel;
      }>();
      dataFacade.navigation$ = mockNavigation;
      service.getDefaultColumnDefinitions = jest.fn(() => []);
      service.columnDefinitions$.next = jest.fn();

      service['init']();
      mockNavigation.next({
        materialClass: MaterialClass.ALUMINUM,
        navigationLevel: NavigationLevel.SUPPLIER,
      });

      expect(service.getDefaultColumnDefinitions).toHaveBeenCalledWith(
        MaterialClass.ALUMINUM,
        NavigationLevel.SUPPLIER
      );
      expect(service.columnDefinitions$.next).toHaveBeenCalledWith({
        defaultColumnDefinitions: [],
        savedColumnState: [],
      });
    });
  });

  describe('getDefaultColumnDefinitions', () => {
    beforeEach(() => (service['hasEditorRole'] = false));
    it.each([
      [
        MaterialClass.ALUMINUM,
        NavigationLevel.MATERIAL,
        COLUMN_DEFINITIONS_MAPPING.materials[MaterialClass.ALUMINUM][
          NavigationLevel.MATERIAL
        ],
      ],
      [
        MaterialClass.ALUMINUM,
        NavigationLevel.SUPPLIER,
        COLUMN_DEFINITIONS_MAPPING.materials[MaterialClass.ALUMINUM][
          NavigationLevel.SUPPLIER
        ],
      ],
      [
        MaterialClass.ALUMINUM,
        NavigationLevel.STANDARD,
        COLUMN_DEFINITIONS_MAPPING.materials[MaterialClass.ALUMINUM][
          NavigationLevel.STANDARD
        ],
      ],
      [
        MaterialClass.POLYMER,
        NavigationLevel.MATERIAL,
        COLUMN_DEFINITIONS_MAPPING.materials[MaterialClass.POLYMER][
          NavigationLevel.MATERIAL
        ],
      ],
      [
        MaterialClass.POLYMER,
        NavigationLevel.SUPPLIER,
        COLUMN_DEFINITIONS_MAPPING.materials[MaterialClass.POLYMER][
          NavigationLevel.SUPPLIER
        ],
      ],
      [
        MaterialClass.POLYMER,
        NavigationLevel.STANDARD,
        COLUMN_DEFINITIONS_MAPPING.materials[MaterialClass.POLYMER][
          NavigationLevel.STANDARD
        ],
      ],
      [
        MaterialClass.STEEL,
        NavigationLevel.MATERIAL,
        COLUMN_DEFINITIONS_MAPPING.materials[MaterialClass.STEEL][
          NavigationLevel.MATERIAL
        ],
      ],
      [
        MaterialClass.STEEL,
        NavigationLevel.SUPPLIER,
        COLUMN_DEFINITIONS_MAPPING.materials[MaterialClass.STEEL][
          NavigationLevel.SUPPLIER
        ],
      ],
      [
        MaterialClass.STEEL,
        NavigationLevel.STANDARD,
        COLUMN_DEFINITIONS_MAPPING.materials[MaterialClass.STEEL][
          NavigationLevel.STANDARD
        ],
      ],
    ])(
      'should return the default column definitions for %p',
      (materialClass, navigationLevel, expected) => {
        const result = service.getDefaultColumnDefinitions(
          materialClass,
          navigationLevel
        );

        expect(result).toEqual(expected);
      }
    );

    // special cases with editor columns
    it('should return the default column definitions including editor rights', () => {
      service['hasEditorRole'] = true;
      const result = service.getDefaultColumnDefinitions(
        MaterialClass.ALUMINUM,
        NavigationLevel.MATERIAL
      );
      // const expected = COLUMN_DEFINITIONS_MAPPING.materials[MaterialClass.ALUMINUM][NavigationLevel.MATERIAL];
      expect(result).toContain(EDITOR_COLUMN_DEFINITIONS[0]);
    });
  });

  describe('isEditable', () => {
    it.each([
      [true, MaterialClass.STEEL, true],
      [true, MaterialClass.ALUMINUM, true],
      [true, MaterialClass.POLYMER, false],
      [false, MaterialClass.STEEL, false],
      [false, MaterialClass.ALUMINUM, false],
      [false, MaterialClass.POLYMER, false],
    ])(
      'should be editable with editor[%p] and materialClass [%p] = %p',
      (editorRole, materialClass, expected) => {
        service['hasEditorRole'] = editorRole;
        expect(service['isEditable'](materialClass)).toBe(expected);
      }
    );
  });

  describe('getStaticQuickFilters', () => {
    it.each([
      [
        undefined,
        undefined,
        STATIC_QUICKFILTERS_MAPPING.materials[MaterialClass.STEEL][
          NavigationLevel.MATERIAL
        ],
      ],
      [
        MaterialClass.ALUMINUM,
        NavigationLevel.MATERIAL,
        STATIC_QUICKFILTERS_MAPPING.materials[MaterialClass.ALUMINUM][
          NavigationLevel.MATERIAL
        ],
      ],
      [
        MaterialClass.ALUMINUM,
        NavigationLevel.SUPPLIER,
        STATIC_QUICKFILTERS_MAPPING.materials[MaterialClass.ALUMINUM][
          NavigationLevel.SUPPLIER
        ],
      ],
      [
        MaterialClass.ALUMINUM,
        NavigationLevel.STANDARD,
        STATIC_QUICKFILTERS_MAPPING.materials[MaterialClass.ALUMINUM][
          NavigationLevel.STANDARD
        ],
      ],
      [
        MaterialClass.POLYMER,
        NavigationLevel.MATERIAL,
        STATIC_QUICKFILTERS_MAPPING.materials[MaterialClass.POLYMER][
          NavigationLevel.MATERIAL
        ],
      ],
      [
        MaterialClass.POLYMER,
        NavigationLevel.SUPPLIER,
        STATIC_QUICKFILTERS_MAPPING.materials[MaterialClass.POLYMER][
          NavigationLevel.SUPPLIER
        ],
      ],
      [
        MaterialClass.POLYMER,
        NavigationLevel.STANDARD,
        STATIC_QUICKFILTERS_MAPPING.materials[MaterialClass.POLYMER][
          NavigationLevel.STANDARD
        ],
      ],
      [
        MaterialClass.STEEL,
        NavigationLevel.MATERIAL,
        STATIC_QUICKFILTERS_MAPPING.materials[MaterialClass.STEEL][
          NavigationLevel.MATERIAL
        ],
      ],
      [
        MaterialClass.STEEL,
        NavigationLevel.SUPPLIER,
        STATIC_QUICKFILTERS_MAPPING.materials[MaterialClass.STEEL][
          NavigationLevel.SUPPLIER
        ],
      ],
      [
        MaterialClass.STEEL,
        NavigationLevel.STANDARD,
        STATIC_QUICKFILTERS_MAPPING.materials[MaterialClass.STEEL][
          NavigationLevel.STANDARD
        ],
      ],
    ])(
      'should return the static quick filters for %p',
      (materialClass, navigationLevel, expected) => {
        const result = service.getStaticQuickFilters(
          materialClass,
          navigationLevel
        );

        expect(result).toEqual(expected);
      }
    );
  });
});
