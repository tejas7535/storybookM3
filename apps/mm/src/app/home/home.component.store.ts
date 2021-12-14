import { Injectable } from '@angular/core';

import { filter, map, Observable, pairwise, startWith, switchMap } from 'rxjs';

import { NestedPropertyMeta } from '@caeonline/dynamic-forms';
import { ComponentStore, tapResponse } from '@ngrx/component-store';

import { LazyListLoaderService } from '../core/services/lazy-list-loader';
import { RSY_PAGE_BEARING_TYPE } from '../shared/constants/dialog-constant';
import { BearingOption } from '../shared/models';
import { BearingParams, PagedMeta } from './home.model';
import { HomeService } from './home.service';

export interface HomeState {
  pagedMetas: PagedMeta[];
  activePageId: string;
  inactivePageId: string;
  bearing: string;
}

@Injectable({
  providedIn: 'root',
})
export class HomeStore extends ComponentStore<HomeState> {
  public constructor(
    private readonly lazyListLoaderService: LazyListLoaderService,
    private readonly homeService: HomeService
  ) {
    super({
      pagedMetas: [],
      activePageId: RSY_PAGE_BEARING_TYPE,
      inactivePageId: undefined,
      bearing: undefined,
    });
  }

  // Todo: Remove any[] if dynamic-forms is correctly typed in the future
  public readonly pagedMetas$: Observable<PagedMeta[] | any[]> = this.select(
    (state) => state.pagedMetas
  );

  public readonly activePageId$: Observable<string> = this.select(
    (state) => state.activePageId
  );

  public readonly activePageName$: Observable<string> = this.select(
    (state) =>
      state.pagedMetas.find(
        (pagedMeta) => pagedMeta.page.id === state.activePageId
      )?.page.page.text
  );

  public readonly bearingParams$: Observable<BearingParams> = this.select(
    (state) => this.homeService.getBearingParams(state.pagedMetas)
  );

  public readonly activeBearing$: Observable<string> = this.select(
    (state) => state.activePageId !== RSY_PAGE_BEARING_TYPE && state.bearing
  );

  public readonly inactivePageId$: Observable<string> = this.select(
    (state) => state.inactivePageId
  );

  public readonly bearing$: Observable<string> = this.select(
    (state) => state.bearing
  );

  public readonly selectedBearingOption$: Observable<BearingOption> =
    this.select(
      this.bearing$,
      this.bearingParams$,
      (bearing: string, bearingParams: BearingParams) =>
        bearing &&
        bearingParams?.id && {
          id: bearingParams.id.toString(),
          title: bearing,
        }
    );

  public readonly maxPageId$: Observable<string> = this.select((state) => {
    let result: string;

    state.pagedMetas.map((pagedMeta) =>
      pagedMeta.valid$
        .pipe(
          map((valid) => {
            const visiblePages = state.pagedMetas.filter(
              (page) => page.page.visible
            );
            const currentPageIndex = visiblePages.findIndex(
              (p) => p.page.id === pagedMeta.page.id
            );
            const nextPage = visiblePages[currentPageIndex + 1];
            const maxPageId =
              !valid || !nextPage ? pagedMeta.page.id : nextPage.page.id;

            return { maxPageId, source: pagedMeta.page.id };
          }),
          filter(({ source }) => source === state.activePageId),
          map(({ maxPageId }) => {
            result = maxPageId;
          })
        )
        .subscribe()
    );

    return result;
  });

  // Write
  public readonly setPageMetas = this.updater(
    (state, nestedMetas: NestedPropertyMeta[]) => ({
      ...state,
      pagedMetas: this.homeService.constructPagedMetas(nestedMetas),
    })
  );

  public readonly setActivePageId = this.updater(
    (state, activePageId: string): any => ({
      ...state,
      activePageId,
    })
  );

  public readonly setInactivePageId = this.updater(
    (state, inactivePageId: string): any => ({
      ...state,
      inactivePageId,
    })
  );

  public readonly setBearing = this.updater((state, bearing: string): any => ({
    ...state,
    bearing,
  }));

  // Effects;
  readonly getBearing = this.effect(
    (bearingParams$: Observable<BearingParams>) =>
      bearingParams$.pipe(
        startWith({ id: undefined, url: undefined, params: undefined }),
        pairwise(),
        filter(
          ([prevParams, currentParams]) => prevParams?.id !== currentParams.id
        ),
        switchMap(([_prevParams, { url, params, id }]) =>
          this.lazyListLoaderService.loadOptions(url, params).pipe(
            tapResponse(
              (bearings: any) => {
                const bearing = bearings.find(
                  (_bearing: any) => _bearing.id === id
                ).text;
                this.setBearing(bearing);
              },
              (error) => {
                throw error;
              }
            )
          )
        )
      )
  );
}
