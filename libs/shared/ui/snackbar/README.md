# frontend@schaeffler Snackbar Documentation

[Angular Material Documentation](https://material.angular.io/components/snack-bar/overview)

This lib depends on the `schaeffler-icons`, which can be installed with npm:

`npm i schaeffler-icons`

Afterwards the `styles` section in the `angular.json` has to be adjusted: 

```
"styles": [
  ...
  "node_modules/schaeffler-icons/style.css"
],
```

This lib depends on the `@schaeffler/styles`, which can be installed with npm:

`npm i --save @schaeffler/styles`

```css
/* styles.scss */

@import '@schaeffler/styles/src';
```

```typescript
// myModule.module.ts

import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { SnackBarModule } from '@schaeffler/snackbar';

@NgModule({
  ...
  imports: [
    BrowserAnimationsModule,
    SnackBarModule,
    ...
  ]
  ...
})
```

Use like:

```typescript
  
  constructor(private readonly snackBarService: SnackBarService) {}

  // Success Toast
  showSuccessToast(): void {
    this.snackBarService.showSuccessMessage('Yippi, the Snackbar works!');
  }

  // Information Toast
  showInformationToast(): void {
    this.snackBarService.showInfoMessage('Some boring news for you.');
  }

  // Warning Toast
  showWarningToast(): void {
    this.snackBarService.showWarningMessage('Oh, a warning.');
  }

  // Error Toast
  showErrorToast(): void {
    this.snackBarService.showErrorMessage('Ohoh, an error occured!');
  }

  // Passing an Action
  this.snackBarService.showWarningMessage('Oh, a warning.', 'Try again');  // valid for every type
  // If you want the snackbar to dismiss on button click, you need to `.subscribe()` here

  // Listening to an action
  this.snackBarService
      .showWarningMessage('Oh, a warning.', 'Try again')
      .subscribe(result => 
        // result is either 'action' or 'dismissed'

        if (result === 'action') {
          // action button was clicked
        } else if (result === 'dismissed'){
          // action button was NOT clicked, snackbar dismissed after timeout
        }
      });
```

