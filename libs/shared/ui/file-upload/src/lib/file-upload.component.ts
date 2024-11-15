import { CommonModule } from '@angular/common';
import {
  ChangeDetectionStrategy,
  Component,
  EventEmitter,
  Input,
  OnInit,
  Output,
} from '@angular/core';
import { MatIconModule } from '@angular/material/icon';

import { translate, TranslocoService } from '@jsverse/transloco';

import { LoadingSpinnerModule } from '@schaeffler/loading-spinner';
import { SharedTranslocoModule } from '@schaeffler/transloco';

import deutsch from '../../assets/i18n/de.json';
import english from '../../assets/i18n/en.json';
import { FileDropDirective } from './file-drop/file-drop.directive';
import { FileUploadFileComponent } from './file-upload-file/file-upload-file.component';
import { FileUploadMessageComponent } from './file-upload-message/file-upload-message.component';
import { Message, SelectedFile } from './models';

@Component({
  selector: 'schaeffler-file-upload',
  templateUrl: './file-upload.component.html',
  styleUrl: './file-upload.component.scss',
  standalone: true,
  imports: [
    CommonModule,
    MatIconModule,
    LoadingSpinnerModule,
    FileUploadMessageComponent,
    FileDropDirective,
    FileUploadFileComponent,
    SharedTranslocoModule,
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class FileUploadComponent implements OnInit {
  @Input() public loadingIndicator: 'spinner' | 'bar' = 'spinner';
  @Input() public maxFileCount = 1;
  @Input() public autoOverwriteOldestFile = false;
  @Input() public displayMaxFileCountError = true;
  @Input() public autoReadFileData? = false;
  @Input() public messages: Message[] = [];
  @Input() public acceptTypeString?: string;
  @Input() public fileHint?: string;
  @Input() public disableDragAndDrop = false;
  @Input() public unknownFileTypeText?: string;
  @Input() public loading = false;

  @Output() public tooManyFilesSelected = new EventEmitter<Message>();
  @Output() public filesChanged = new EventEmitter<SelectedFile[]>();

  @Input() public statusTextFn?: (
    file?: File,
    progress?: number,
    manualProgress?: number
    // eslint-disable-next-line unicorn/no-useless-undefined
  ) => string | undefined;

  public internalMessages: Message[] = [];
  public files: File[] = [];
  private readonly selectedFiles: SelectedFile[] = [];

  public constructor(private readonly translocoService: TranslocoService) {}

  public ngOnInit(): void {
    this.translocoService.setTranslation(deutsch, 'de');
    this.translocoService.setTranslation(english, 'en');
  }

  public onRemoveMessage(message: Message): void {
    this.messages = this.messages.filter(
      (currentMessage) => currentMessage !== message
    );
  }

  public onRemoveInternalMessage(message: Message): void {
    this.internalMessages = this.internalMessages.filter(
      (currentMessage) => currentMessage !== message
    );
  }

  public onRemoveFile(file: File): void {
    const deleteIndex = this.selectedFiles.findIndex(
      (currentSelectedFile) => currentSelectedFile.file === file
    );
    if (deleteIndex !== -1) {
      this.files.splice(deleteIndex, 1);
      this.selectedFiles.splice(deleteIndex, 1);
    }
    this.filesChanged.emit(this.selectedFiles);
  }

  public onFilesSelected(event: Event): void {
    const files = (event.target as HTMLInputElement)?.files;
    if (files) {
      // eslint-disable-next-line unicorn/prefer-spread
      const filesArray = Array.from(files);
      if (this.checkFileCount(filesArray)) {
        this.files.push(...filesArray);
      }
    }
    (event.target as HTMLInputElement).value = '';
  }

  public onFilesDropped(files: FileList) {
    // eslint-disable-next-line unicorn/prefer-spread
    const filesArray = Array.from(files).filter(
      (file) => !this.files.includes(file)
    );

    if (this.checkFileCount(filesArray)) {
      this.files.push(...filesArray);
    }
  }

  public onFileLoaded({
    file,
    fileComponent,
    data,
  }: {
    file: File;
    fileComponent: FileUploadFileComponent;
    data?: ArrayBuffer;
  }): void {
    this.selectedFiles.push({
      error: false,
      file,
      data,
      removeFile: fileComponent.onRemoveFile,
      setManualProgress: fileComponent.setManualProgess,
      setMessage: fileComponent.setMessage,
    });
    this.filesChanged.emit(this.selectedFiles);
  }

  public onFileError({
    file,
    fileComponent,
  }: {
    file: File;
    fileComponent: FileUploadFileComponent;
  }): void {
    this.selectedFiles.push({
      error: true,
      file,
      removeFile: fileComponent.onRemoveFile,
      setManualProgress: fileComponent.setManualProgess,
      setMessage: fileComponent.setMessage,
    });
    this.filesChanged.emit(this.selectedFiles);
  }

  private checkFileCount(files: File[]): boolean {
    if (this.maxFileCount && files.length > this.maxFileCount) {
      this.addMaxFileCountErrorMessage();

      return false;
    }

    if (
      this.maxFileCount &&
      files.length + this.files.length > this.maxFileCount
    ) {
      if (this.autoOverwriteOldestFile) {
        const deleteCount =
          files.length + this.files.length - this.maxFileCount;
        this.files.splice(0, deleteCount);
        this.selectedFiles.splice(0, deleteCount);
      } else {
        this.addMaxFileCountErrorMessage();

        return false;
      }
    }

    return true;
  }

  private addMaxFileCountErrorMessage() {
    const message: Message = {
      type: 'error',
      title: translate('tooManyFilesSelected'),
      description: translate('maximumFiles', {
        maxFileCount: this.maxFileCount,
      }),
    };
    if (this.displayMaxFileCountError) {
      this.internalMessages.push(message);
    }
    this.tooManyFilesSelected.emit(message);
  }
}
