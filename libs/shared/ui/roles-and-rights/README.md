# frontend@schaeffler "Rights & Roles" Documentation

This is a unified but also flexible component to display the user's rights and roles.

## Usage

### Prerequisites

As this lib depends on [Angular Material](https://material.angular.io) and [Tailwind](https://tailwindcss.com/docs), it is necessary to import the following styles in your app's `styles.scss` as shown in the recommended order:

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

import { RolesAndRightsModule } from '@schaeffler/roles-and-rights';

@NgModule({
  ...
    imports: [
  RolesAndRightsModule,
  ...
]
...
})
```

### Embed the Template (example)

In the parent component:

```ts
import { Role, RolesGroup } from '@schaeffler/roles-and-rights';

@Component({
  selector: 'my-component',
  templateUrl: './my.component.html',
})
export class MyComponent {

  public roles: Role[] = [
    {
      title: 'Role Title 1',
      rights: 'my  first rights',
    },
    {
      title: 'Role Title 2',
      rights: 'my  first rights',
    },
  ];

  // or 
  
  public rolesGroups: RolesGroup[] = [
    {
      title: 'Role Group Title 1',
      roles: this.roles,
    },
    {
      title: 'Role Group Title 2',
      roles: this.roles,
    },
  ];
}
```

```html

<!--  for grouped roles  -->
<schaeffler-roles-and-rights [rolesGroups]="rolesGroups"></schaeffler-roles-and-rights>

<!--  for standalone roles  -->
<schaeffler-roles-and-rights [roles]="roles"></schaeffler-roles-and-rights>

<!--  with custom heading -->
<schaeffler-roles-and-rights
  headingText="My Custom Heading Text"
  [roles]="roles"
></schaeffler-roles-and-rights>
```

### API

| Name           | Description                                                                                                      |
| ---------------| -----------------------------------------------------------------------------------------------------------------|
| headingText    | (optional) set custom heading of the component, a multi-language default is available                            |
| showHeading    | (optional) (default: true) Whether the heading should be displayed or not                                        |
| rolesGroups    | (optional) a grouped set of roles with the associated rights                                                     |
| roles          | (optional) a standalone set of roles with the associated rights                                                  |

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
$ nx lint shared-ui-roles-and-rights
```

#### Unit Tests

```shell
$ nx test shared-ui-roles-and-rights
```

### Run build

```shell
$ nx run shared-ui-roles-and-rights
```
