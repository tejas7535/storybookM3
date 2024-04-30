# frontend@schaeffler File Upload Documentation

The library is meant to provide a drag and drop file upload component


## Usage

### Prerequisites

This lib depends on [Tailwind](https://tailwindcss.com/docs). It is necessary to import the following styles in your app's `styles.scss` as shown in the recommended order:

``` scss
***************************************************************************************************
 * UTILITIES
 */

/*
 * TailwindCSS, utility-first css framework
 * see https://tailwindcss.com/docs
 */
@import 'tailwindcss/base';
@import 'tailwindcss/components';
@import 'tailwindcss/utilities';

/*
 * further / custom utilities
 */
...

/***************************************************************************************************
 * OVERRIDES
 */ 
...
```
### Import

```ts
// app.modules.ts or core.modules.ts

import { FileUploadComponent } from '@schaeffler/file-upload';

@NgModule({
  ...
    imports: [
  FileUploadComponent,
  ...
]
...
})
```

```ts
// some-standalone.component.ts 

import { FileUploadComponent } from '@schaeffler/file-upload';

@NgModule({
  ...
    imports: [
  FileUploadComponent,
  ...
]
standalone: true
...
})
```

### Embed in Template

```html
<schaeffler-file-upload></schaeffler-file-upload>
```

### Interfaces

**Message**

Messages are shown below the input files or can replace an input file to indicate an error, warning or info.

| Name            | Description                                                                       |
|-----------------|-----------------------------------------------------------------------------------|
| id              | (optional) id attribute which can be used for easier reference (string/number)    |
| type            | the type of the message ('error'/'warning'/'info')                                |
| title           | the title of the message (string)                                                 |
| description     | a description text shown in the message body (string)                             |

**SelectedFile**

This type is given out from the user input and returned from the filesChanged event.

| Name              | Description                                                                                                                             |
|-------------------|-----------------------------------------------------------------------------------------------------------------------------------------|
| error             | indicates if there was an error loading the file (can only be true if autoReadFileData is set to true) (boolean)                        |
| file              | the file object selected by the user (File)                                                                                             |
| removeFile        | function to remove the file programmatically (() => void)                                                                               |
| setManualProgress | function to set a manual progress value (the progress will be visible if loadingIndicator is set to 'bar') ((progress: number) => void) |
| setMessage        | function to set a message for a file e.g. to indicate an error state ((message: Message) => void)                                       |

### API

**Inputs**

| Name                      | Description                                                                                                                                                                                               |
|---------------------------|-----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------|
| loadingIndicator          | (optional) (default: 'spinner') type of the loading indicator ('spinner'/'bar')                                                                                                                           |
| maxFileCount              | (optional) (default: 1) maximum amount of files to be selected (number)                                                                                                                                   |
| autoOverwriteOldestFile   | (optional) (default: false) when set to true and the oldest files will be overwritten once the maximumFileCount is exceeded by a new selection (boolean)                                                  |
| displayMaxFileCountError  | (optional) (default: true) when enabled automatically adds an error message, when the maxFileCount is exceeded (boolean)                                                                                  |
| autoReadFileData          | (optional) (default: false) when enabled selected files will automatically read. In that case the selectedFiles objects emitted will contain a key 'data' with the file contents as ArrayBuffer (boolean) |
| messages                  | (optional) (default: []) an array of messages to display below the selected files (Message[])                                                                                                             |
| acceptTypeString          | (optional) a string to set for the 'accept' attribute of the file input element (string)                                                                                                                  |
| fileHint                  | (optional) a text to display within the drag and drop zone to hint at expected files (string)                                                                                                             |
| disableDragAndDrop        | (optional) (default: false) when enabled drag and drop is not possible for file selection (boolean)                                                                                                       |
| unknownFileTypeText       | (optional) (default: 'unknown file type') text to display in case the selected file has no extension (string)                                                                                             |
| statusTextFn              | (optional) function to set a text to display behind the filename of a file ((file: File, progress: number, manualProgress: number) => string | undefined)                                                 |

**Outputs**

| Name                      | type              | Description                                                                                                                                                                                                       |
|---------------------------|-------------------|-------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------|
| tooManyFilesSelected      | Message           | fired when the user selects more files that set in maxFileCount. Contains the default error message                                                                                                               |
| filesChanged              | SelectedFiles[]   | fired on every change of selected files: when a file is loaded, when a file is removed, when a file is read (only if autoReadFileData is set to true). Contains the complete list of the currently selected files |


### i18n

The lib comes with translations for the following languages:

* de (german 🇩🇪)
* en (english 🇬🇧)

### Examples

**With inputs**
```html
<schaeffler-file-upload
  loadingIndicator="bar"
  [maxFileCount]="3"
  [autoOverwriteOldestFile]="true"
  [displayMaxFileCountError]="false"
  [autoReadFileData]="false"
  [messages]="messages"
  acceptTypeString="xlsx"
  fileHint="Excel (.xlsx) files with maximum 5MB. Must provide 3 files."
  [disableDragAndDrop]="true"
  unknownFileTypeText="file type not recognized. Please make sure your file name ends with .xlsx"
  [statusTextFn]="statusTextFn"
  (tooManyFilesSelected)="onTooManyFilesSelected($event)"
  (filesChanged)="onFilesChanged($event)"
></schaeffler-file-upload>
```

```ts
import { Message, SelectedFile } from '@schaeffler/file-upload'
import { filter, tap } from 'rxjs';
import { uploadFn } from '../my-upload-function'

class MyComponent {
  public messages: Message[] = [
    {
      type: 'info',
      title: 'My Info',
      description: 'My informative description'
    }
  ]

  // use the statusTextFn to display the numeric progress of a file upload behind the title
  public statusTextFn(_file?: File, _progress?: number, manualProgress?: number): string | undefined {
    if (manualProgress) {
      return `(${manualProgress} %)`
    }

    return
  }

  public onTooManyFilesSelected(message: Message): void {
    // To avoid that a user gets the error message multiple times we check if it is already present before adding it
    if (!this.messages.includes(message)) {
      this.messages.push(message)
    }
  }

  // Whenever the files change we can check if our criterias for the application are met
  public onFilesChanged(files: SelectedFile[]) {
    const errorFiles: SelectedFile[] = []

    // check that all files are below 5MB, otherwise set it to an error state
    for(let selectedFile of files) {
      if (selectedFile.file.size > 1024 * 1024 * 5) {
        const message: Message = {
          type: 'error',
          title: 'File too big!',
          description: 'Your files must be smaller than 5MB, please select a different file'
        }
        selectedFile.setMessage(message);
        errorFiles.push(selectedFile)
      }
    }

    // check if at least 3 files without error are present otherwise display a warning
    const validFiles = files.length - errorFiles.length
    if(validFiles < 3) {
      const message: Message = {
          type: 'warning',
          title: 'Not enough files!',
          description: `You only selected ${validFiles} valid files out of 3 required`
        }
        this.messages.push(message);
    }

    // if a file is marked as important, we directly start the upload
    const importantFile = files.find(file => file.file.name.includes('important'))
    if (importantFile) {
      this.uploadFile(importantFile)
    }
  }

  // upload a file and update its upload progress
  private uploadFile(selectedFile: SelectedFile): void {
    uploadFn(selectedFile.file).pipe(
      tap(progress => selectedFile.setManualProgress(progress))
      filter(progress => progress == 100)
    ).subscribe(() => console.log('file uploaded', selectedFile.file))
  }
}
```


## Development

### Run Tests

#### Lint

```shell
$ nx lint shared-ui-file-upload
```

#### Unit Tests

```shell
$ nx test shared-ui-file-upload
```

### Run build

```shell
$ nx run shared-ui-file-upload:build
```