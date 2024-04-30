import { Component } from '@angular/core';
import { provideAnimations } from '@angular/platform-browser/animations';

import {
  applicationConfig,
  Meta,
  moduleMetadata,
  StoryFn,
} from '@storybook/angular';

import {
  FileUploadComponent,
  Message,
  SelectedFile,
} from '@schaeffler/file-upload';

import { Badges } from '../../../../.storybook/storybook-badges.constants';
import READMEMd from '../../../../../file-upload/README.md';
import { provideHttpClient } from '@angular/common/http';
import { STORYBOOK_TRANSLOCO_CONFIG } from 'libs/shared/ui/storybook/.storybook/storybook-transloco.constants';

import { provideTransloco } from '@jsverse/transloco';
import { provideTranslocoMessageformat } from '@jsverse/transloco-messageformat';
import { interval, take } from 'rxjs';
@Component({
  selector: 'file-upload-example',
  template: `
    <div class="p-4">
      <schaeffler-file-upload
        [loadingIndicator]="loadingIndicator"
        [maxFileCount]="maxFileCount"
        [autoOverwriteOldestFile]="autoOverwriteOldestFile"
        [displayMaxFileCountError]="displayMaxFileCountError"
        [autoReadFileData]="autoReadFileData"
        [messages]="messages"
        [acceptTypeString]="acceptTypeString"
        [fileHint]="fileHint"
        [loading]="loading"
        [disableDragAndDrop]="disableDragAndDrop"
        [unknownFileTypeText]="unknownFileTypeText"
        [statusTextFn]="statusTextFn"
        (tooManyFilesSelected)="onTooManyFilesSelected($event)"
        (filesChanged)="onFilesChanged($event)"
      ></schaeffler-file-upload>
    </div>
  `,
})
class FileUploadExampleComponent {
  loadingIndicator: 'spinner' | 'bar';
  maxFileCount: number;
  autoOverwriteOldestFile: boolean;
  displayMaxFileCountError: boolean;
  autoReadFileData: boolean;
  messages: Message[];
  acceptTypeString: string;
  fileHint: string;
  loading: boolean;
  disableDragAndDrop: boolean;
  unknownFileTypeText: string;

  private uploadingFiles: SelectedFile[] = [];

  public onTooManyFilesSelected(message: Message): void {
    // To avoid that a user gets the error message multiple times we check if it is already present before adding it
    if (!this.messages.includes(message)) {
      this.addUniqueMessage({
        id: 'tooManyFiles',
        ...message,
      });
    }
  }

  public statusTextFn = (
    file?: File,
    progress?: number,
    manualProgress?: number
  ): string | undefined => {
    console.log('status', file, progress, manualProgress);
    if (manualProgress) {
      return `(${manualProgress} % ${manualProgress === 100 ? '- complete' : ''})`;
    }

    return undefined;
  };

  // Whenever the files change we can check if our criterias for the application are met
  public onFilesChanged(files: SelectedFile[]) {
    console.log('story files changed', files);
    const errorFiles: SelectedFile[] = [];

    // check that all files are below 5MB, otherwise set it to an error state
    for (let selectedFile of files) {
      if (selectedFile.file.size > 1024 * 1024 * 5) {
        const message: Message = {
          type: 'error',
          title: 'File too big!',
          description:
            'Your files must be smaller than 5MB, please select a different file',
        };
        selectedFile.setMessage(message);
        errorFiles.push(selectedFile);
      }
    }

    // check if at least 3 files without error are present otherwise display a warning
    const validFiles = files.length - errorFiles.length;
    if (validFiles < 3) {
      const message: Message = {
        id: 'notEnoughValidFiles',
        type: 'warning',
        title: 'Not enough files!',
        description: `You only selected ${validFiles} valid files out of 3 required`,
      };
      this.addUniqueMessage(message);
    }

    // if a file is marked as important, we directly start the upload
    const importantFile = files.find((file) =>
      file.file.name.includes('important')
    );
    if (importantFile) {
      this.uploadFile(importantFile);
    }
  }

  // upload a file and update its upload progress
  private uploadFile(selectedFile: SelectedFile): void {
    console.log('story upload', selectedFile, this.uploadingFiles);
    if (this.uploadingFiles.includes(selectedFile)) {
      return;
    }
    this.uploadingFiles.push(selectedFile);
    const uploadInterval = interval(300);

    uploadInterval.pipe(take(100)).subscribe((progress) => {
      selectedFile.setManualProgress(progress + 1);
      if (progress === 100) {
        this.uploadingFiles = this.uploadingFiles.filter(
          (file) => file !== selectedFile
        );
      }
    });
  }

  private addUniqueMessage(message: Message): void {
    this.messages = this.messages.filter(
      (currentMessage) => currentMessage.id !== message.id
    );
    this.messages.push(message);
  }
}

export default {
  title: 'Atomic/Molecules/File Upload',
  component: FileUploadExampleComponent,
  decorators: [
    moduleMetadata({
      imports: [FileUploadComponent],
    }),
    applicationConfig({
      providers: [
        provideTransloco({
          config: STORYBOOK_TRANSLOCO_CONFIG,
        }),
        provideTranslocoMessageformat(),
        provideAnimations(),
        provideHttpClient(),
      ],
    }),
  ],
  parameters: {
    docs: {
      description: {
        story: READMEMd,
      },
    },
    badges: [Badges.InProgress],
  },
} as Meta<FileUploadExampleComponent>;

const Template: StoryFn<FileUploadExampleComponent> = (
  args: FileUploadExampleComponent
) => ({
  component: FileUploadExampleComponent,
  props: args,
});

const TemplateWithMessages: StoryFn<FileUploadExampleComponent> = (
  args: FileUploadExampleComponent
) => ({
  component: FileUploadExampleComponent,
  props: {
    ...args,
    defaultMessages: [
      {
        type: 'info',
        title: 'My info message',
        description: 'My info message description',
      },
      {
        type: 'warning',
        title: 'My warning message',
        description: 'My warning message description',
      },
      {
        type: 'error',
        title: 'My error message',
        description: 'My error message description',
      },
    ],
  },
  template: `
    <div class="p-4">
      <schaeffler-file-upload
        [messages]="defaultMessages"
      ></schaeffler-file-upload>
    </div>
    `,
});

export const WithAllOptions = Template.bind({});
WithAllOptions.args = {
  loadingIndicator: 'bar',
  maxFileCount: 3,
  autoOverwriteOldestFile: true,
  displayMaxFileCountError: false,
  autoReadFileData: true,
  messages: [],
  loading: false,
  acceptTypeString: '',
  fileHint: 'Files with maximum 5MB. Must provide 3 files.',
  disableDragAndDrop: false,
  unknownFileTypeText:
    'file type not recognized. Please make sure your file name ends with .xlsx',
};

export const Default = Template.bind({});
Default.args = {};

export const WithMessages = TemplateWithMessages.bind({});
WithMessages.args = {};

WithAllOptions.argTypes = {
  loadingIndicator: {
    options: ['bar', 'spinner'],
    control: 'radio',
    defaultValue: 'bar',
  },
};
