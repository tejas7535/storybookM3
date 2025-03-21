# Release Notes of Library Shared Utils Application Insights
## [1.5.1](https://github.com/Schaeffler-Group/frontend-schaeffler/compare/application-insights-v1.5.0...application-insights-v1.5.1) (2025-03-21)

## 1.5.0 (2024-10-25)
Manual release to keep repository in sync with published versions on Artifactory.

## [1.4.0](https://github.com/Schaeffler-Group/frontend-schaeffler/compare/application-insights-v1.3.0...application-insights-v1.4.0) (2024-07-15)


### Features

* **workspace:** update to angular 18 and nx 19 ([#6259](https://github.com/Schaeffler-Group/frontend-schaeffler/issues/6259)) ([c2fec3b](https://github.com/Schaeffler-Group/frontend-schaeffler/commit/c2fec3befeaa072f87bfc4c195262d71c2b18ecf))

## [1.3.0](https://github.com/Schaeffler-Group/frontend-schaeffler/compare/application-insights-v1.2.0...application-insights-v1.3.0) (2024-06-11)


### Features

* **shared-utils-transloco:** upgrade transloco to v7.0.0 ([#6116](https://github.com/Schaeffler-Group/frontend-schaeffler/issues/6116)) ([8babb22](https://github.com/Schaeffler-Group/frontend-schaeffler/commit/8babb222d49c8ef69fd677d632ac6b87852f3caa))
* **workspace:** upgrade to angular 17 ([#6032](https://github.com/Schaeffler-Group/frontend-schaeffler/issues/6032)) ([2f32e47](https://github.com/Schaeffler-Group/frontend-schaeffler/commit/2f32e478cb1b1c95ac48976332011c60ce28f4e4))

## [1.2.0](https://github.com/Schaeffler-Group/frontend-schaeffler/compare/application-insights-v1.1.1...application-insights-v1.2.0) (2023-12-14)


### Features

* **application-insights:** allow to use URI for page visits ([#5812](https://github.com/Schaeffler-Group/frontend-schaeffler/issues/5812)) ([5a206f9](https://github.com/Schaeffler-Group/frontend-schaeffler/commit/5a206f95c4e8c3667db4418f719679c62006f0d5))

## [1.1.1](https://github.com/Schaeffler-Group/frontend-schaeffler/compare/application-insights-v1.1.0...application-insights-v1.1.1) (2023-09-25)

## [1.1.0](https://github.com/Schaeffler-Group/frontend-schaeffler/compare/application-insights-v1.0.2...application-insights-v1.1.0) (2023-09-22)


### Features

* **app-shell:** update peer dependencies (5339) ([#5417](https://github.com/Schaeffler-Group/frontend-schaeffler/issues/5417)) ([8fa655b](https://github.com/Schaeffler-Group/frontend-schaeffler/commit/8fa655b608a94cb6e20d54e73187f3efb7ec750e))

## [1.0.2](https://github.com/Schaeffler-Group/frontend-schaeffler/compare/application-insights-v1.0.1...application-insights-v1.0.2) (2023-01-09)

### [1.0.1](https://github.com/Schaeffler-Group/frontend-schaeffler/compare/application-insights-v1.0.0...application-insights-v1.0.1) (2023-01-03)


### 🏭 Automation

* **workspace:** use pnpm as package and node version manager ([35e04db](https://github.com/Schaeffler-Group/frontend-schaeffler/commit/35e04dba206a3d579156300c68b2ede9206556ff))

## [1.0.0](https://github.com/Schaeffler-Group/frontend-schaeffler/compare/application-insights-v0.1.8...application-insights-v1.0.0) (2022-11-16)

### [0.1.8](https://github.com/Schaeffler-Group/frontend-schaeffler/compare/application-insights-v0.1.7...application-insights-v0.1.8) (2022-09-20)


### ✏️ Documentation

* **application-insights:** add cookie banner documentation ([#4541](https://github.com/Schaeffler-Group/frontend-schaeffler/issues/4541)) ([84df6a4](https://github.com/Schaeffler-Group/frontend-schaeffler/commit/84df6a40a587b83df6a8ec92b74411d1d3bdac48))

### [0.1.7](https://github.com/Schaeffler-Group/frontend-schaeffler/compare/application-insights-v0.1.6...application-insights-v0.1.7) (2022-08-24)

### [0.1.6](https://github.com/Schaeffler-Group/frontend-schaeffler/compare/application-insights-v0.1.5...application-insights-v0.1.6) (2022-07-20)

### [0.1.5](https://github.com/Schaeffler-Group/frontend-schaeffler/compare/application-insights-v0.1.4...application-insights-v0.1.5) (2022-07-07)


### 🐛 Bug Fixes

* **application-insights:** adjust to handle apps without cookies ([#3988](https://github.com/Schaeffler-Group/frontend-schaeffler/issues/3988)) ([378599d](https://github.com/Schaeffler-Group/frontend-schaeffler/commit/378599d96eb620cc70d376b91d83b2f823d75b36))
* **application-insights:** only track when opt in happened ([#3932](https://github.com/Schaeffler-Group/frontend-schaeffler/issues/3932)) ([f55dc8c](https://github.com/Schaeffler-Group/frontend-schaeffler/commit/f55dc8ce3e48550b594da1d7733bd8e4f29f2efa))

### [0.1.4](https://github.com/Schaeffler-Group/frontend-schaeffler/compare/application-insights-v0.1.3...application-insights-v0.1.4) (2022-03-22)


### 🎸 Features

* **application-insights:** allow optional custom event tracking ([6fbc171](https://github.com/Schaeffler-Group/frontend-schaeffler/commit/6fbc171b5e4db9a02b3d3259c72c07c0e3470437))


### 🐛 Bug Fixes

* **application-insights:** adjust tracking to not renew userid ([#3808](https://github.com/Schaeffler-Group/frontend-schaeffler/issues/3808)) ([8c7fe4c](https://github.com/Schaeffler-Group/frontend-schaeffler/commit/8c7fe4c90b13f95cc4ff51dd3899945f44049ffd))
* **application-insights:** handle iframe, initial track event ([#3859](https://github.com/Schaeffler-Group/frontend-schaeffler/issues/3859)) ([25ceeb0](https://github.com/Schaeffler-Group/frontend-schaeffler/commit/25ceeb0d74ae8d28f2aae5ad9bc0b96084223948))
* **workspace:** fix eslint configuration for local and ci execution ([#3598](https://github.com/Schaeffler-Group/frontend-schaeffler/issues/3598)) ([4a7dc1f](https://github.com/Schaeffler-Group/frontend-schaeffler/commit/4a7dc1fe79d94b6d8ddfa7cf2644e3bbc11a3e80))

### [0.1.3](https://github.com/Schaeffler-Group/frontend-schaeffler/compare/application-insights-v0.1.2...application-insights-v0.1.3) (2022-01-11)


### 🎸 Features

* **workspace:** individual project configurations instead of one global ([#3248](https://github.com/Schaeffler-Group/frontend-schaeffler/issues/3248)) ([ba451ef](https://github.com/Schaeffler-Group/frontend-schaeffler/commit/ba451ef87c9c9cff99440b9739c9ebf4069a16dc))
* **workspace:** update core dependencies ([#3381](https://github.com/Schaeffler-Group/frontend-schaeffler/issues/3381)) ([#3383](https://github.com/Schaeffler-Group/frontend-schaeffler/issues/3383)) ([3c7b0a3](https://github.com/Schaeffler-Group/frontend-schaeffler/commit/3c7b0a37be3104fc216c3ee6506d5f8ce2cadb21))
* **workspace:** use eslint for sorting of imports ([#3424](https://github.com/Schaeffler-Group/frontend-schaeffler/issues/3424)) ([546e884](https://github.com/Schaeffler-Group/frontend-schaeffler/commit/546e8845a9250580ccdc982e3f5c1d818f8678bd))

### [0.1.2](https://github.com/Schaeffler-Group/frontend-schaeffler/compare/application-insights-v0.1.2...application-insights-v0.1.0) (2021-09-09)

### [0.1.1](https://github.com/Schaeffler-Group/frontend-schaeffler/compare/application-insights-v0.1.1...application-insights-v0.1.0) (2021-09-07)

## [0.1.0](https://github.com/Schaeffler-Group/frontend-schaeffler/compare/application-insights-v0.1.0...application-insights-v0.0.8) (2021-09-07)


### ⚠ BREAKING CHANGES

* **application-insights:** update peer deps

### 🎸 Features

* **application-insights:** update peer deps ([682bc6d](https://github.com/Schaeffler-Group/frontend-schaeffler/commit/682bc6df164ed77bb56187dc2d2cfe685ae27bb3))
* **libs:** use partial compilation (UFTABI-4907) ([#2835](https://github.com/Schaeffler-Group/frontend-schaeffler/issues/2835)) ([27829ff](https://github.com/Schaeffler-Group/frontend-schaeffler/commit/27829ff96da6ccc3a4ee0b98bc6f766a8c4a5057))

### [0.0.8](https://github.com/Schaeffler-Group/frontend-schaeffler/compare/application-insights-v0.0.8...application-insights-v0.0.7) (2021-08-24)


### 🎸 Features

* **mm:** tracking opt in based on consent (UFTABI-4827) ([539d331](https://github.com/Schaeffler-Group/frontend-schaeffler/commit/539d3319b5694c97d3eb71e2cc6483ec487fe121))
* **workspace:** fix accessibility and numerical separator issues (UFTABI-4728) ([699fb97](https://github.com/Schaeffler-Group/frontend-schaeffler/commit/699fb97a63a9069d847dfa489386da561028e5ea))


### 🐛 Bug Fixes

* **application-insights:** delete cookies on opt out (UFTABI-4888) ([96dd692](https://github.com/Schaeffler-Group/frontend-schaeffler/commit/96dd692139fca44610643601d9a10ab44dd2a546))

### [0.0.7](///compare/application-insights-v0.0.7...application-insights-v0.0.6) (2021-05-20)

### [0.0.6](///compare/application-insights-v0.0.6...application-insights-v0.0.5) (2021-04-29)


### 🐛 Bug Fixes

* **cdba:** correctly report department to application insights (DSCDA-2079) ([4bc998c](///commit/4bc998c930be893c7c8f0b3d8168a615fa594f51))

### [0.0.5](///compare/application-insights-v0.0.5...application-insights-v0.0.3) (2021-03-24)


### 🎸 Features

* **application-insights:** enable additional custom telemetry data (DSCDA-2215) ([d7a2309](///commit/d7a23096c1f8b50c24a87f9207a182e0c0dfcf88))
* **workspace:** build libs with prod config (UFTABI-4112) ([6cd84a2](///commit/6cd84a2b3f3b5fe695d93c28e6cf5eb69bf6c205))


### 🐛 Bug Fixes

* **workspace:** adjust libs version ([df88244](///commit/df88244a1a49ef9d4eef59a2e6b2e5cd5e2de976))

### [0.0.3](///compare/application-insights-v0.0.3...application-insights-v0.0.2) (2021-01-22)


### 🎸 Features

* **deps:** update to nx 11 and fix jest setup ([4df2df3](///commit/4df2df38f8a3fa29abae9b9f736e7d237344541b))

### 0.0.2 (2020-11-25)


### 🎸 Features

* **cdba:** add application insights to application (DSCDA-2032) ([7ab80f3](///commit/7ab80f3b8b824a293f4621f7db087b231d582b89))
