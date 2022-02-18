import { ChangeDetectionStrategy, Component, Input } from '@angular/core';

@Component({
  selector: 'cdba-compare-label-value',
  templateUrl: './compare-label-value.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CompareLabelValueComponent {
  @Input() label: string;
  @Input() value: string;
  @Input() borderBottom: boolean;
}
