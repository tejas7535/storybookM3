# Frontend@Schaeffler

![version](https://img.shields.io/badge/version-v110.0.0-green.svg)
![@nrwl/workspace: 14.4.2](https://img.shields.io/badge/%40nrwl%2Fworkspace-14.4.2-brightgreen)
![typescript: 4.7.4](https://img.shields.io/badge/typescript-4.7.4-brightgreen)
![@angular/core: 14.0.5](https://img.shields.io/badge/%40angular%2Fcore-14.0.5-brightgreen)
![@angular/cli: 14.0.5](https://img.shields.io/badge/%40angular%2Fcli-14.0.5-brightgreen)
![@angular/cdk: 14.0.4](https://img.shields.io/badge/%40angular%2Fcdk-14.0.4-brightgreen)
![@angular/material: 14.0.4](https://img.shields.io/badge/%40angular%2Fmaterial-14.0.4-brightgreen)
![@ngrx/store: 14.0.2](https://img.shields.io/badge/%40ngrx%2Fstore-14.0.2-brightgreen)
![jest: 28.1.2](https://img.shields.io/badge/jest-28.1.2-brightgreen)
![cypress: 7.3.0](https://img.shields.io/badge/cypress-7.3.0-brightgreen)
![prettier: 2.7.1](https://img.shields.io/badge/prettier-2.7.1-brightgreen)
![tailwindcss: 3.1.6](https://img.shields.io/badge/tailwindcss-3.1.6-brightgreen)

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

### NX Quick Start & Documentation

[Nx Documentation](https://nx.dev)

[30-minute video showing all Nx features](https://nx.dev/getting-started/what-is-nx)

[Interactive Tutorial](https://nx.dev/tutorial/01-create-application)

### NX CLI

NX Schematics extend the [Angular CLI Schematics](https://cli.angular.io/), so all commands can be used.

### Generating Components/Services

Components can be generated with the `ng g` commands. To use `scss`, `spectator` and `jest`, the following commands come in handy

```shell
nx g @ngneat/spectator:spectator-component component-name

nx g @ngneat/spectator:spectator-service service-name
```

### Run Storybook locally

`nx run shared-ui-storybook:storybook`

## Project Setup

### Create a new application

- Run `npx nx workspace-generator new-app`
- Follow the setup guide
- The app will be generated for you with our workspace defaults

If the `workspace-generator` fails, run following tasks and repeat the steps above:

- Run `node ./tools/npm-scripts/npm-force-resolutions-sync.js`
- Run `npm run force-resolutions`

### Further Adaptions

Configuration:

- If you want to apply more complex configuration scenarios, please get in touch with us first in order to discuss your needs.

Styles:

- Import common styles from the `@schaeffler/styles` package with `@import 'libs/shared/ui/styles/src/<package>';` to your app's `styles.scss`. Be cautious: Only import what you need, in order to keep the bundle size small.
- Add required fonts to your style section in the `angular.json` or `project.json` like so:

```
...
"styles": [
    "apps/cdba/src/styles.scss",
    "node_modules/@fontsource/material-icons/400.css",
    "node_modules/@fontsource/roboto/300.css",
    "node_modules/@fontsource/roboto/400.css",
    "node_modules/@fontsource/roboto/500.css"
],
...
```

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
- [Fabian Kaupp](https://github.com/kauppfbi_SGGIT) 🎧
- [Robert Krause](https://github.com/krausrbe_SGGIT) 🎣
- [Christian Berndt](https://github.com/berndcri_SGGIT) 👇
- [Stefan Herpich](https://github.com/herpisef_SGGIT) 🚴
- [Thomas Birke](https://github.com/birketho_SGGIT) 🍼
- [Pascal Söhnlein](https://github.com/soehnpsc_SGGIT) 🚀
- [Borys Juskiw](https://github.com/juskibry_SGGIT) 🐕
- [Sven Pelzer](https://github.com/PELZESEN_SGGIT) 🤙
- [Jan Meiswinkel](https://github.com/meiswjn_SGGIT) 💻
- [Philip Riecks (ext.)](https://github.com/mailphilipriecksde_SGGIT) 🎩
- [Yuqiu Ge](https://github.com/yuqiugegmailcom_SGGIT) 🧑‍💻
- [Tino Götz](https://github.com/tgoetzcissolutionseu_SGGIT) 🐸
- [Stefan Spieker](https://github.com/SPIEKSEF_SGGIT) 🏸
- [Benjamin Geissler](https://github.com/geissbnj_SGGIT) 🧬
- [Maciej Przybysz](https://github.com/przybmci_SGGIT) 🐙

