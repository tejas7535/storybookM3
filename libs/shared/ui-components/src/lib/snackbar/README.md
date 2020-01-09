# frontend@schaeffler Snackbar Documentation

[Angular Material Documentation](https://material.angular.io/components/snack-bar/overview)

Import into your project like:

```typescript
// myModule.module.ts

import { SnackbarModule } from '@schaeffler/shared/ui-components';

@NgModule({
  ...
  imports: [
    SnackbarModule,
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

