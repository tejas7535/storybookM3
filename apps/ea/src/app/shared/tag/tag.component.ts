import { CommonModule } from '@angular/common';
import { Component, Input } from '@angular/core';

@Component({
  selector: 'ea-tag',
  imports: [CommonModule],
  templateUrl: './tag.component.html',
})
export class TagComponent {
  @Input() styleClass: string | undefined;
  @Input() value: string | undefined;
  @Input() disabled? = false;
}
