import { CommonModule } from '@angular/common';
import {
  ChangeDetectionStrategy,
  Component,
  EventEmitter,
  Input,
  Output,
} from '@angular/core';
import { MatIconModule } from '@angular/material/icon';

import { Message } from '../models';

@Component({
  selector: 'schaeffler-file-upload-message',
  templateUrl: './file-upload-message.component.html',
  standalone: true,
  imports: [CommonModule, MatIconModule],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class FileUploadMessageComponent {
  @Input() public message!: Message;

  @Output() public closeMessage = new EventEmitter<void>();

  public close(): void {
    this.closeMessage.emit();
  }
}
