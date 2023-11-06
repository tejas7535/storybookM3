import {
  Component,
  EventEmitter,
  Input,
  OnChanges,
  Output,
  SimpleChanges,
} from '@angular/core';

import { PropertyComparison } from '@gq/shared/models/f-pricing/property-comparison.interface';

@Component({
  selector: 'gq-comparison-panel',
  templateUrl: './comparison-panel.component.html',
})
export class ComparisonPanelComponent implements OnChanges {
  @Input() panelTitle: string;
  @Input() data: PropertyComparison[];
  @Input() numberOfDeltas: number;
  @Input() showDelta = false;

  @Output() togglePanelExpanded: EventEmitter<boolean> =
    new EventEmitter<boolean>();

  expanded: boolean;

  ngOnChanges(changes: SimpleChanges): void {
    if (changes.numberOfDeltas) {
      this.toggleExpand(this.numberOfDeltas > 0);
    }
  }

  toggleExpandedWhenCollapsing(expanded: boolean): void {
    // when panel is starts collapsing the state change is emitted
    // expand === true must be ignored here, otherwise state change will be emitted BEFORE expanding is complete
    if (!expanded) {
      this.toggleExpand(false);
    }
  }

  toggleExpand(expanded: boolean): void {
    this.expanded = expanded;
    this.togglePanelExpanded.emit(expanded);
  }
}
