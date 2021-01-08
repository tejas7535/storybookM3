# frontend@schaeffler FileDrop Documentation

This lib depends on the `@schaeffler/styles`, which can be installed with npm:

`npm i @schaeffler/styles`

```scss
/* styles.scss */

@import '@schaeffler/styles/src';
```

Import into your project like:

```typescript
// app.modules.ts

import { FileDropModule } from '@schaeffler/file-drop';

@NgModule({
  ...
  imports: [
    FileDropModule,
    ...
  ]
  ...
})
```

API of FileDrop Component:

```typescript
  @Input() public disabled: boolean; // handy to temporary disable filedrop, e.g. during processing
  @Input() public accept: string[]; // Array of accepted mime types, e.g. ['.docx', '.pdf', '.txt']
  @Input() public multiple: boolean; // if multiple files should be handled

  @Output() public readonly filesAdded: EventEmitter<File[]> = new EventEmitter<File[]>(); // Handle files when dropped
  @Output() public readonly fileOver: EventEmitter<any> = new EventEmitter<any>(); // Handle drag over event
  @Output() public readonly fileLeave: EventEmitter<any> = new EventEmitter<any>(); // Handle drag leave event
```

Use like:

```html
<!-- comp-xy.component.html -->

<schaeffler-file-drop
  multiple="false"
  [accept]="['.docx', '.pdf', '.txt']"
  (filesAdded)="uploadFile($event)"
></schaeffler-file-drop>
```

```typescript
// comp-xy.component.ts

public uploadFile(fileList: FileList): void {
  const file = fileList[0];

  if (file) {
    // handle file
  }
}
```
