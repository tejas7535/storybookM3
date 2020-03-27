# icons

The icons lib is used when the application is using schaeffler icons.
Therefore this lib offers a service to expand the icon set of the angular material icon (``` mat-icon ```)
to also use schaeffler-icons with the alias "schaeffler-icons"

## Usage

First check if your application already has schaeffler-icons loaded. There are multiple ways to load the schaeffler-icons style.css. The current standard is to add the css file into the styles array for your app in the ```angular.json```

Example:
``` json
            "styles": [
              "apps/sta/src/styles.scss",
              "node_modules/schaeffler-icons/style.css"
            ],
```

To be able to use schaeffler-icons with ``` mat-icon ``` and "schaeffler-icons" as ``` fontSet ``` import the ``` IconsModule ```
into your app module:

``` typescript
import { IconsModule } from '@schaeffler/shared/icons';
```

Also dont forget to add it into the app module imports array.

Now the schaeffler-icons set is registered in your application and you can use it as following.

```html
 <mat-icon fontSet="schaeffler-icons" fontIcon="YOUR_SCHAEFFLER_ICON_VALUE"></mat-icon>
```

Example:
```html
 <mat-icon fontSet="schaeffler-icons" fontIcon="icon-resize-enlarge"></mat-icon>
```

``` fontSet="schaeffler-icons" ``` sets the specific mat-icon tag to use the schaeffler-icon font instead of the material icon one

You can still use ``` mat-icon ``` with material-icons as usual like

```html
 <mat-icon>YOUR_MATERIAL_ICON_VALUE</mat-icon>
```

Example:
```html
 <mat-icon>chevron_right</mat-icon>
```

## Running unit tests

Run `nx test shared-schaeffler-icons` to execute the unit tests.