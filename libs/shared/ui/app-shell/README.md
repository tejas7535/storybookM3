# frontend@schaeffler AppShell Documentation

UI App-Shell component to provide a framework of UI components with header and left sidebar. This is designed to make several UI libs obsolete, such as sidebars and headers.

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
@use '~@angular/material' as mat;
@import 'https://fonts.googleapis.com/icon?family=Material+Icons';

@import 'libs/shared/ui/styles/src/lib/material-theme';
@include mat.core();
@include mat.all-component-themes($schaeffler-theme);

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

### Import the Module

```ts
// app.modules.ts or core.modules.ts

import { AppShellModule } from '@schaeffler/app-shell';

@NgModule({
  ...
    imports: [
  AppShellModule,
  ...
]
...
})
```

### Embed the Template (example)

In your app's `app.component.html`:

```html
<schaeffler-app-shell
  [appTitle]="'Hello App Title'"
  [appTitleLink]="'/homepage'"
  [hasSidebarLeft]="true"
  [userName]="'Hello User Name'"
  [userImageUrl]="'http://hello.user.avatar.url'"
>
  <ng-container sidenavBody>
    <h2>Hello Sidenav</h2>
  </ng-container>
  <ng-container mainContent>
    <h1>Hello Main Content</h1>
  </ng-container>
</schaeffler-app-shell>
```

### API

| Name           | Description                                                                              |
 | ---------------| -----------------------------------------------------------------------------------------|
| appTitle       | app title to be displayed in the top header                                              |
| appTitleLink   | (optional) Angular Router Link path on the title                                         |
| hasSidebarLeft | (optional) (default: false) Whether there should be a left sidebar                       |
| userName       | (optional) user name to be displayed in the left sidebar - hasSidebarLeft must be true   |
| userImageUrl   | (optional) user avatar to be displayed in the left sidebar - hasSidebarLeft must be true |

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
$ nx lint shared-ui-app-shell
```

#### Unit Tests

```shell
$ nx test shared-ui-app-shell
```

### Run build

```shell
$ nx run shared-ui-app-shell:build
```
