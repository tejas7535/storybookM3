# Frontend@Schaeffler

![version](https://img.shields.io/badge/version-v1.19.0-green.svg)
![@angular/core: 11.0.2](https://img.shields.io/badge/%40angular%2Fcore-11.0.2-brightgreen)
![@ngrx/store: 10.0.1](https://img.shields.io/badge/%40ngrx%2Fstore-10.0.1-brightgreen)
![@angular/material: 11.0.1](https://img.shields.io/badge/%40angular%2Fmaterial-11.0.1-brightgreen)
![@angular/flex-layout: 11.0.0-beta.33](https://img.shields.io/badge/%40angular%2Fflex--layout-11.0.0--beta.33-brightgreen)
![prettier: 2.2.0](https://img.shields.io/badge/prettier-2.2.0-brightgreen)
![commitizen: 4.2.2](https://img.shields.io/badge/commitizen-4.2.2-brightgreen)

Monorepository based on [Nx](https://nx.dev) to support and improve the development of modern web applications.

- [Frontend@Schaeffler](#frontendschaeffler)
  - [Usage](#usage)
    - [Demo Application](#demo-application)
    - [NX Quick Start & Documentation](#nx-quick-start--documentation)
  - [Project Setup](#project-setup)
    - [Create a new application](#create-a-new-application)
    - [Further Adaptions](#further-adaptions)
  - [Contribution and Terms of Admission](#contribution-and-terms-of-admission)
  - [Changelog](#changelog)
  - [References](#references)
    - [Update Strategy](#update-strategy)
    - [Exit Strategy](#exit-strategy)
    - [Further Documentation](#further-documentation)
  - [Contributors](#contributors)

## Usage

### Demo Application

✨ **Please checkout our [kitchen sink app](./apps/kitchen-sink/README.md) to get started.** ✨

### NX Quick Start & Documentation

[Nx Documentation](https://nx.dev)

[30-minute video showing all Nx features](https://nx.dev/getting-started/what-is-nx)

[Interactive Tutorial](https://nx.dev/tutorial/01-create-application)

### NX CLI

NX Schematics extend the [Angular CLI Schematics](https://cli.angular.io/), so all commands can be used.

### Generating Components/Services

Components can be generated with the `ng g` commands. To use `scss`, `spectator` and `jest`, the following commands come in handy

```
nx g @ngneat/spectator:spectator-component component-name

nx g @ngneat/spectator:spectator-service service-name
```

## Project Setup

### Create a new application

- Run `npx nx workspace-schematic new-app`
- Follow the setup guide
- The app will be generated for you with our workspace defaults

### Further Adaptions

Configuration:

- If you want to apply more complex configuration scenarios, please get in touch with us first in order to discuss your needs.

Styles:

- Import common styles from the `@schaeffler/styles` package with `@import 'libs/shared/ui/styles/src/<package>';` to your app's `styles.scss`. Be cautious: Only import what you need, in order to keep the bundle size small.
- Add `@import 'https://fonts.googleapis.com/icon?family=Material+Icons';` to your app's `styles.scss` to support Material Icons

## Contribution and Terms of Admission

Check out our [contribution guidelines](CONTRIBUTING.md) as well as our [code of conduct](CODE_OF_CONDUCT.md) if you are interested in participating.
If you want to start a new project or integrate an existing one in our repository please read our [terms of admission](https://confluence.schaeffler.com/display/FRON/Terms+of+Admission) carefully.

## Changelog

An overview of the releases including the related changes can be found in our [changelog](CHANGELOG.md).

## References

### Update Strategy

[Update Strategy](https://confluence.schaeffler.com/display/FRON/Update+Strategy) in `Frontend@Schaeffler` Documentation Space.

### Exit Strategy

[Exit Strategy](https://confluence.schaeffler.com/display/FRON/Exit+Strategy) in `Frontend@Schaeffler` Documentation Space.

### Further Documentation

For further Documentation, please see our [Frontend@Schaeffler Documentation Space](https://confluence.schaeffler.com/display/FRON).
If you are missing any content, don't hesitate to contact us in our [Teams Channel](https://teams.microsoft.com/l/team/19%3a2967d889ec6546729254b14c7f06c2b8%40thread.skype/conversations?groupId=a8039948-cbd2-4239-ba69-edbeefadeea2&tenantId=67416604-6509-4014-9859-45e709f53d3f).

## Contributors

Made with ❤️ by

- [Sir Henry](https://gitlab.schaeffler.com/A1173595) 🐶
- [Fabian Kaupp](https://gitlab.schaeffler.com/kauppfbi) 🎧
- [Robert Krause](https://gitlab.schaeffler.com/krausrbe) 🎣
- [Christian Berndt](https://gitlab.schaeffler.com/berndcri) 👇
- [Stefan Herpich](https://gitlab.schaeffler.com/herpisef) 🚴
- [Thomas Birke](https://gitlab.schaeffler.com/birketho) 🍼
- [Pascal Söhnlein](https://gitlab.schaeffler.com/soehnpsc) 🚀

