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
  selector: '[schaefflerFileDrop]',
  standalone: true,
})
export class FileDropDirective implements OnInit {
  @Input() public dragAndDropDisabled = false;

  @Output() public filesDropped = new EventEmitter<FileList>();

  @HostBinding('style.borderColor') protected borderColor = '#9D9D9D';

  private readonly DEFAULT_BORDER_COLOR = '#9D9D9D';
  private readonly DRAG_OVER_BORDER_COLOR = '#00893D';

  @HostListener('dragover', ['$event'])
  public handleDragOver(dragEvent: DragEvent): void {
    dragEvent.preventDefault();
    dragEvent.stopPropagation();

    if (!this.dragAndDropDisabled) {
      this.borderColor = this.DRAG_OVER_BORDER_COLOR;
    }
  }

  @HostListener('dragleave', ['$event'])
  public handleDragLeave(dragEvent: DragEvent): void {
    dragEvent.preventDefault();
    dragEvent.stopPropagation();

    if (!this.dragAndDropDisabled) {
      this.borderColor = this.DEFAULT_BORDER_COLOR;
    }
  }

  @HostListener('drop', ['$event'])
  public handleDrop(dragEvent: DragEvent): void {
    dragEvent.preventDefault();
    dragEvent.stopPropagation();

    if (!this.dragAndDropDisabled) {
      const files = dragEvent.dataTransfer?.files;

      this.filesDropped.emit(files);

      this.borderColor = this.DEFAULT_BORDER_COLOR;
    }
  }

  public ngOnInit(): void {
    this.borderColor = this.DEFAULT_BORDER_COLOR;
  }
}
