# Release Notes of Library Shared Utils Azure Auth
## [1.5.0](https://github.com/Schaeffler-Group/frontend-schaeffler/compare/azure-auth-v1.4.1...azure-auth-v1.5.0) (2025-03-04)


### Features

* **azure-auth:** allow configurations of redirects in iFrames ([#6981](https://github.com/Schaeffler-Group/frontend-schaeffler/issues/6981)) ([0f6acc2](https://github.com/Schaeffler-Group/frontend-schaeffler/commit/0f6acc29a1032cd2e02194098c27db828ab96228))

## 1.4.1 (2024-10-25)
Manual release to keep repository in sync with published versions on Artifactory.

## [1.4.0](https://github.com/Schaeffler-Group/frontend-schaeffler/compare/azure-auth-v1.3.0...azure-auth-v1.4.0) (2024-07-15)


### Features

* **workspace:** update to angular 18 and nx 19 ([#6259](https://github.com/Schaeffler-Group/frontend-schaeffler/issues/6259)) ([c2fec3b](https://github.com/Schaeffler-Group/frontend-schaeffler/commit/c2fec3befeaa072f87bfc4c195262d71c2b18ecf))


### Bug Fixes

* **mac:** update validator for upload dialog owner (UFTABI-7733) ([#6308](https://github.com/Schaeffler-Group/frontend-schaeffler/issues/6308)) ([07a8336](https://github.com/Schaeffler-Group/frontend-schaeffler/commit/07a8336013d6c0e6b46b0f281e32025db7625fe2))

## [1.3.0](https://github.com/Schaeffler-Group/frontend-schaeffler/compare/azure-auth-v1.2.1...azure-auth-v1.3.0) (2024-06-11)


### Features

* **shared-utils-transloco:** upgrade transloco to v7.0.0 ([#6116](https://github.com/Schaeffler-Group/frontend-schaeffler/issues/6116)) ([8babb22](https://github.com/Schaeffler-Group/frontend-schaeffler/commit/8babb222d49c8ef69fd677d632ac6b87852f3caa))
* **workspace:** migrate to control flow ([#6101](https://github.com/Schaeffler-Group/frontend-schaeffler/issues/6101)) ([bcc2f0d](https://github.com/Schaeffler-Group/frontend-schaeffler/commit/bcc2f0de21ab75dcdceb320c21268074e0940dc9))
* **workspace:** upgrade to angular 17 ([#6032](https://github.com/Schaeffler-Group/frontend-schaeffler/issues/6032)) ([2f32e47](https://github.com/Schaeffler-Group/frontend-schaeffler/commit/2f32e478cb1b1c95ac48976332011c60ce28f4e4))

## [1.2.1](https://github.com/Schaeffler-Group/frontend-schaeffler/compare/azure-auth-v1.2.0...azure-auth-v1.2.1) (2024-01-08)


### Bug Fixes

* **azure-auth:** add missing export of selector for access token ([#5891](https://github.com/Schaeffler-Group/frontend-schaeffler/issues/5891)) ([f78fbe2](https://github.com/Schaeffler-Group/frontend-schaeffler/commit/f78fbe2e9711506bf78d3bf0398a7d88107da0b5))

## [1.2.0](https://github.com/Schaeffler-Group/frontend-schaeffler/compare/azure-auth-v1.1.1...azure-auth-v1.2.0) (2023-12-14)


### Features

* **azure-auth:** add access token to auth state ([ab03847](https://github.com/Schaeffler-Group/frontend-schaeffler/commit/ab03847f9c8cd8ca197ca0f06f498849b011cb36))

## [1.1.1](https://github.com/Schaeffler-Group/frontend-schaeffler/compare/azure-auth-v1.1.0...azure-auth-v1.1.1) (2023-09-25)

## [1.1.0](https://github.com/Schaeffler-Group/frontend-schaeffler/compare/azure-auth-v1.0.4...azure-auth-v1.1.0) (2023-09-22)


### Features

* **app-shell:** update peer dependencies (5339) ([#5417](https://github.com/Schaeffler-Group/frontend-schaeffler/issues/5417)) ([8fa655b](https://github.com/Schaeffler-Group/frontend-schaeffler/commit/8fa655b608a94cb6e20d54e73187f3efb7ec750e))
* **azure-auth:** use session storage insteade of local storage ([#5109](https://github.com/Schaeffler-Group/frontend-schaeffler/issues/5109)) ([2b8b9e4](https://github.com/Schaeffler-Group/frontend-schaeffler/commit/2b8b9e4904dcadb046092610bbffc1752af22209))

## [1.0.4](https://github.com/Schaeffler-Group/frontend-schaeffler/compare/azure-auth-v1.0.3...azure-auth-v1.0.4) (2023-01-09)

### [1.0.3](https://github.com/Schaeffler-Group/frontend-schaeffler/compare/azure-auth-v1.0.2...azure-auth-v1.0.3) (2023-01-03)


### 🏭 Automation

* **workspace:** use pnpm as package and node version manager ([35e04db](https://github.com/Schaeffler-Group/frontend-schaeffler/commit/35e04dba206a3d579156300c68b2ede9206556ff))

### [1.0.2](https://github.com/Schaeffler-Group/frontend-schaeffler/compare/azure-auth-v1.0.1...azure-auth-v1.0.2) (2022-11-16)

### [1.0.1](https://github.com/Schaeffler-Group/frontend-schaeffler/compare/azure-auth-v1.0.0...azure-auth-v1.0.1) (2022-09-20)

## [1.0.0](https://github.com/Schaeffler-Group/frontend-schaeffler/compare/azure-auth-v0.2.1...azure-auth-v1.0.0) (2022-08-24)

### [0.2.1](https://github.com/Schaeffler-Group/frontend-schaeffler/compare/azure-auth-v0.2.0...azure-auth-v0.2.1) (2022-07-20)

## [0.2.0](https://github.com/Schaeffler-Group/frontend-schaeffler/compare/azure-auth-v0.1.4...azure-auth-v0.2.0) (2022-07-07)


### ⚠ BREAKING CHANGES

* **azure-auth:** usage of role related selectors changed from `this.store.select(selector)` to
`this.store.pipe(selector)`. Detailed documentation is in Readme.

* **azure-auth:** use piped selectors for role selectors ([9d138a4](https://github.com/Schaeffler-Group/frontend-schaeffler/commit/9d138a4d3a37d108c9d3ef60412e20a58f758ecc)), closes [#3857](https://github.com/Schaeffler-Group/frontend-schaeffler/issues/3857)

### [0.1.4](https://github.com/Schaeffler-Group/frontend-schaeffler/compare/azure-auth-v0.1.3...azure-auth-v0.1.4) (2022-03-22)


### 🐛 Bug Fixes

* **workspace:** fix eslint configuration for local and ci execution ([#3598](https://github.com/Schaeffler-Group/frontend-schaeffler/issues/3598)) ([4a7dc1f](https://github.com/Schaeffler-Group/frontend-schaeffler/commit/4a7dc1fe79d94b6d8ddfa7cf2644e3bbc11a3e80))


### 🎸 Features

* **ia:** add user settings and roles (IA-445) ([#3834](https://github.com/Schaeffler-Group/frontend-schaeffler/issues/3834)) ([82faa83](https://github.com/Schaeffler-Group/frontend-schaeffler/commit/82faa83a917fca37473f1d97fb062cb3afd8351b))

### [0.1.3](https://github.com/Schaeffler-Group/frontend-schaeffler/compare/azure-auth-v0.1.2...azure-auth-v0.1.3) (2022-01-11)


### 🎸 Features

* enable strictTemplate rule for all libs ([#3323](https://github.com/Schaeffler-Group/frontend-schaeffler/issues/3323)) ([55d8aef](https://github.com/Schaeffler-Group/frontend-schaeffler/commit/55d8aefd36823a5774979b7393cbe4dff41ba7de))
* **workspace:** individual project configurations instead of one global ([#3248](https://github.com/Schaeffler-Group/frontend-schaeffler/issues/3248)) ([ba451ef](https://github.com/Schaeffler-Group/frontend-schaeffler/commit/ba451ef87c9c9cff99440b9739c9ebf4069a16dc))
* **workspace:** update core dependencies ([#3381](https://github.com/Schaeffler-Group/frontend-schaeffler/issues/3381)) ([#3383](https://github.com/Schaeffler-Group/frontend-schaeffler/issues/3383)) ([3c7b0a3](https://github.com/Schaeffler-Group/frontend-schaeffler/commit/3c7b0a37be3104fc216c3ee6506d5f8ce2cadb21))
* **workspace:** use eslint for sorting of imports ([#3424](https://github.com/Schaeffler-Group/frontend-schaeffler/issues/3424)) ([546e884](https://github.com/Schaeffler-Group/frontend-schaeffler/commit/546e8845a9250580ccdc982e3f5c1d818f8678bd))

### [0.1.2](https://github.com/Schaeffler-Group/frontend-schaeffler/compare/azure-auth-v0.1.2...azure-auth-v0.1.0) (2021-09-09)

### [0.1.1](https://github.com/Schaeffler-Group/frontend-schaeffler/compare/azure-auth-v0.1.1...azure-auth-v0.1.0) (2021-09-07)

## [0.1.0](https://github.com/Schaeffler-Group/frontend-schaeffler/compare/azure-auth-v0.1.0...azure-auth-v0.0.6) (2021-09-07)


### ⚠ BREAKING CHANGES

* **azure-auth:** update peer dependencies

### 🎸 Features

* **azure-auth:** load 64x64 profile image ([#2801](https://github.com/Schaeffler-Group/frontend-schaeffler/issues/2801)) ([b5371da](https://github.com/Schaeffler-Group/frontend-schaeffler/commit/b5371da6d8eca49fa1f8d20e3fc3dc1077b03788))
* **azure-auth:** update peer dependencies ([a73d832](https://github.com/Schaeffler-Group/frontend-schaeffler/commit/a73d8321d631cae50307bef48d1cca43556c5a55))
* **libs:** adjust rxjs and ngrx versions ([f6c92d8](https://github.com/Schaeffler-Group/frontend-schaeffler/commit/f6c92d81ace947127362bd322283a8ac925ab998))
* **libs:** use partial compilation (UFTABI-4907) ([#2835](https://github.com/Schaeffler-Group/frontend-schaeffler/issues/2835)) ([27829ff](https://github.com/Schaeffler-Group/frontend-schaeffler/commit/27829ff96da6ccc3a4ee0b98bc6f766a8c4a5057))

### [0.0.6](https://github.com/Schaeffler-Group/frontend-schaeffler/compare/azure-auth-v0.0.6...azure-auth-v0.0.5) (2021-08-24)


### 🎸 Features

* **azure-auth:** implement parametrizable role selectors ([8110ddd](https://github.com/Schaeffler-Group/frontend-schaeffler/commit/8110dddbf9c08c65ae29f38b0b880b1eb82f99fe))
* **cdba:** improve role related behaviour (DSCDA-2454) ([996b8d4](https://github.com/Schaeffler-Group/frontend-schaeffler/commit/996b8d480db9c3a17ebce807d075357860d7524d))
* **workspace:** fix accessibility and numerical separator issues (UFTABI-4728) ([699fb97](https://github.com/Schaeffler-Group/frontend-schaeffler/commit/699fb97a63a9069d847dfa489386da561028e5ea))

### [0.0.5](///compare/azure-auth-v0.0.5...azure-auth-v0.0.4) (2021-05-20)


### 🎸 Features

* **cdba:** use azure-auth lib (DSCDA-2407) ([1dc33b0](///commit/1dc33b0e9f519661f81fc7e6d7570eed05c1f2a5))

### [0.0.4](///compare/azure-auth-v0.0.4...azure-auth-v0.0.3) (2021-04-29)


### 📈 Improvements

* **goldwind:** migrate to azure auth lib ([9e7823d](///commit/9e7823d74a427d01bad5fab1944a97fda893ba31))


### 🎸 Features

* **azure-auth:** implement selector for user department ([d639514](///commit/d639514910bbd5c2eaa0e1c824f79b98a8f809f9))
* **helloworld-azure:** migrate to tailwind (UFTABI-4019) ([50378ff](///commit/50378ff1d349d4526d4d39480ce8b1e4e35d56d9))

### 0.0.3 (2021-03-24)


### 🎸 Features

* **azure-auth:** create empty auth lib (UFTABI-4027) ([1b924e4](///commit/1b924e453b5961a63dd8b336c8b7b805285c594a))
* **azure-auth:** implement msal auth (UFTABI-4028) ([1a727b6](///commit/1a727b618470fa44c6fa4336458e7f4097f6d26c))
* **helloworld-azure:** use new azure auth (UFTABI-4029) ([846deb3](///commit/846deb3eb15078fb3eaa9aba74dcee23af157244))
* **mac:** use azure-auth package (UFTABI-3958) ([b143e75](///commit/b143e755bd3693c96199ff9aafbd702d85f6c6b5))
* **workspace:** build libs with prod config (UFTABI-4112) ([6cd84a2](///commit/6cd84a2b3f3b5fe695d93c28e6cf5eb69bf6c205))


### 🐛 Bug Fixes

* **workspace:** adjust libs version ([df88244](///commit/df88244a1a49ef9d4eef59a2e6b2e5cd5e2de976))
