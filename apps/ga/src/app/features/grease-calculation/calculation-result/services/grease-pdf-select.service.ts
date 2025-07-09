import { computed, Injectable, signal } from '@angular/core';

type SelectionSet = Set<string>;

@Injectable({ providedIn: 'root' })
export class GreasePDFSelectionService {
  private readonly _selectionMode = signal(false);
  private readonly _selectedSet = signal<SelectionSet>(new Set());

  public readonly selectedSet = this._selectedSet.asReadonly();
  public readonly selectionMode = this._selectionMode.asReadonly();

  public readonly selectedCount = computed(() => {
    const set = this.selectedSet();

    return set.size;
  });

  public reset() {
    this._selectedSet.set(new Set());
  }

  public isSelected(title: string) {
    const set = this.selectedSet();

    return set.has(title);
  }

  public toggleSelected(title: string) {
    const set = this.selectedSet();
    if (set.has(title)) {
      set.delete(title);
    } else {
      set.add(title);
    }
    this._selectedSet.set(new Set(set));
  }

  public toggleSelectionMode() {
    this._selectionMode.set(!this._selectionMode());

    if (!this.selectionMode()) {
      this.reset();
    }
  }

  public setSelectionMode(state: boolean) {
    this._selectionMode.set(state);
    if (!state) {
      this.reset();
    }
  }
}
