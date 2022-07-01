# frontend@schaeffler Forbidden Page Documentation

The unified but flexible UI component Forbidden Page comes with a strongly typed `RouteData` interface, ready-to-use defaults and multi-language support.

## Usage

### Prerequisites

This lib depends on [Angular Material](https://material.angular.io) and [Tailwind](https://tailwindcss.com/docs). Material Icons should not be used from CDN but installed e.g. with [https://fontsource.org/docs/icons/material-icons](). It is necessary to import the following styles in your app's `styles.scss` as shown in the recommended order:

``` scss
/***************************************************************************************************
 * COMPONENTS AND THEMES
 */
 
/*
 * Angular Material, material design components
 * see https://material.angular.io
 */
@import 'libs/shared/ui/styles/src/lib/scss/material-theme';

/*
 * further / custom components
 */
...

/***************************************************************************************************
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

### Embed the forbidden route in your app

#### Example 1 (action button as a link)

Activate the Module for a "forbidden" route in your app- or feature-routing-module:

```typescript
import { Routes } from '@angular/router';
import { ForbiddenRoute } from '@schaeffler/empty-states';

const forbiddenRoute: ForbiddenRoute = {
    path: 'forbidden-path',
    loadChildren: async () => import('@schaeffler/empty-states').then((m) => m.ForbiddenModule),
    data: {
      headingText: 'some.translation.key',
      messageText: 'Some clear text',
      action: 'mailto:it-support-sg@schaeffler.com',
      actionButtonText: 'fsome.translation.key',
      hideHomeButton: true, // default is false
      homeButtonText: 'some.translation.key',
    }
  };

export const routes: Routes = [
  // ... all other routes,
  forbiddenRoute
]
```

#### Example 2 (click event for action button)

Activate the Module for a "forbidden" route in your app- or feature-routing-module:

```typescript
import { Routes } from '@angular/router';
import { ForbiddenRoute } from '@schaeffler/empty-states';

const forbiddenRoute: ForbiddenRoute = {
    path: 'forbidden-path',
    loadChildren: async () => import('@schaeffler/empty-states').then((m) => m.ForbiddenModule),
    data: {
      headingText: 'some.translation.key',
      messageText: 'Some clear text',
      action: 'event',
      actionButtonText: 'fsome.translation.key',
      hideHomeButton: true, // default is false
      homeButtonText: 'some.translation.key',
    }
  };

export const routes: Routes = [
  // ... all other routes,
  forbiddenRoute
]
```

Inject the `ForbiddenEventService` in your router parent component (`<router-outlet>` in template):

```typescript
import { Component, OnDestroy, OnInit } from '@angular/core';
import { Subscription } from 'rxjs';
import { ForbiddenEventService } from '@schaeffler/empty-states';

@Component({
  selector: 'router-parent-component',
  templateUrl: './router-parent.component.html'
})
export class RouterParentComponent implements OnInit, OnDestroy {
  forbiddenPageActionButtonSubscription: Subscription;

  constructor(forbiddenEventService: ForbiddenEventService) {}

  ngOnInit(): void {
    this.forbiddenPageActionButtonSubscription = this.forbiddenEventService.forbiddenPageActionButtonClicked$
      .subscribe(() => {
        // code when action button in forbidden page was clicked
        ...
      });
  }

  // don't forget to unsubscribe
  ngOnDestroy(): void {
    if (this.forbiddenPageActionButtonSubscription) {
      this.forbiddenPageActionButtonSubscription.unsubscribe();
    }
  }
}
```


### API

| Name              | Description                                                   |
| ------------------| --------------------------------------------------------------|
| headingText       | (optional) Change the text of the heading*                    |
| messageText       | (optional) Change the text of the message*                    |
| action            | (optional) Define action for the primary button.              |
| actionButtonText  | (optional) Change the text of the primary button*             |
| hideHomeButton    | (optional) hideHomeButton --> default is false                |
| homeButtonText    | (optional) Change the text of the secondary (home) button*    |

> *applies to all text props: 
> Use a translation key or clear text. 
> When using a translation key, make sure to provide the necessary translation.
> The Lib comes with a default translation.

### i18n

The lib comes with translation support and default translations for the following languages:

* de (german 🇩🇪)
* en (english 🇬🇧)
* es (spanish 🇪🇸)
* fr (french 🇫🇷)
* ru (russian 🇷🇺)
* zh (chinese 🇨🇳)
