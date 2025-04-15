import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, input } from '@angular/core';
import { MatDividerModule } from '@angular/material/divider';

import { ResultItem } from '@mm/core/store/models/calculation-result-state.model';
import { ResponsiveGridComponent } from '@mm/shared/components/responsive-grid/responsive-grid.component';

@Component({
  selector: 'mm-grid-result-items',
  templateUrl: './grid-result-items.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [ResponsiveGridComponent, CommonModule, MatDividerModule],
})
export class GridResultItemsComponent {
  resultItems = input.required<ResultItem[]>();
}
