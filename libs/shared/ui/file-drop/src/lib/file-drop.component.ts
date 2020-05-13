import {
  Component,
  EventEmitter,
  Input,
  OnChanges,
  Output,
} from '@angular/core';

@Component({
  selector: 'schaeffler-file-drop',
  templateUrl: './file-drop.component.html',
  styleUrls: ['./file-drop.component.scss'],
})
export class FileDropComponent implements OnChanges {
  @Input() public disabled: boolean;
  @Input() public accept: string[];
  @Input() public multiple: boolean;

  @Output() public readonly filesAdded: EventEmitter<File[]> = new EventEmitter<
    File[]
  >();
  @Output() public readonly fileOver: EventEmitter<any> = new EventEmitter<
    any
  >();
  @Output() public readonly fileLeave: EventEmitter<any> = new EventEmitter<
    any
  >();

  public dragoverflag = false;
  public acceptAsArray = '';

  /**
   * Joins accept array to prevent template call expression.
   */
  public ngOnChanges(): void {
    this.acceptAsArray = this.accept ? this.accept.join() : '';
  }

  /**
   * Handle drag over event
   */
  public onDragOver(event: Event): void {
    event.preventDefault();
    if (!this.disabled && !this.dragoverflag) {
      this.dragoverflag = true;
      this.fileOver.emit(event);
    }
  }

  /**
   * Handle drag leave event
   */
  public onDragLeave(event: Event): void {
    event.preventDefault();
    if (!this.disabled && this.dragoverflag) {
      this.dragoverflag = false;
      this.fileLeave.emit(event);
    }
  }

  /**
   * Clear data in drop zone
   */
  public clearDropzone(event: any): void {
    event.preventDefault();
    this.dragoverflag = false;
    event.dataTransfer.clearData();
  }

  /**
   * Handle files when dropped
   */
  public dropFiles(event: any): void {
    if (!this.disabled) {
      const files: File[] = event.dataTransfer.files as File[];

      this.filesAdded.emit(files);
    }
  }

  /**
   * Handle file when added
   */
  public addFile(event: any): void {
    event.preventDefault();
    const files: File[] = event.target.files as File[];

    this.filesAdded.emit(files);
    event.target.value = '';
  }
}
