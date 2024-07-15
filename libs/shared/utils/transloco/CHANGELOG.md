# Release Notes of Library Shared Utils Transloco
## [4.4.0](https://github.com/Schaeffler-Group/frontend-schaeffler/compare/transloco-v4.3.0...transloco-v4.4.0) (2024-07-15)


### Features

* **workspace:** update to angular 18 and nx 19 ([#6259](https://github.com/Schaeffler-Group/frontend-schaeffler/issues/6259)) ([c2fec3b](https://github.com/Schaeffler-Group/frontend-schaeffler/commit/c2fec3befeaa072f87bfc4c195262d71c2b18ecf))


### Bug Fixes

* **transloco:** fix angular lifecycle for availableLocales and defaultLocale ([#6250](https://github.com/Schaeffler-Group/frontend-schaeffler/issues/6250)) ([0ae66ed](https://github.com/Schaeffler-Group/frontend-schaeffler/commit/0ae66edfd9fef7fe14f003929daf85bfad9cee58))

## [4.3.0](https://github.com/Schaeffler-Group/frontend-schaeffler/compare/transloco-v4.2.0...transloco-v4.3.0) (2024-06-11)


### Features

* **shared-utils-transloco:** upgrade transloco to v7.0.0 ([#6116](https://github.com/Schaeffler-Group/frontend-schaeffler/issues/6116)) ([8babb22](https://github.com/Schaeffler-Group/frontend-schaeffler/commit/8babb222d49c8ef69fd677d632ac6b87852f3caa))
* **transloco:** migrate to mdc components ([#5868](https://github.com/Schaeffler-Group/frontend-schaeffler/issues/5868)) ([cae3511](https://github.com/Schaeffler-Group/frontend-schaeffler/commit/cae3511f825b48176bcd5e990e129cde254a6646))
* **workspace:** migrate to control flow ([#6101](https://github.com/Schaeffler-Group/frontend-schaeffler/issues/6101)) ([bcc2f0d](https://github.com/Schaeffler-Group/frontend-schaeffler/commit/bcc2f0de21ab75dcdceb320c21268074e0940dc9))
* **workspace:** upgrade to angular 17 ([#6032](https://github.com/Schaeffler-Group/frontend-schaeffler/issues/6032)) ([2f32e47](https://github.com/Schaeffler-Group/frontend-schaeffler/commit/2f32e478cb1b1c95ac48976332011c60ce28f4e4))


### Bug Fixes

* **transloco:** hide tick in language and locale select ([#6113](https://github.com/Schaeffler-Group/frontend-schaeffler/issues/6113)) ([f9be8c0](https://github.com/Schaeffler-Group/frontend-schaeffler/commit/f9be8c0c17977014320aa76e7dc7ccac4dec5c97))
* **transloco:** manually check for browser language without default lang ([#6176](https://github.com/Schaeffler-Group/frontend-schaeffler/issues/6176)) ([8a5a06b](https://github.com/Schaeffler-Group/frontend-schaeffler/commit/8a5a06b554b02768e76ca389c02df184dd468258))

## [4.2.0](https://github.com/Schaeffler-Group/frontend-schaeffler/compare/transloco-v4.1.1...transloco-v4.2.0) (2023-12-14)


### Features

* **transloco:** add translations to localization components ([#5827](https://github.com/Schaeffler-Group/frontend-schaeffler/issues/5827)) ([e776740](https://github.com/Schaeffler-Group/frontend-schaeffler/commit/e7767400b66341b7cd2a806e267e815dc76db229))

## [4.1.1](https://github.com/Schaeffler-Group/frontend-schaeffler/compare/transloco-v4.1.0...transloco-v4.1.1) (2023-09-25)

## [4.1.0](https://github.com/Schaeffler-Group/frontend-schaeffler/compare/transloco-v4.0.4...transloco-v4.1.0) (2023-09-22)


### Features

* **app-shell:** update peer dependencies (5339) ([#5417](https://github.com/Schaeffler-Group/frontend-schaeffler/issues/5417)) ([8fa655b](https://github.com/Schaeffler-Group/frontend-schaeffler/commit/8fa655b608a94cb6e20d54e73187f3efb7ec750e))
* **ga:** add japanese translations (UFTABI-6210) ([#4935](https://github.com/Schaeffler-Group/frontend-schaeffler/issues/4935)) ([f7a870b](https://github.com/Schaeffler-Group/frontend-schaeffler/commit/f7a870bb9f5b52b194765cea6e3615aa9c0aeb29))
* **transloco:** add loader path parameter ([#5126](https://github.com/Schaeffler-Group/frontend-schaeffler/issues/5126)) ([dcb30e8](https://github.com/Schaeffler-Group/frontend-schaeffler/commit/dcb30e8c553f05e09f3514803ebc5f35cc1ed6af))

## [4.0.4](https://github.com/Schaeffler-Group/frontend-schaeffler/compare/transloco-v4.0.3...transloco-v4.0.4) (2023-01-09)

### [4.0.3](https://github.com/Schaeffler-Group/frontend-schaeffler/compare/transloco-v4.0.2...transloco-v4.0.3) (2023-01-03)


### 🏭 Automation

* **workspace:** use pnpm as package and node version manager ([35e04db](https://github.com/Schaeffler-Group/frontend-schaeffler/commit/35e04dba206a3d579156300c68b2ede9206556ff))

### [4.0.2](https://github.com/Schaeffler-Group/frontend-schaeffler/compare/transloco-v4.0.1...transloco-v4.0.2) (2022-11-16)

### [4.0.1](https://github.com/Schaeffler-Group/frontend-schaeffler/compare/transloco-v4.0.0...transloco-v4.0.1) (2022-09-20)

## [4.0.0](https://github.com/Schaeffler-Group/frontend-schaeffler/compare/transloco-v3.3.1...transloco-v4.0.0) (2022-08-24)


### ⚠ BREAKING CHANGES

* **transloco:** Every app which uses the SharedTranslocoModule needs to add one more parameter:
localStorageKey. This should be the key of the local storage item or undefined if the language is
not persisted in local storage

### 🐛 Bug Fixes

* **gq:** fixed issue with persisting language (GQUOTE-1520) ([#4377](https://github.com/Schaeffler-Group/frontend-schaeffler/issues/4377)) ([61c5f5f](https://github.com/Schaeffler-Group/frontend-schaeffler/commit/61c5f5ff1a53dd8a74a99112e9acb4511157dcc6))
* **transloco:** mobile a11y for locale select tooltip (UFTABI-5968) ([2ad44b8](https://github.com/Schaeffler-Group/frontend-schaeffler/commit/2ad44b8b8b7836b352a8e66c273a7af3c7f8b2a8))
* **transloco:** sets the language saved in local storage as default active language ([492d5f5](https://github.com/Schaeffler-Group/frontend-schaeffler/commit/492d5f59ebe303afd53d051f947553a57dc6aa13))

### [3.3.1](https://github.com/Schaeffler-Group/frontend-schaeffler/compare/transloco-v3.3.0...transloco-v3.3.1) (2022-07-20)

## [3.3.0](https://github.com/Schaeffler-Group/frontend-schaeffler/compare/transloco-v3.2.0...transloco-v3.3.0) (2022-07-07)


### 🐛 Bug Fixes

* **transloco:** properly configure tailwind content configuration ([3ada7bb](https://github.com/Schaeffler-Group/frontend-schaeffler/commit/3ada7bb65f1656c4230d2a73cd46268e0b339971))


### 🎸 Features

* **styles:** add tailwind to styles lib ([#3573](https://github.com/Schaeffler-Group/frontend-schaeffler/issues/3573)) ([#4104](https://github.com/Schaeffler-Group/frontend-schaeffler/issues/4104)) ([d32b170](https://github.com/Schaeffler-Group/frontend-schaeffler/commit/d32b170c13de73f90b3a792d9f50f29cede37898)), closes [#3753](https://github.com/Schaeffler-Group/frontend-schaeffler/issues/3753)
* **transloco:** add messageformat to support pluralization in translations ([#4282](https://github.com/Schaeffler-Group/frontend-schaeffler/issues/4282)) ([048e3c7](https://github.com/Schaeffler-Group/frontend-schaeffler/commit/048e3c7ade732b794618740df19695d537bce727))
* **transloco:** take language changes from outside in consideration ([041402d](https://github.com/Schaeffler-Group/frontend-schaeffler/commit/041402d95ca189f9d488ac7de0d4756ecb3ed0b3))

## [3.2.0](https://github.com/Schaeffler-Group/frontend-schaeffler/compare/transloco-v3.1.0...transloco-v3.2.0) (2022-03-22)


### ✏️ Documentation

* adjust to suggest material icon source ([a73e91b](https://github.com/Schaeffler-Group/frontend-schaeffler/commit/a73e91b89002ba7f7768461b1fae6713cc88a30a))


### 🎸 Features

* **transloco:** extend root tailwind config ([883f188](https://github.com/Schaeffler-Group/frontend-schaeffler/commit/883f188e9a667651cef38f0cac894c673c7ad13d))
* **transloco:** implement locale select ([#3192](https://github.com/Schaeffler-Group/frontend-schaeffler/issues/3192)) ([25a3327](https://github.com/Schaeffler-Group/frontend-schaeffler/commit/25a332787edce243876002594a5f8484f77f3427))


### 🐛 Bug Fixes

* **transloco:** fix html format issues ([c1e9e7b](https://github.com/Schaeffler-Group/frontend-schaeffler/commit/c1e9e7bbfe7f482e37c99db62e264feea6e65f86))
* **workspace:** fix eslint configuration for local and ci execution ([#3598](https://github.com/Schaeffler-Group/frontend-schaeffler/issues/3598)) ([4a7dc1f](https://github.com/Schaeffler-Group/frontend-schaeffler/commit/4a7dc1fe79d94b6d8ddfa7cf2644e3bbc11a3e80))
* **workspace:** re-activate eslint rule ([#3599](https://github.com/Schaeffler-Group/frontend-schaeffler/issues/3599)) ([#3873](https://github.com/Schaeffler-Group/frontend-schaeffler/issues/3873)) ([b38665d](https://github.com/Schaeffler-Group/frontend-schaeffler/commit/b38665d76345a952f77da1ae28c7726397e8c010))

## [3.1.0](https://github.com/Schaeffler-Group/frontend-schaeffler/compare/transloco-v3.0.2...transloco-v3.1.0) (2022-01-11)


### 🐛 Bug Fixes

* **transloco:** 2nd entry point for testing module ([f2c1339](https://github.com/Schaeffler-Group/frontend-schaeffler/commit/f2c13390fd329ce4d1d69435d6324f91aafc21af))
* **transloco:** imports in tests & readme updated ([c32329c](https://github.com/Schaeffler-Group/frontend-schaeffler/commit/c32329ce19668460abac5b3997f0e937b3bfe5ba))
* **transloco:** use english for missing keys ([#3234](https://github.com/Schaeffler-Group/frontend-schaeffler/issues/3234)) ([3553c7b](https://github.com/Schaeffler-Group/frontend-schaeffler/commit/3553c7b93006707fd0a52f26058fdf3ae05a7774))


### 🎸 Features

* enable strictTemplate rule for all libs ([#3323](https://github.com/Schaeffler-Group/frontend-schaeffler/issues/3323)) ([55d8aef](https://github.com/Schaeffler-Group/frontend-schaeffler/commit/55d8aefd36823a5774979b7393cbe4dff41ba7de))
* **storybook:** add language select to storybook preview ([228992d](https://github.com/Schaeffler-Group/frontend-schaeffler/commit/228992dc7116e66f7551679ffed0978b682e46a5))
* **transloco:** add transloco-locale plugin ([f8fd3dc](https://github.com/Schaeffler-Group/frontend-schaeffler/commit/f8fd3dc4ce3592a026847296e6550c9d846c6a4b))
* **transloco:** implement shared component "language-select" ([#3191](https://github.com/Schaeffler-Group/frontend-schaeffler/issues/3191)) ([a675e8a](https://github.com/Schaeffler-Group/frontend-schaeffler/commit/a675e8a14572aec7dfb60da4674738ff2450b67c))
* **workspace:** individual project configurations instead of one global ([#3248](https://github.com/Schaeffler-Group/frontend-schaeffler/issues/3248)) ([ba451ef](https://github.com/Schaeffler-Group/frontend-schaeffler/commit/ba451ef87c9c9cff99440b9739c9ebf4069a16dc))
* **workspace:** update core dependencies ([#3381](https://github.com/Schaeffler-Group/frontend-schaeffler/issues/3381)) ([#3383](https://github.com/Schaeffler-Group/frontend-schaeffler/issues/3383)) ([3c7b0a3](https://github.com/Schaeffler-Group/frontend-schaeffler/commit/3c7b0a37be3104fc216c3ee6506d5f8ce2cadb21))
* **workspace:** use eslint for sorting of imports ([#3424](https://github.com/Schaeffler-Group/frontend-schaeffler/issues/3424)) ([546e884](https://github.com/Schaeffler-Group/frontend-schaeffler/commit/546e8845a9250580ccdc982e3f5c1d818f8678bd))

### [3.0.2](https://github.com/Schaeffler-Group/frontend-schaeffler/compare/transloco-v3.0.2...transloco-v3.0.0) (2021-09-09)

### [3.0.1](https://github.com/Schaeffler-Group/frontend-schaeffler/compare/transloco-v3.0.1...transloco-v3.0.0) (2021-09-07)

## [3.0.0](https://github.com/Schaeffler-Group/frontend-schaeffler/compare/transloco-v3.0.0...transloco-v2.5.0) (2021-09-07)


### ⚠ BREAKING CHANGES

* **transloco:** update peer dependencies

### 🎸 Features

* **libs:** adjust rxjs and ngrx versions ([f6c92d8](https://github.com/Schaeffler-Group/frontend-schaeffler/commit/f6c92d81ace947127362bd322283a8ac925ab998))
* **libs:** use partial compilation (UFTABI-4907) ([#2835](https://github.com/Schaeffler-Group/frontend-schaeffler/issues/2835)) ([27829ff](https://github.com/Schaeffler-Group/frontend-schaeffler/commit/27829ff96da6ccc3a4ee0b98bc6f766a8c4a5057))
* **transloco:** update peer dependencies ([3646d5c](https://github.com/Schaeffler-Group/frontend-schaeffler/commit/3646d5c91091e3683a1d588a38fb5faa07e9dfe9))

## [2.5.0](https://github.com/Schaeffler-Group/frontend-schaeffler/compare/transloco-v2.5.0...transloco-v2.4.1) (2021-08-24)


### 🎸 Features

* **workspace:** fix accessibility and numerical separator issues (UFTABI-4728) ([699fb97](https://github.com/Schaeffler-Group/frontend-schaeffler/commit/699fb97a63a9069d847dfa489386da561028e5ea))


### 🐛 Bug Fixes

* **storybook:** fix transloco usage ([#2705](https://github.com/Schaeffler-Group/frontend-schaeffler/issues/2705)) ([463eb94](https://github.com/Schaeffler-Group/frontend-schaeffler/commit/463eb9486fca3c66236f4e0a1b38c4c52d8e5f9a))

### [2.4.1](///compare/transloco-v2.4.1...transloco-v2.4.0) (2021-05-20)

## [2.4.0](///compare/transloco-v2.4.0...transloco-v2.3.0) (2021-04-29)


### 🎸 Features

* **mm:** add manual switch for language and decimal separator ([291504b](///commit/291504b1a4bb92e896514dc2d9f033d7efc67bab))
* **transloco:** update transloco testing module (UFTABI-4323) ([47630c6](///commit/47630c62ca451d70e613182684fc34506a34705a))

## [2.3.0](///compare/transloco-v2.3.0...transloco-v2.1.0) (2021-03-24)


### 🎸 Features

* **transloco:** support cache busting (DSCDA-1780) ([b3977ae](///commit/b3977aefd6534d8be3689f2240bac6f4b5861fa8))
* **workspace:** build libs with prod config (UFTABI-4112) ([6cd84a2](///commit/6cd84a2b3f3b5fe695d93c28e6cf5eb69bf6c205))


### 🐛 Bug Fixes

* **workspace:** adjust libs version ([df88244](///commit/df88244a1a49ef9d4eef59a2e6b2e5cd5e2de976))

## [2.1.0](///compare/transloco-v2.1.0...transloco-v2.0.0) (2021-01-22)


### 🎸 Features

* **deps:** update to nx 11 and fix jest setup ([4df2df3](///commit/4df2df38f8a3fa29abae9b9f736e7d237344541b))

## 2.0.0 (2020-11-25)


### ⚠ BREAKING CHANGES

* **header:** Header, Responsive and Transloco are moved to new publishable libraries (@schaeffler/shared/ui-components --> `@schaeffler/header`; @schaeffler/shared/responsive --> `@schaeffler/responsive`; @schaeffler/shared/transloco--> `@schaeffler/transloco`)

### 🎸 Features

* **libs:** use view engine and prevent barrel imports in banner and transloco (UFTABI-2733, UFTABI-2741) ([79024d5](///commit/79024d550448ec650a612566e85009158fb9788f))
* **workspace:** enable auto-populated publishable library dependencies (UFTABI-2390) ([471e246](///commit/471e246144837957500060590020b380a0940c39))
* release v1 (UFTABI-2483) ([79c1ba7](///commit/79c1ba7c6c1af8ccd909083d91fffbe0ae017ebb))
* **header:** split header into seperate publishable lib (UFTABI-2309) ([721ead8](///commit/721ead8681c9ce017e6ff939911dc31d449831f7))


### 📈 Improvements

* **workspace:** adjust libs to ensure angular 11 compatibility ([08e417a](///commit/08e417a2e3a8c2404681863ff6466216e9ba80c6))

### [1.3.5](///compare/v1.9.0...v1.3.5) (2020-11-02)

### [1.3.4](https://gitlab.schaeffler.com/frontend-schaeffler/schaeffler-frontend/compare/v1.9.0...v1.3.4) (2020-10-27)

### [1.3.3](///compare/v1.7.0...v1.3.3) (2020-10-12)

### [1.3.2](///compare/v1.6.0...v1.3.2) (2020-09-28)

### [1.3.1](///compare/v1.5.0...v1.3.1) (2020-09-11)

## [1.3.0](///compare/v1.4.0...v1.3.0) (2020-08-27)


### 🎸 Features

* **libs:** use view engine and prevent barrel imports in banner and transloco (UFTABI-2733, UFTABI-2741) ([79024d5](///commit/79024d550448ec650a612566e85009158fb9788f))

### [1.2.2](///compare/v1.3.0...v1.2.2) (2020-08-12)

### [1.2.1](///compare/v1.2.0...v1.2.1) (2020-08-07)

## [1.2.0](///compare/v1.1.0...v1.2.0) (2020-07-21)


### 🎸 Features

* **workspace:** enable auto-populated publishable library dependencies (UFTABI-2390) ([471e246](///commit/471e246144837957500060590020b380a0940c39))

## [1.1.0](///compare/v0.5.0...v1.1.0) (2020-07-01)


### 🎸 Features

* release v1 (UFTABI-2483) ([79c1ba7](///commit/79c1ba7c6c1af8ccd909083d91fffbe0ae017ebb))

## [1.0.0](///compare/v0.5.0...v1.0.0) (2020-06-02)

**⚠ First official release that contains all previous releases ⚠**