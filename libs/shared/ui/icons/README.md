# shared-ui-icons

The icons lib is used when the application is using schaeffler icons.
Therefore this lib offers a service to expand the icon set of the angular material icon (`mat-icon`)
to also use schaeffler-icons as svgIcons

## Usage

Add the Schaeffler icon set to your app assets in `angular.json` at the build options.

Example:
```json
            "options": {
              "assets": [
                {
                  "glob": "schaeffler-icon-set.svg",
                  "input": "./libs/shared/ui/icons/assets/schaeffler-icons",
                  "output": "/assets/"
                }
              ],
            }
```

If your project is not inside the Schaeffler frontend monorepo a different input path is required.

Example:
```json
            "options": {
              "assets": [
                {
                  "glob": "schaeffler-icon-set.svg",
                  "input": "./node_modules/@schaeffler/icons/assets/schaeffler-icons",
                  "output": "/assets/"
                }
              ],
            }
```

To be able to use schaeffler-icons with `mat-icon` and "schaeffler-icons" as `svgIcon` import the `IconsModule` and `MatIconModule`
into your app module:

```typescript
import { IconsModule } from '@schaeffler/icons';
import { MatIconModule } from '@angular/material/icon';
```

Also dont forget to add it into the app module imports array.

Now the schaeffler-icons set is registered in your application and you can use it as following.

```html
 <mat-icon svgIcon="YOUR_SCHAEFFLER_ICON_VALUE"></mat-icon>
```

Example:
```html
 <mat-icon svgIcon="icon-bearing"></mat-icon> 
```

You can still use `mat-icon` with material-icons as usual like

```html
 <mat-icon>YOUR_MATERIAL_ICON_VALUE</mat-icon>
```

Example:
```html
 <mat-icon>chevron_right</mat-icon>
```

You have to set the font-family, ideally for the whole appp in the `styles.scss`

```scss

.material-icons {
  font-family: 'Material Icons' !important;
}
```

## Adding new icons to the set

The provided icon set only bundles currently used icons, which are not provided within material-icons.

To add a new one the process to follow is:
- add the new svg file in the lib assets
- copy the whole `<svg>` block from the file and add it in the `<defs>` section of the `schaeffler-icon-set.svg` file
- add an `id` attribute to the new element (this id will be the name of the icon, which will be used in applications)

## Running unit tests

Run `nx test shared-schaeffler-icons` to execute the unit tests.