import { Injectable } from '@angular/core';

import { Observable } from 'rxjs';
import { filter, map } from 'rxjs/operators';

import { ComponentStore } from '@ngrx/component-store';

import { RSY_PAGE_BEARING_TYPE } from '../shared/constants/dialog-constant';
import { PagedMeta } from './home.model';
import { NestedPropertyMeta } from '@caeonline/dynamic-forms';
import { HomeService } from './home.service';

export interface HomeState {
  pagedMetas: PagedMeta[];
  activePageId: string;
  inactivePageId: string;
}

@Injectable()
export class HomeStore extends ComponentStore<HomeState> {
  public constructor(private readonly homeService: HomeService) {
    super({
      pagedMetas: [],
      activePageId: RSY_PAGE_BEARING_TYPE,
      inactivePageId: undefined,
    });
  }

  public readonly pagedMetas$: Observable<PagedMeta[]> = this.select(
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

  public readonly inactivePageId$: Observable<string> = this.select(
    (state) => state.inactivePageId
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

  public readonly setPageMetas = this.updater(
    (state, nestedMetas: NestedPropertyMeta[]) => ({
      ...state,
      pagedMetas: this.homeService.constructPagedMetas(nestedMetas),
    })
  );

  public readonly setActivePageId = this.updater(
    (state, activePageId: string) => ({
      ...state,
      activePageId,
    })
  );

  public readonly setInactivePageId = this.updater(
    (state, inactivePageId: string) => ({
      ...state,
      inactivePageId,
    })
  );
}
