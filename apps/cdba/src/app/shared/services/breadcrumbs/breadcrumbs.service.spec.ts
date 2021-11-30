import { RouterTestingModule } from '@angular/router/testing';
import { marbles } from 'rxjs-marbles/jest';
import { createServiceFactory, SpectatorService } from '@ngneat/spectator/jest';
import { provideMockStore } from '@ngrx/store/testing';

import { DETAIL_STATE_MOCK } from '@cdba/testing/mocks';
import { MaterialNumberModule } from '@cdba/shared/pipes';
import { ENV, getEnv } from '@cdba/environments/environment.provider';

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
    beforeEach(() => {
      service.setState({
        search: {
          label: 'Search',
          url: '/search',
          queryParams: undefined,
        },
        results: undefined,
        detail: undefined,
        compare: undefined,
      });
    });

    it(
      'should filter out undefined breadcrumbs',
      marbles((m) => {
        const expectedBreadcrumbs = [
          {
            label: 'Search',
            url: undefined as any,
            queryParams: undefined as any,
          },
        ];

        m.expect(service.breadcrumbs$).toBeObservable(
          m.cold('a', { a: expectedBreadcrumbs })
        );
      })
    );

    it(
      'should remove the url of the last element',
      marbles((m) => {
        service.setState({
          search: {
            label: 'Search',
            url: '/search',
          },
          results: {
            label: 'Results',
            url: '/results',
          },
          detail: undefined,
          compare: undefined,
        });

        const expectedBreadcrumbs = [
          {
            label: 'Search',
            url: '/search',
          },
          {
            label: 'Results',
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
      search: {
        label: 'Search',
        url: '/search',
        queryParams: undefined,
      },
      results: undefined,
      detail: undefined,
      compare: undefined,
    };

    beforeEach(() => {
      service.setState(defaultState);

      expectedState = undefined;
    });

    describe('setResultsBreadcrumb', () => {
      it(
        'should set new resultsBreadcrumb and should reset detail and compare',
        marbles((m) => {
          service.setState({
            ...defaultState,
            detail: {
              label: 'detail',
            },
            compare: { label: 'compare' },
          });

          const resultsBreadcrumb = {
            label: 'Results (330)',
            url: '/results',
          };

          expectedState = { ...defaultState, results: resultsBreadcrumb };

          service.setResultsBreadcrumb(resultsBreadcrumb);

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
      };
      it(
        'should set new detail breadcrumb if detail state does not exist yet',
        marbles((m) => {
          expectedState = { ...defaultState, detail: detailBreadcrumb };

          service.setDetailBreadcrumb(detailBreadcrumb);

          m.expect(service.state$).toBeObservable(
            m.cold('a', { a: expectedState })
          );
        })
      );

      it(
        'should set new detail breadcrumb but should keep existing label if detail state alredy exists',
        marbles((m) => {
          service.setState({
            ...defaultState,
            detail: {
              label: 'F-12345',
              url: '/detail/detail',
            },
          });

          expectedState = {
            ...defaultState,
            detail: { label: 'F-12345', url: '/detail/calculations' },
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
        'should update label of detail breadcrumb, if detail breadcrumb is already existing',
        marbles((m) => {
          const mockState: BreadcrumbState = {
            search: {
              label: 'Search',
              url: '/search',
              queryParams: undefined,
            },
            results: undefined,
            detail: { label: 'Detail', url: '/detail' },
            compare: undefined,
          };

          service.setState(mockState);

          expectedState = {
            search: {
              label: 'Search',
              url: '/search',
              queryParams: undefined,
            },
            results: undefined,
            detail: { label: 'F-12345', url: '/detail' },
            compare: undefined,
          };

          service.updateMaterialDesignation(materialDesignation);

          m.expect(service.state$).toBeObservable(
            m.cold('a', { a: expectedState })
          );
        })
      );

      it(
        'should not update the state, if detail does not exist yet',
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
        'should extends state by new compare breadcrumb',
        marbles((m) => {
          const compareBreadcrumb = { label: 'Compare', url: '/compare' };
          expectedState = { ...defaultState, compare: compareBreadcrumb };

          service.setCompareBreadcrumb(compareBreadcrumb);

          m.expect(service.state$).toBeObservable(
            m.cold('a', { a: expectedState })
          );
        })
      );
    });
  });
});
