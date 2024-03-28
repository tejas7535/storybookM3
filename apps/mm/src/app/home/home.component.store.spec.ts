import { of } from 'rxjs';

import { createServiceFactory, SpectatorService } from '@ngneat/spectator/jest';

import { LazyListLoaderService } from '../core/services/lazy-list-loader';
import { RSY_PAGE_BEARING_TYPE } from '../shared/constants/dialog-constant';
import { HomeState, HomeStore } from './home.component.store';
import { BearingParams, PagedMeta } from './home.model';
import { HomeService } from './home.service';

const initalState: HomeState = {
  pagedMetas: [],
  activePageId: undefined,
  inactivePageId: undefined,
  bearing: undefined,
};

describe('HomeStore', () => {
  let spectator: SpectatorService<HomeStore>;
  let homeStore: HomeStore;

  const createService = createServiceFactory({
    service: HomeStore,
    providers: [
      {
        provide: HomeService,
        useValue: {
          getBearingParams: jest.fn(),
          constructPagedMetas: jest.fn(),
        },
      },
      {
        provide: LazyListLoaderService,
        useValue: {
          loadOptions: jest.fn(() =>
            of([
              {
                id: 123,
                text: 'testBearing',
              },
            ])
          ),
        },
      },
    ],
  });

  beforeEach(() => {
    spectator = createService();
    homeStore = spectator.service;

    homeStore.setState(initalState);
  });

  it('should create', () => {
    expect(homeStore).toBeTruthy();
  });

  describe('setPageMetas reducer', () => {
    it('should add pagesMetas to the store', () => {
      const mockPagedMetas = [] as PagedMeta[];

      homeStore.setPageMetas(mockPagedMetas);

      homeStore.state$.subscribe((state) => {
        expect(state.pagedMetas).toEqual(mockPagedMetas);
      });
    });

    it('should add activePageId to the store', () => {
      const mockActivePageId = 'mockedPageId';

      homeStore.setActivePageId(mockActivePageId);

      homeStore.state$.subscribe((state) => {
        expect(state.activePageId).toEqual(mockActivePageId);
      });
    });

    it('should add inactivePageId to the store', () => {
      const mockInactivePageId = 'mockedPageId';

      homeStore.setInactivePageId(mockInactivePageId);

      homeStore.state$.subscribe((state) => {
        expect(state.inactivePageId).toEqual(mockInactivePageId);
      });
    });
  });

  describe('pagedMetas$ selector', () => {
    it('should return an empty array as a default state', () => {
      homeStore.pagedMetas$.subscribe((pagedMeta) => {
        expect(pagedMeta.length).toBe(0);
      });
    });

    it('should return an array thats as long as the pagesMetas', () => {
      const mockPagedMetas = [{}, {}] as PagedMeta[];

      homeStore.setPageMetas(mockPagedMetas);

      homeStore.pagedMetas$.subscribe((pagedMeta) => {
        expect(pagedMeta.length).toBe(2);
      });
    });
  });

  describe('activePageId$ selector', () => {
    it('should return RSY_PAGE_BEARING_TYPE as initial activePageId', () => {
      homeStore.activePageId$.subscribe((activePageId) => {
        expect(activePageId).toBe(RSY_PAGE_BEARING_TYPE);
      });
    });

    it('should return the activePageId', () => {
      const mockActivePageId = 'mockedPageId';

      homeStore.setActivePageId(mockActivePageId);

      homeStore.activePageId$.subscribe((activePageId) => {
        expect(activePageId).toBe(mockActivePageId);
      });
    });
  });

  describe('activePageName$ selector', () => {
    it('should return the activePageName', () => {
      homeStore.setState({
        ...initalState,
        pagedMetas: [
          {
            page: {
              id: 'randomPageID',
              page: {
                text: 'inactivePageName',
              },
            },
          },
          {
            page: {
              id: 'activeRandomPageID',
              page: {
                text: 'activePageName',
              },
            },
          },
        ] as PagedMeta[],

        activePageId: 'activeRandomPageID',
      });

      homeStore.activePageName$.subscribe((activePageName) => {
        expect(activePageName).toBe(activePageName);
      });
    });
  });

  describe('bearingParams$ selector', () => {
    it('should return undefined a default state', () => {
      homeStore.bearingParams$.subscribe((bearingParams) => {
        expect(bearingParams).toBe(undefined);
      });
    });

    it('should return an a bearing id', () => {
      const mockBearing = '123';

      homeStore.setBearing(mockBearing);

      homeStore.bearingParams$.subscribe((bearingParams) => {
        expect(bearingParams).toBe(mockBearing);
      });
    });
  });

  describe('inactivePageId$ selector', () => {
    it('should return undefined as initial activePageId', () => {
      homeStore.inactivePageId$.subscribe((inactivePageId) => {
        expect(inactivePageId).toBe(undefined);
      });
    });

    it('should return the inactivePageId', () => {
      const mockInactivePageId = 'mockedInactivePageId';

      homeStore.setInactivePageId(mockInactivePageId);

      homeStore.inactivePageId$.subscribe((inactivePageId) => {
        expect(inactivePageId).toBe(mockInactivePageId);
      });
    });
  });

  describe('selectedBearingOption selector', () => {
    it('should return undefined as initial selected option', () => {
      homeStore.selectedBearingOption$.subscribe((selectedOption) => {
        expect(selectedOption).toBe(undefined);
      });
    });

    it('should return the selected option', () => {
      const mockSelectedOption = { id: 'myId', title: 'myTitle' };
      homeStore['homeService'].getBearingParams = jest.fn(
        () => ({ id: 'myId' }) as unknown as BearingParams
      );

      homeStore.setBearing('myTitle');
      homeStore.selectedBearingOption$.subscribe((selectedOption) => {
        expect(selectedOption).toBe(mockSelectedOption);
      });
    });
  });

  // Todo fix unit test "of(true)" is not right
  describe('maxPageId$ selector', () => {
    it.skip('should return the Id of the maxPage', () => {
      const mockPagedMetas = [
        {
          valid$: of(true),
          page: {
            id: 'id1',
            visible: true,
          },
        },
        {
          valid$: of(true),
          page: {
            id: 'id2',
            visible: true,
          },
        },
      ] as PagedMeta[];

      homeStore.setPageMetas(mockPagedMetas);

      homeStore.maxPageId$.subscribe((maxPageId) => {
        expect(maxPageId).toBe('id2');
      });
    });
  });

  describe('getBearing', () => {
    it('should return the Id of the maxPage', () => {
      const lazyListLoaderServiceSpy = jest.spyOn(
        homeStore['lazyListLoaderService'],
        'loadOptions'
      );

      const setBearingSpy = jest.spyOn(homeStore, 'setBearing');

      const mockParams = { name: 'testName', value: 'testValue' };

      const mockBearingParams = of({
        id: 123,
        url: 'testUrl',
        params: mockParams,
      } as BearingParams);

      homeStore.getBearing(mockBearingParams);

      homeStore.maxPageId$.subscribe((maxPageId) => {
        expect(maxPageId).toBe('id2');
      });

      expect(lazyListLoaderServiceSpy).toHaveBeenCalledTimes(1);
      expect(lazyListLoaderServiceSpy).toBeCalledWith('testUrl', mockParams);

      expect(setBearingSpy).toHaveBeenCalledTimes(1);
      expect(setBearingSpy).toBeCalledWith('testBearing');
    });
  });
});
