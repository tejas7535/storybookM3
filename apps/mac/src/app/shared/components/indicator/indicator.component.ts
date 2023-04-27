import { CommonModule } from '@angular/common';
import { Component, Input } from '@angular/core';
import { MatIconModule } from '@angular/material/icon';

@Component({
  selector: 'mac-indicator',
  standalone: true,
  imports: [CommonModule, MatIconModule],
  templateUrl: './indicator.component.html',
})
export class IndicatorComponent {
  @Input() icon: string;
  @Input() activeClass: string;
  @Input() val: number;
  @Input() of: number;

  public getIterable(): IterableIterator<number> {
    return Array.from({ length: this.of }).keys();
  }

  public getClass(i: number): string {
    return i < this.val ? this.activeClass : undefined;
  }
}
