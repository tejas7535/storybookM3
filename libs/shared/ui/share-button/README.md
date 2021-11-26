# frontend@schaeffler Share Button Documentation
A simple lib providing a button that copies the current link to clipboard upon clicking and displays a toast informing the user what happened

## Usage

### Prerequisites

As this lib depends on [Angular Material](https://material.angular.io) (including [Material Icons](https://fonts.google.com/icons)) and [Tailwind](https://tailwindcss.com/docs), it is necessary to import the following styles in your app's `styles.scss` as shown in the recommended order:

``` scss
/***************************************************************************************************
 * COMPONENTS AND THEMES
 */
 
/*
 * Angular Material, material design components
 * see https://material.angular.io
 * and material icons, see https://fonts.google.com/icons
 */
@import 'https://fonts.googleapis.com/icon?family=Material+Icons';

@import 'libs/shared/ui/styles/src/lib/material-theme';

/*
 * further / custom components
 */
...

/***************************************************************************************************
 * UTILITIES
 */
...

/***************************************************************************************************
 * OVERRIDES
 */ 
...
```

### Import the Module

> Make sure to have the following module imports in your app as well:  
> `BrowserAnimationsModule`, `RouterModule` and `ApplicationInsightsModule`

```typescript
import { ShareButtonModule } from '@schaeffler/share-button';

@NgModule({
  ...
  imports: [
    ShareButtonModule,
    ...
  ]
  ...
})
```

### Embed the component in your template

```html
<!-- comp-xy.component.html -->

<schaeffler-share-button></schaeffler-share-button>
```

### i18n

The lib comes with translations for the following languages:

* de (german 🇩🇪)
* en (english 🇬🇧)
* es (spanish 🇪🇸)
* fr (french 🇫🇷)
* ru (russian 🇷🇺)
* zh (chinese 🇨🇳)

## Development

### Run Tests

#### Lint

```shell
nx lint shared-ui-share-button
```

#### Unit Tests

```shell
nx test shared-ui-share-button
```

### Run build

```shell
nx run shared-ui-share-button:build
```
