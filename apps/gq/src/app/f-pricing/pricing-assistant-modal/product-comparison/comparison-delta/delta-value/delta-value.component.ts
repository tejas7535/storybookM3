import { CommonModule } from '@angular/common';
import { Component, Input } from '@angular/core';
import { MatIconModule } from '@angular/material/icon';

import { PropertyDelta } from '@gq/core/store/f-pricing/models/property-delta.interface';

import { DeltaDisplayPipe } from './pipes/delta-display.pipe';
@Component({
  selector: 'gq-delta-value',
  standalone: true,
  imports: [CommonModule, MatIconModule, DeltaDisplayPipe],
  templateUrl: './delta-value.component.html',
})
export class DeltaValueComponent {
  @Input() delta: PropertyDelta;
}
