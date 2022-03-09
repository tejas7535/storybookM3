import { RouterTestingModule } from '@angular/router/testing';

import { ENV, getEnv } from '@cdba/environments/environment.provider';
import { MaterialNumberModule } from '@cdba/shared/pipes';
import { DETAIL_STATE_MOCK, SEARCH_STATE_MOCK } from '@cdba/testing/mocks';
import { createServiceFactory, SpectatorService } from '@ngneat/spectator/jest';
import { provideMockStore } from '@ngrx/store/testing';
import { marbles } from 'rxjs-marbles/jest';

import { Breadcrumb } from '@schaeffler/breadcrumbs';

import { BreadcrumbsService, BreadcrumbState } from './breadcrumbs.service';

describe('BreadcrumbsService', () => {
  let service: BreadcrumbsService;
  let spectator: SpectatorService<BreadcrumbsService>;

  const createService = createServiceFactory({
    service: BreadcrumbsService,
    imports: [RouterTestingModule, MaterialNumberModule],
    providers: [
      { provide: ENV, useValue: { ...getEnv() } },
      provideMockStore({
        initialState: {
          detail: DETAIL_STATE_MOCK,
          search: SEARCH_STATE_MOCK,
        },
      }),
    ],
  });

  beforeEach(() => {
    spectator = createService();
    service = spectator.service;
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  describe('breadcrumbs$', () => {
    it(
      'should remove the url of the last element',
      marbles((m) => {
        service.setState({
          items: [
            {
              label: 'Search',
              url: '/search',
            },
            {
              label: 'Results',
              url: '/results',
            },
            {
              label: 'Detail',
              url: '/detail/detail',
            },
          ],
        });

        const expectedBreadcrumbs = [
          {
            label: 'Search',
            url: '/search',
          },
          {
            label: 'Results',
            url: '/results',
          },
          {
            label: 'Detail',
            url: undefined,
          },
        ];

        m.expect(service.breadcrumbs$).toBeObservable(
          m.cold('a', { a: expectedBreadcrumbs })
        );
      })
    );
  });

  describe('updater methods', () => {
    let expectedState: BreadcrumbState;
    const defaultState: BreadcrumbState = {
      items: [
        {
          label: 'Search',
          url: '/search',
          queryParams: undefined,
        },
      ],
    };

    beforeEach(() => {
      service.setState(defaultState);

      expectedState = undefined;
    });

    describe('setResultsBreadcrumb', () => {
      it(
        'should add new resultsBreadcrumb to items if not existing yet',
        marbles((m) => {
          const resultsBreadcrumb = {
            label: 'Results (330)',
            url: '/results',
          };

          expectedState = { items: [...defaultState.items, resultsBreadcrumb] };

          service.setResultsBreadcrumb(resultsBreadcrumb);

          m.expect(service.state$).toBeObservable(
            m.cold('a', { a: expectedState })
          );
        })
      );
    });

    describe('setPortfolioAnalysisBreadcrumb', () => {
      it(
        'should add new portfolioAnalysis breadcrumb to items if not existing yet',
        marbles((m) => {
          const portfolioAnalysisBreadcrumb = {
            label: 'Portfolio Analysis',
            url: '/portfolio-analysis',
          };

          expectedState = {
            items: [...defaultState.items, portfolioAnalysisBreadcrumb],
          };

          service.setPortfolioAnalysisBreadcrumb(portfolioAnalysisBreadcrumb);

          m.expect(service.state$).toBeObservable(
            m.cold('a', { a: expectedState })
          );
        })
      );
    });

    describe('setDetailBreadcrumb', () => {
      const detailBreadcrumb = {
        label: 'Detail',
        url: '/detail/calculations',
        queryParams: {
          materialNumber: '10000-10-15',
          plant: '0060',
        },
      };
      it(
        'should add new detail breadcrumb if last entry was not for the same page',
        marbles((m) => {
          expectedState = { items: [...defaultState.items, detailBreadcrumb] };

          service.setDetailBreadcrumb(detailBreadcrumb);

          m.expect(service.state$).toBeObservable(
            m.cold('a', { a: expectedState })
          );
        })
      );

      it(
        'should just update the url of the last breadcrumb item if there was already a fitting entry',
        marbles((m) => {
          service.setState({
            items: [
              ...defaultState.items,
              {
                label: 'Detail',
                url: '/detail/detail',
                queryParams: {
                  materialNumber: '10000-10-15',
                  plant: '0060',
                },
              },
            ],
          });

          expectedState = {
            items: [
              ...defaultState.items,
              {
                label: 'Detail',
                url: '/detail/calculations',
                queryParams: {
                  materialNumber: '10000-10-15',
                  plant: '0060',
                },
              },
            ],
          };

          service.setDetailBreadcrumb(detailBreadcrumb);

          m.expect(service.state$).toBeObservable(
            m.cold('a', { a: expectedState })
          );
        })
      );
    });

    describe('updateMaterialDesignation', () => {
      const materialDesignation = 'F-12345';
      it(
        'should update label of detail breadcrumb, if last item is a detail breadcrumb',
        marbles((m) => {
          service.setState({
            items: [...defaultState.items, { label: 'Detail', url: '/detail' }],
          });

          expectedState = {
            items: [
              ...defaultState.items,
              { label: 'F-12345', url: '/detail' },
            ],
          };

          service.updateMaterialDesignation(materialDesignation);

          m.expect(service.state$).toBeObservable(
            m.cold('a', { a: expectedState })
          );
        })
      );

      it(
        'should not update the state, if last item is not a detail breadcrumb',
        marbles((m) => {
          service.updateMaterialDesignation(materialDesignation);

          m.expect(service.state$).toBeObservable(
            m.cold('a', { a: defaultState })
          );
        })
      );
    });

    describe('setCompareBreadcrumb', () => {
      it(
        'should add new compare breadcrumb if last entry was not for the same page',
        marbles((m) => {
          const compareBreadcrumb = { label: 'Compare', url: '/compare' };
          expectedState = { items: [...defaultState.items, compareBreadcrumb] };

          service.setCompareBreadcrumb(compareBreadcrumb);

          m.expect(service.state$).toBeObservable(
            m.cold('a', { a: expectedState })
          );
        })
      );

      it(
        'should just update the url of the last breadcrumb item if there was already a fitting entry',
        marbles((m) => {
          service.setState({
            items: [
              ...defaultState.items,
              {
                label: 'Compare',
                url: '/compare/detail',
                queryParams: {
                  material_number_1: '10000-10-15',
                  material_number_2: '10000-11-13',
                },
              },
            ],
          });

          const compareBreadcrumb = {
            label: 'Compare',
            url: '/compare/bom',
            queryParams: {
              material_number_1: '10000-10-15',
              material_number_2: '10000-11-13',
            },
          };

          expectedState = {
            items: [
              ...defaultState.items,
              {
                label: 'Compare',
                url: '/compare/bom',
                queryParams: {
                  material_number_1: '10000-10-15',
                  material_number_2: '10000-11-13',
                },
              },
            ],
          };

          service.setCompareBreadcrumb(compareBreadcrumb);

          m.expect(service.state$).toBeObservable(
            m.cold('a', { a: expectedState })
          );
        })
      );
    });

    describe('resetBreacrumbItems', () => {
      it(
        'should return initial state',
        marbles((m) => {
          service.setState({
            items: [
              ...defaultState.items,
              {
                label: 'Detail',
                url: '/detail/detail',
                queryParams: {
                  materialNumber: '10000-10-15',
                  plant: '0060',
                },
              },
            ],
          });

          expectedState = {
            items: [
              {
                label: 'shared.breadcrumbs.search',
                url: '/search',
                queryParams: {},
              },
            ],
          };

          service.resetBreadcrumbItems(true);

          m.expect(service.state$).toBeObservable(
            m.cold('a', { a: expectedState })
          );
        })
      );
    });
  });

  describe('addBreadcrumb', () => {
    let state: BreadcrumbState;
    let breadcrumb: Breadcrumb;
    let updatedState: BreadcrumbState;

    beforeEach(() => {
      state = undefined;
      breadcrumb = undefined;
      updatedState = undefined;
    });
    it('should return breadcrumb items with the new breadcrumb appended', () => {
      state = { items: [{ url: 'foo', label: 'Foo' }] };
      breadcrumb = { url: 'bar', label: 'Bar' };

      updatedState = service['addBreadcrumb'](state, breadcrumb);

      expect(updatedState.items.length).toBe(2);
      expect(updatedState.items[1]).toEqual(breadcrumb);
    });

    it('should return sliced breadcrumb items if item already existed', () => {
      state = {
        items: [
          { url: 'foo', label: 'Foo' },
          { url: 'bar', label: 'Bar' },
          { url: 'baz', label: 'Baz' },
        ],
      };
      breadcrumb = { url: 'bar', label: 'Bar' };

      updatedState = service['addBreadcrumb'](state, breadcrumb);

      expect(updatedState.items.length).toBe(2);
      expect(updatedState.items[1]).toEqual(breadcrumb);
    });
  });
});
