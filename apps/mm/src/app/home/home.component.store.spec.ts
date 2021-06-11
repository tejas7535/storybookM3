import { of } from 'rxjs';

import { RSY_PAGE_BEARING_TYPE } from '../shared/constants/dialog-constant';
import { HomeStore } from './home.component.store';
import { PagedMeta } from './home.model';
import { HomeService } from './home.service';

describe('HomeStore', () => {
  describe('setPageMetas reducer', () => {
    it('should add pagesMetas to the store', () => {
      const homeStore = new HomeStore(new HomeService());
      homeStore.setState({
        pagedMetas: [],
        activePageId: undefined,
        inactivePageId: undefined,
      });

      const mockPagedMetas = [] as PagedMeta[];

      homeStore.setPageMetas(mockPagedMetas);

      homeStore.state$.subscribe((state) => {
        expect(state.pagedMetas).toEqual(mockPagedMetas);
      });
    });

    it('should add activePageId to the store', () => {
      const homeStore = new HomeStore(new HomeService());
      homeStore.setState({
        pagedMetas: [],
        activePageId: undefined,
        inactivePageId: undefined,
      });

      const mockActivePageId = 'mockedPageId';

      homeStore.setActivePageId(mockActivePageId);

      homeStore.state$.subscribe((state) => {
        expect(state.activePageId).toEqual(mockActivePageId);
      });
    });

    it('should add inactivePageId to the store', () => {
      const homeStore = new HomeStore(new HomeService());
      homeStore.setState({
        pagedMetas: [],
        activePageId: undefined,
        inactivePageId: undefined,
      });

      const mockInactivePageId = 'mockedPageId';

      homeStore.setInactivePageId(mockInactivePageId);

      homeStore.state$.subscribe((state) => {
        expect(state.inactivePageId).toEqual(mockInactivePageId);
      });
    });
  });

  describe('pagedMetas$ selector', () => {
    it('should return an empty array as a default state', () => {
      const homeStore = new HomeStore(new HomeService());
      homeStore.pagedMetas$.subscribe((pagedMeta) => {
        expect(pagedMeta.length).toBe(0);
      });
    });

    it('should return an array thats as long as the pagesMetas', () => {
      const homeStore = new HomeStore(new HomeService());
      homeStore.setState({
        pagedMetas: [],
        activePageId: undefined,
        inactivePageId: undefined,
      });

      const mockPagedMetas = [{}, {}] as PagedMeta[];

      homeStore.setPageMetas(mockPagedMetas);

      homeStore.pagedMetas$.subscribe((pagedMeta) => {
        expect(pagedMeta.length).toBe(2);
      });
    });
  });

  describe('activePageId$ selector', () => {
    it('should return RSY_PAGE_BEARING_TYPE as initial activePageId', () => {
      const homeStore = new HomeStore(new HomeService());
      homeStore.activePageId$.subscribe((activePageId) => {
        expect(activePageId).toBe(RSY_PAGE_BEARING_TYPE);
      });
    });

    it('should return the activePageId', () => {
      const homeStore = new HomeStore(new HomeService());
      homeStore.setState({
        pagedMetas: [],
        activePageId: undefined,
        inactivePageId: undefined,
      });

      const mockActivePageId = 'mockedPageId';

      homeStore.setActivePageId(mockActivePageId);

      homeStore.activePageId$.subscribe((activePageId) => {
        expect(activePageId).toBe(mockActivePageId);
      });
    });
  });

  describe('activePageName$ selector', () => {
    it('should return the activePageName', () => {
      const homeStore = new HomeStore(new HomeService());
      homeStore.setState({
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
        inactivePageId: 'undefined',
      });

      homeStore.activePageName$.subscribe((activePageName) => {
        expect(activePageName).toBe(activePageName);
      });
    });
  });

  describe('inactivePageId$ selector', () => {
    it('should return undefined as initial activePageId', () => {
      const homeStore = new HomeStore(new HomeService());
      homeStore.inactivePageId$.subscribe((inactivePageId) => {
        expect(inactivePageId).toBe(undefined);
      });
    });

    it('should return the inactivePageId', () => {
      const homeStore = new HomeStore(new HomeService());
      homeStore.setState({
        pagedMetas: [],
        activePageId: undefined,
        inactivePageId: 'undefined',
      });

      const mockInactivePageId = 'mockedInactivePageId';

      homeStore.setInactivePageId(mockInactivePageId);

      homeStore.inactivePageId$.subscribe((inactivePageId) => {
        expect(inactivePageId).toBe(mockInactivePageId);
      });
    });
  });

  // Todo fix unit test "of(true)" is not right
  describe('maxPageId$ selector', () => {
    it.skip('should return the Id of the maxPage', () => {
      const homeStore = new HomeStore(new HomeService());
      homeStore.setState({
        pagedMetas: [],
        activePageId: undefined,
        inactivePageId: 'undefined',
      });

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
});
