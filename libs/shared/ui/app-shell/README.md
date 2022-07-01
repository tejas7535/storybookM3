# frontend@schaeffler AppShell Documentation

UI App-Shell component to provide a framework of UI components with header and left sidebar. This is designed to make several UI libs obsolete, such as sidebars and headers.

## Usage

### Prerequisites

This lib depends on [Angular Material](https://material.angular.io) (including [Material Icons](https://fonts.google.com/icons)) and [Tailwind](https://tailwindcss.com/docs). Material Icons should not be used from CDN but installed e.g. with [https://fontsource.org/docs/icons/material-icons](). It is necessary to import the following styles in your app's `styles.scss` as shown in the recommended order:

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

In your app's `app.component`:

```ts
import { AppShellFooterLink } from '@schaeffler/app-shell';
import packageJson from '../../package.json';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
})
export class AppComponent {

  public appVersion = packageJson.version;
  public footerLinks: AppShellFooterLink[] = [
    {
      link: 'some.url',
      title: 'External Link Title',
      external: true,
    },
    {
      link: 'some.url',
      title: 'Internal Link Title',
      external: false,
    },
  ];
}
```

```html
<schaeffler-app-shell
  [appTitle]="'Hello App Title'"
  [appTitleLink]="'/homepage'"
  [hasSidebarLeft]="true"
  [userName]="'Hello User Name'"
  [userImageUrl]="'http://hello.user.avatar.url'"
  [footerLinks]="footerLinks"
  [appVersion]="appVersion"
>
  <ng-container sidenavBody>
    <h2>Hello Sidenav</h2>
  </ng-container>
  <ng-container mainContent>
    <div class="h-full w-full"> // if necessary wrap the main content in a full-width, full-height container
      <h1>Hello Main Content</h1>
    </div>  
  </ng-container>
</schaeffler-app-shell>
```

### API

| Name           | Description                                                                                                      |
| ---------------| -----------------------------------------------------------------------------------------------------------------|
| appTitle       | app title to be displayed in the top header                                                                      |
| appTitleLink   | (optional) Angular Router Link path on the title                                                                 |
| hasSidebarLeft | (optional) (default: false) Whether there should be a left sidebar                                               |
| userName       | (optional) user name to be displayed in the left sidebar - hasSidebarLeft must be true                           |
| userImageUrl   | (optional) user avatar to be displayed in the left sidebar - hasSidebarLeft must be true                         |
| hasFooter      | (optional) (default: false) Whether a footer is shown or not. Defaults to "true" when there are footerLinks.     |
| footerLinks    | (optional) array of typed (internal and external) links, displayed in the footer. Overrides `hasFooter: false`   |
| footerFixed    | (optional) (default: true) Whether the footer should be fixed on the bottom of the window                        |
| appVersion     | (optional) String with your app's version number, display next to the footer links                               |

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
