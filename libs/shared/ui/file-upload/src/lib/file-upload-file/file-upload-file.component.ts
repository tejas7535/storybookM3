import { CommonModule } from '@angular/common';
import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  EventEmitter,
  Input,
  OnInit,
  Output,
} from '@angular/core';
import { MatIconModule } from '@angular/material/icon';
import { MatProgressBarModule } from '@angular/material/progress-bar';

import { translate } from '@jsverse/transloco';

import { FileUploadMessageComponent } from '../file-upload-message/file-upload-message.component';
import { Message } from '../models';

@Component({
  selector: 'schaeffler-file-upload-file',
  templateUrl: './file-upload-file.component.html',
  standalone: true,
  imports: [
    CommonModule,
    MatIconModule,
    MatProgressBarModule,
    FileUploadMessageComponent,
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class FileUploadFileComponent implements OnInit {
  @Input() public file!: File;
  @Input() public progressBar = false;
  @Input() public unknownFileTypeText?: string = translate('unknownType');
  @Input() public autoReadFileData? = false;
  @Input() public border = false;

  @Output() public fileLoaded = new EventEmitter<{
    file: File;
    data?: ArrayBuffer;
    fileComponent: FileUploadFileComponent;
  }>();
  @Output() public fileError = new EventEmitter<{
    file: File;
    fileComponent: FileUploadFileComponent;
  }>();
  @Output() public removeFile = new EventEmitter<void>();

  public progress = 0;
  public manualProgress?: number;
  public message?: Message;
  public loaded = false;
  public error = false;

  public constructor(private readonly changeDetectorRef: ChangeDetectorRef) {}

  public get fileType(): string {
    if (this.file.name.includes('.')) {
      // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
      return this.file.name.split('.').at(-1)!;
    }

    return this.unknownFileTypeText || translate('unknownType');
  }

  public get fileSize(): string {
    if (this.file.size === 0) {
      return '0 B';
    }

    const sizes = ['B', 'KB', 'MB', 'GB', 'TB'];
    const i = Math.floor(Math.log(this.file.size) / Math.log(1024));

    return `${Number.parseFloat((this.file.size / Math.pow(1024, i)).toFixed(2))} ${sizes[i]}`;
  }

  public get fileMessage(): Message {
    return {
      // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
      ...this.message!,
      title: `${this.message?.title} (${this.file.name})`,
    };
  }

  public get statusText(): string | undefined {
    if (this.statusTextFn) {
      return this.statusTextFn(this.file, this.progress, this.manualProgress);
    }

    return undefined;
  }

  @Input() public statusTextFn?: (
    file?: File,
    progress?: number,
    manualProgress?: number
    // eslint-disable-next-line unicorn/no-useless-undefined
  ) => string | undefined = () => undefined;

  public ngOnInit(): void {
    if (this.autoReadFileData) {
      const reader = new FileReader();

      reader.addEventListener(
        'loadstart',
        this.handleProgressEventFactory(this)
      );
      reader.addEventListener('load', this.handleProgressEventFactory(this));
      reader.addEventListener(
        'progress',
        this.handleProgressEventFactory(this)
      );
      reader.addEventListener('abort', this.handleProgressEventFactory(this));

      reader.addEventListener('error', (event) => {
        this.handleProgressEventFactory(this)(event);
        this.error = true;
        this.fileError.emit({ file: this.file, fileComponent: this });
      });

      reader.addEventListener('loadend', (event) => {
        this.handleProgressEventFactory(this)(event);
        this.fileLoaded.emit({
          file: this.file,
          data: reader.result as ArrayBuffer,
          fileComponent: this,
        });
        this.loaded = true;
        this.changeDetectorRef.markForCheck();
      });

      // eslint-disable-next-line unicorn/prefer-blob-reading-methods
      reader.readAsArrayBuffer(this.file);
    } else {
      this.progress = 100;
      this.loaded = true;
      this.fileLoaded.emit({
        file: this.file,
        fileComponent: this,
      });
    }
  }

  public onRemoveFile = (): void => {
    this.removeFile.emit();
  };

  public setManualProgess = (progress: number | undefined): void => {
    this.manualProgress = progress;
    this.changeDetectorRef.markForCheck();
  };

  public setMessage = (message: Message | undefined): void => {
    this.message = message;
    this.changeDetectorRef.markForCheck();
  };

  private handleProgressEventFactory(
    context: FileUploadFileComponent
  ): (event: ProgressEvent) => void {
    return (event: ProgressEvent): void => {
      context.progress = event.loaded / event.total;
    };
  }
}
