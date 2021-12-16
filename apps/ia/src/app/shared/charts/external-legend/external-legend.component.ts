import {
  ChangeDetectionStrategy,
  Component,
  EventEmitter,
  Input,
  Output,
} from '@angular/core';

import { LegendSelectAction } from '../models';
import { ChartLegendItem } from '../models/chart-legend-item.model';

@Component({
  selector: 'ia-external-legend',
  templateUrl: './external-legend.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ExternalLegendComponent {
  @Input() legend: ChartLegendItem[];
  @Output() selectedLegendItem: EventEmitter<LegendSelectAction> =
    new EventEmitter();

  onLegendItemClicked(name: string): void {
    const clickedLegendItem = this.legend.find(
      (legendItem) => legendItem.name === name
    );
    clickedLegendItem.selected = !clickedLegendItem.selected;
    this.selectedLegendItem.emit({
      [clickedLegendItem.name]: clickedLegendItem.selected,
    });
  }

  trackByFn(index: number): number {
    return index;
  }
}
