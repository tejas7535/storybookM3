# Changelog

All notable changes to this project will be documented in this file. See [standard-version](https://github.com/conventional-changelog/standard-version) for commit guidelines.

## [1.6.0](https://gitlab.schaeffler.com/frontend-schaeffler/schaeffler-frontend/compare/v1.5.0...v1.6.0) (2020-09-11)


### 🎸 Features

* **deps:** update to angular v10.1 and typescript 4.0.2 ([edc0bb1](https://gitlab.schaeffler.com/frontend-schaeffler/schaeffler-frontend/commit/edc0bb1d32af1b0b585de3f79bc96eaf393c240e))
* **empty-state:** use view engine for build (UFTABI-2917) ([34a16b1](https://gitlab.schaeffler.com/frontend-schaeffler/schaeffler-frontend/commit/34a16b189b73e97dd86d10bbf936a836468ac0f3))

## [1.5.0](https://gitlab.schaeffler.com/frontend-schaeffler/schaeffler-frontend/compare/v1.4.0...v1.5.0) (2020-08-27)


### 🎸 Features

* **sta:** use api management urls ([5c876e4](https://gitlab.schaeffler.com/frontend-schaeffler/schaeffler-frontend/commit/5c876e4d39eb1238eb3f00a8cc2c34d9d967588a))
* **styles:** make styles lib publishable (UFTABI-2916) ([245e355](https://gitlab.schaeffler.com/frontend-schaeffler/schaeffler-frontend/commit/245e355c6de4dafff18bdf03301074adb41669c3))

### [1.3.1](https://gitlab.schaeffler.com/frontend-schaeffler/schaeffler-frontend/compare/v1.3.0...v1.3.1) (2020-08-12)


### 🏭 Automation

* **workspace:** run tslint in parallel (UFTABI-2750) ([94c6c7e](https://gitlab.schaeffler.com/frontend-schaeffler/schaeffler-frontend/commit/94c6c7e196be1a304f85559a4f35f4d1adccc439))

## [1.3.0](https://gitlab.schaeffler.com/frontend-schaeffler/schaeffler-frontend/compare/v1.2.0...v1.3.0) (2020-08-07)


### 🎸 Features

* **auth:** make auth library publishable (UFTABI-2636) ([26833ff](https://gitlab.schaeffler.com/frontend-schaeffler/schaeffler-frontend/commit/26833ffdccd5dc448e99130de7fd240462721e02))
* **empty-states:** migrate lib to publishable lib (UFTABI-2635) ([977435f](https://gitlab.schaeffler.com/frontend-schaeffler/schaeffler-frontend/commit/977435f2481c68dcb842cbe3f3aaa93302e0175d))
* **sta:** use shared auth library (UFTABI-2265) ([3eb7c69](https://gitlab.schaeffler.com/frontend-schaeffler/schaeffler-frontend/commit/3eb7c69b3c6aec1b05766205d06f87ce4c821d7a))

## [1.2.0](https://gitlab.schaeffler.com/frontend-schaeffler/schaeffler-frontend/compare/v1.1.0...v1.2.0) (2020-07-21)


### 🎸 Features

* **auth:** enable code flow (UFTABI-2237) ([d9b4ffa](https://gitlab.schaeffler.com/frontend-schaeffler/schaeffler-frontend/commit/d9b4ffa0452b69f4547db98f0698f8f9d8eabd91))
* **sta:** add text classification (UFTABI-2553) ([e90b7c8](https://gitlab.schaeffler.com/frontend-schaeffler/schaeffler-frontend/commit/e90b7c86a728d146760dfdadd6b0714b6529d675))

### [0.5.1](https://gitlab.schaeffler.com/frontend-schaeffler/schaeffler-frontend/compare/v0.5.0...v0.5.1) (2020-07-01)


### 🐛 Bug Fixes

* **sta:** bugfix for handle busy AI response (UFTABI-2388) ([fd0df49](https://gitlab.schaeffler.com/frontend-schaeffler/schaeffler-frontend/commit/fd0df49f5220c70db5f84d0c73abb45cbbf8d523))
* **sta:** green color for buttons ([60085d9](https://gitlab.schaeffler.com/frontend-schaeffler/schaeffler-frontend/commit/60085d91c177d7001d435915b838f2351d410482))
* **sta:** hide sidebar on default on mobile (UFTABI-2539) ([5825774](https://gitlab.schaeffler.com/frontend-schaeffler/schaeffler-frontend/commit/5825774b061b29c53e3183898f84264bf0550e67))


### 🎸 Features

* **settings-sidebar:** add storybook stories (UFTABI-2515) ([fd67e76](https://gitlab.schaeffler.com/frontend-schaeffler/schaeffler-frontend/commit/fd67e760086bc3baf13c53ca954678ec5dfec4a6))
* **sta:** handle busy response (UFTABI-2388) ([aa460b1](https://gitlab.schaeffler.com/frontend-schaeffler/schaeffler-frontend/commit/aa460b193b0f0996e0bc175012f4d60815707db3))
* **sta:** remove unwanted color on button icon ([4c6dc18](https://gitlab.schaeffler.com/frontend-schaeffler/schaeffler-frontend/commit/4c6dc18d45b258d98f78c143d3f78c89699b952e))
* **workspace:** fix remaining checkstyle issues (UFTABI-2475) ([85e60c6](https://gitlab.schaeffler.com/frontend-schaeffler/schaeffler-frontend/commit/85e60c64358058127774aec52f72082721e984d8))
* release v1 (UFTABI-2483) ([79c1ba7](https://gitlab.schaeffler.com/frontend-schaeffler/schaeffler-frontend/commit/79c1ba7c6c1af8ccd909083d91fffbe0ae017ebb))

## [1.0.0](https://gitlab.schaeffler.com/frontend-schaeffler/schaeffler-frontend/compare/v0.5.0...v1.0.0) (2020-06-02)

**⚠ First official release that contains all previous releases ⚠**

## [0.4.0](https://gitlab.schaeffler.com/frontend-schaeffler/schaeffler-frontend/compare/v0.3.0...v0.4.0) (2020-05-13)


### ⚠ BREAKING CHANGES

* **header:** Header, Responsive and Transloco are moved to new publishable libraries (@schaeffler/shared/ui-components --> `@schaeffler/header`; @schaeffler/shared/responsive --> `@schaeffler/responsive`; @schaeffler/shared/transloco--> `@schaeffler/transloco`)

### 🎸 Features

* **footer:** bottom sticky footer (UFTABI-2263) ([4eec24e](https://gitlab.schaeffler.com/frontend-schaeffler/schaeffler-frontend/commit/4eec24e73bc931bac85a311293420745048ad82a))
* **footer:** extract footer to its own lib (DSCDA-2311) ([3a3e8fb](https://gitlab.schaeffler.com/frontend-schaeffler/schaeffler-frontend/commit/3a3e8fb00f23a065dfe021de09205ec6d408b0b8))
* **header:** split header into seperate publishable lib (UFTABI-2309) ([721ead8](https://gitlab.schaeffler.com/frontend-schaeffler/schaeffler-frontend/commit/721ead8681c9ce017e6ff939911dc31d449831f7))
* **sidebar:** split sidebar into separate publishable lib (UFTABI-2310) ([94f2ba5](https://gitlab.schaeffler.com/frontend-schaeffler/schaeffler-frontend/commit/94f2ba5421d4d12af18cb0efe25fe52fbd6893c0))
* **workspace:** enable custom changelogs for each project ([5e07b00](https://gitlab.schaeffler.com/frontend-schaeffler/schaeffler-frontend/commit/5e07b0064e287f9c8f5187b96617c9f685089052))
