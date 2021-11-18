import { ChangeDetectionStrategy, Component, Input } from '@angular/core';

@Component({
  selector: 'cdba-label-value',
  templateUrl: './label-value.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class LabelValueComponent {
  @Input() label: string;
  @Input() value: string;
  @Input() borderBottom: boolean;
}
