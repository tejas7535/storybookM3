import { Component, inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogModule } from '@angular/material/dialog';
import { MatIconModule } from '@angular/material/icon';

@Component({
  standalone: true,
  templateUrl: './image-preview.component.html',
  imports: [MatIconModule, MatDialogModule],
})
export class ImagePreviewComponent {
  protected dialogData = inject(MAT_DIALOG_DATA);
}
