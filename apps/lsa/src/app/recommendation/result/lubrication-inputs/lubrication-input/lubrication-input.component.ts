import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, Input } from '@angular/core';

import { RemoteChangeInfoComponent } from '../remote-change-info/remote-change-info.component';

@Component({
  selector: 'lsa-lubrication-input',
  templateUrl: './lubrication-input.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  standalone: true,
  imports: [CommonModule, RemoteChangeInfoComponent],
})
export class LubricationInputComponent {
  @Input()
  public title: string;

  @Input()
  public value: string | number;

  @Input()
  public comparisonValue: string | number;
}
