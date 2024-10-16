import { ChangeDetectionStrategy, Component, Input } from '@angular/core';

@Component({
  selector: 'lsa-lubrication-input',
  templateUrl: './lubrication-input.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  standalone: true,
})
export class LubricationInputComponent {
  @Input()
  public title: string;

  @Input()
  public value: string | number;
}
