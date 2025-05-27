import { Directive, ElementRef, HostListener, inject } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';

import { ImagePreviewComponent } from './image-preview.component';

@Directive({
  standalone: true,
  selector: 'img[lsaEnhanceImage]',
})
export class EnhanceImageDirective {
  protected matDialog = inject(MatDialog);
  protected el = inject(ElementRef);

  @HostListener('click') onClick() {
    const src = this.el.nativeElement.src;
    this.matDialog.open(ImagePreviewComponent, {
      data: {
        src,
      },
    });
  }
}
