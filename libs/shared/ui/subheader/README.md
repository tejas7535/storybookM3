# frontend@schaeffler-tailwind Subheader Documentation

## Disclaimer
This lib depends on the [ngneat/https://github.com/ngneat/tailwind](https://github.com/ngneat/tailwind), so please install it

Afterwards replace the default `tailwind.config.js` with the most current version from the [schaeffler-frontend repo](https://gitlab.schaeffler.com/frontend-schaeffler/schaeffler-frontend/-/blob/master/tailwind.config.js)

Also import the tailwind styles in your app
Example `styles.scss`
``` scss
@import 'tailwindcss/base';
@import 'tailwindcss/components';
@import 'tailwindcss/utilities';
```

## Usage

Import into your project like:

```typescript
// app.modules.ts or core.modules.ts

import { SubheaderModule } from '@schaeffler/subheader';

@NgModule({
  ...
  imports: [
    SubheaderModule,
    ...
  ]
  ...
})
```

API of Subheader Component:

```typescript
  @Input() showBackButton = true // true by default, can be disabled if you want to pass in your own custom backButton via `ng-container`

  @Input() title = '' // title of the subheader

  @Output() backButtonClicked // event that is triggered when the default backButton is clicked, only emitted if @Input() showBackButton = true
```

Use like:

```html
<!-- comp-xy.component.html -->
<schaeffler-subheader title="Search Results | 69 Findings" (backButtonClicked)="navigate()">
  <ng-container breadcrumbs>
    <schaeffler-breadcrumbs [breadcrumbs]="breadcrumbs"></schaeffler-breadcrumbs>
  </ng-container>
  <!-- 
    <ng-container backButton>
      place your own custom back button here
    <ng-container>
  -->
  <!-- 
    <ng-container titleContent>
      place your own custom addtional title content here
    <ng-container>
  -->
  <ng-container header>
    place content here
  <ng-container>
  <ng-container content>
    place content here
  <ng-container>
</schaeffler-subheader>
```

```typescript
// comp-xy.component.ts
  import { Breadcrumb } from '@schaeffler/breadcrumbs';

  public breadcrumbs: BreadCrumbs[] = [
    {label: 'Label', url: '/page', queryParams: {queryParam: 'value'}}
  ]

  public navigate():void {
    // execute navigation logic
  }
```