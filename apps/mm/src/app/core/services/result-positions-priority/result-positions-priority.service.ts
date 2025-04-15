import { Injectable } from '@angular/core';

import {
  ResultItem,
  ResultItemWithTitle,
} from '@mm/core/store/models/calculation-result-state.model';

@Injectable({
  providedIn: 'root',
})
export class ResultPositionsPriorityService {
  private readonly startItemsImportanceAbbreviations = ['p_oil_ini', 'n_sld'];

  /** some data will be added here as mm 2.0 extend this and remove it once data will be implemented
   * - Control value bearing clearance class (order 2)
   * - Check values for clearance classes	(order 3)
   * - Radial clearance reduction (order 4)
   * based on the following: https://confluence.schaeffler.com/pages/viewpage.action?pageId=404420489
   * remove comment after implementation
   */
  private readonly endItemsImportanceAbbreviations = [
    'dx_mnt',
    'Fx_mnt',
    // 'σ_t_rcw',
    // 'p_jnt_mnt',
  ];

  getPrioritizedStartItems(positions: ResultItem[]): ResultItem[] {
    return this.prioritizeItems(
      positions,
      this.startItemsImportanceAbbreviations
    );
  }

  getPrioritizedEndItems(positions: ResultItem[]): ResultItem[] {
    return this.prioritizeItems(
      positions,
      this.endItemsImportanceAbbreviations
    );
  }

  getPrioritizedAndFormattedRadialClearance(
    radialClearances: ResultItemWithTitle[] | undefined
  ): ResultItem[] {
    if (!radialClearances) {
      return [];
    }

    const reversedClearances = this.reverseOrder(radialClearances);

    return this.mapResultItemWithTitleIntoResultItem(reversedClearances);
  }

  getPrioritizedClearanceClasses(
    clearanceClasses: ResultItemWithTitle[] | undefined
  ): ResultItem[] {
    if (!clearanceClasses) {
      return [];
    }

    return this.mapResultItemWithTitleIntoResultItem(clearanceClasses);
  }

  private mapResultItemWithTitleIntoResultItem(
    items: ResultItemWithTitle[]
  ): ResultItem[] {
    return items.flatMap((item) =>
      item.items.map((subItem) => ({
        ...subItem,
        designation: `${item.title} ( ${subItem.designation} )`,
        isImportant: true,
      }))
    );
  }

  private reverseOrder(items: ResultItemWithTitle[]): ResultItemWithTitle[] {
    return [...items].reverse();
  }

  private prioritizeItems(
    positions: ResultItem[],
    importanceList: string[]
  ): ResultItem[] {
    if (!positions?.length) {
      return [];
    }

    const prioritizedItems = positions.map((item) => ({
      ...item,
      isImportant: importanceList.includes(item.abbreviation),
    }));

    return this.sortByImportance(prioritizedItems, importanceList);
  }

  private sortByImportance(
    items: ResultItem[],
    importanceOrder: string[]
  ): ResultItem[] {
    return [...items].sort((a, b) => {
      if (a.isImportant && b.isImportant) {
        const indexA = importanceOrder.indexOf(a.abbreviation);
        const indexB = importanceOrder.indexOf(b.abbreviation);

        return indexA - indexB;
      }

      if (a.isImportant) {
        return -1;
      }

      if (b.isImportant) {
        return 1;
      }

      return 0;
    });
  }
}
