import { ChangeDetectionStrategy, Component, Input } from '@angular/core';

@Component({
  selector: 'cdba-details-label-value',
  templateUrl: './details-label-value.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  standalone: false,
})
export class DetailsLabelValueComponent {
  @Input() label: string;
  @Input() value: string;
  @Input() values: string[];
  @Input() borderTop?: boolean;
  @Input() borderBottom?: boolean;
}
