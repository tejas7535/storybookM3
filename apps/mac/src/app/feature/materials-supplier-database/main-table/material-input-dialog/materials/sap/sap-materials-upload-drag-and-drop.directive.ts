import {
  Directive,
  EventEmitter,
  HostBinding,
  HostListener,
  Input,
  OnInit,
  Output,
} from '@angular/core';

@Directive({
  selector: '[macSapMaterialsUploadDragAndDrop]',
})
export class SapMaterialsUploadDragAndDropDirective implements OnInit {
  @Input() dragAndDropEnabled: boolean;

  @Output() fileDropped = new EventEmitter<File>();

  @HostBinding('style.borderColor') borderColor: string;

  private readonly DEFAULT_BORDER_COLOR = '#0000001f';
  private readonly DRAG_OVER_BORDER_COLOR = '#00893D';

  @HostListener('dragover', ['$event'])
  handleDragOver(dragEvent: DragEvent): void {
    dragEvent.preventDefault();
    dragEvent.stopPropagation();

    if (this.dragAndDropEnabled) {
      this.borderColor = this.DRAG_OVER_BORDER_COLOR;
    }
  }

  @HostListener('dragleave', ['$event'])
  handleDragLeave(dragEvent: DragEvent): void {
    dragEvent.preventDefault();
    dragEvent.stopPropagation();

    if (this.dragAndDropEnabled) {
      this.borderColor = this.DEFAULT_BORDER_COLOR;
    }
  }

  @HostListener('drop', ['$event'])
  handleDrop(dragEvent: DragEvent): void {
    dragEvent.preventDefault();
    dragEvent.stopPropagation();

    if (this.dragAndDropEnabled) {
      const files = dragEvent.dataTransfer.files;

      if (files.length === 1) {
        this.fileDropped.emit(files[0]);
      }

      this.borderColor = this.DEFAULT_BORDER_COLOR;
    }
  }

  ngOnInit(): void {
    this.borderColor = this.DEFAULT_BORDER_COLOR;
  }
}
