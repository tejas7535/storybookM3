# frontend@schaeffler Share Button Documentation
A simple lib providing a button that copies the current link to clipboard upon clicking and displays a toast informing the user what happened

## Usage

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
