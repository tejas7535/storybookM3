import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, Input } from '@angular/core';

import { SharedPipesModule } from '../../pipes/shared-pipes.module';

@Component({
  selector: 'gq-free-stock-traffic-light',
  standalone: true,
  imports: [CommonModule, SharedPipesModule],
  templateUrl: './free-stock-traffic-light.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class FreeStockTrafficLightComponent {
  @Input() freeStock: number;
  @Input() uom: string;
}
