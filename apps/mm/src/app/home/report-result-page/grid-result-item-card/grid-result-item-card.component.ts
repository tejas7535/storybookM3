import { LayoutModule } from '@angular/cdk/layout';
import { CommonModule } from '@angular/common';
import {
  ChangeDetectionStrategy,
  Component,
  computed,
  input,
  signal,
} from '@angular/core';
import { MatCardModule } from '@angular/material/card';
import { MatDividerModule } from '@angular/material/divider';
import { MatExpansionModule } from '@angular/material/expansion';
import { MatIcon } from '@angular/material/icon';

import { ResultItem } from '@mm/core/store/models/calculation-result-state.model';

import { GridResultItemsComponent } from '../grid-result-items/grid-result-items.component';

@Component({
  selector: 'mm-grid-result-item-card',
  templateUrl: './grid-result-item-card.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    MatCardModule,
    MatDividerModule,
    LayoutModule,
    CommonModule,
    MatExpansionModule,
    MatIcon,
    GridResultItemsComponent,
  ],
})
export class GridResultItemCardComponent {
  title = input.required<string>();
  resultItems = input.required<ResultItem[]>();
  additionalResultItems = input<ResultItem[]>([]);
  expandItemsTitle = input<string>('');
  collapseItemsTitle = input<string>('');
  showAdditional = signal(false);

  hasResultItems = computed(() => this.resultItems().length > 0);
  hasAdditionalItems = computed(() => this.additionalResultItems().length > 0);

  expansionButtonText = computed(() =>
    this.showAdditional() ? this.collapseItemsTitle() : this.expandItemsTitle()
  );

  toggleAdditional() {
    this.showAdditional.update((value) => !value);
  }
}
