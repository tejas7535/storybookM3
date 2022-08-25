import { Injectable } from '@angular/core';

import { ComponentStore } from '@ngrx/component-store';

import { addArrayItem, removeArrayItem } from '@cdba/shared/utils';

interface MaterialCardState {
  expandedItems: number[];
}

const initialMaterialCardState: MaterialCardState = {
  expandedItems: [0, 1],
};

@Injectable()
export class MaterialCardStore extends ComponentStore<MaterialCardState> {
  constructor() {
    super(initialMaterialCardState);
  }

  public readonly expandedItems$ = this.select(
    ({ expandedItems }) => expandedItems
  );

  public readonly addExpandedItem = this.updater((state, item: number) => ({
    ...state,
    expandedItems:
      addArrayItem<number>(state.expandedItems, item) || state.expandedItems,
  }));

  public readonly removeExpandedItem = this.updater((state, item: number) => ({
    ...state,
    expandedItems:
      removeArrayItem<number>(state.expandedItems, item) || state.expandedItems,
  }));
}
