import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class ListItemsWrapperService {
  public wrapListItems(
    items: string[],
    minNumberOfItemsToBeWrapped: number
  ): string[] {
    if (!items || items.length < minNumberOfItemsToBeWrapped) {
      return items;
    }

    const result: string[] = [];
    let listItems: string[] = [];

    items.forEach((item) => {
      if (item.trim().startsWith('·')) {
        listItems.push(item.replace('·', '').trim());
      } else {
        result.push(
          ...this.handleListItems(listItems, minNumberOfItemsToBeWrapped)
        );
        listItems = [];
        result.push(item.trim());
      }
    });

    result.push(
      ...this.handleListItems(listItems, minNumberOfItemsToBeWrapped)
    );

    return result;
  }

  private handleListItems(
    listItems: string[],
    minNumberOfItemsToBeWrapped: number
  ): string[] {
    return listItems.length >= minNumberOfItemsToBeWrapped
      ? [listItems.join(', ')]
      : listItems.map((li) => `  · ${li}`);
  }
}
