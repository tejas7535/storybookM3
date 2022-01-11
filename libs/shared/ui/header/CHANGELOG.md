 Changelog

All notable changes to this project will be documented in this file. See [standard-version](https://github.com/conventional-changelog/standard-version) for commit guidelines.
**Note:** Dependency updates, refactored code & style/test/performance changes are not shown within this changelog. Thus, releases without any entries may occur.

## [3.1.0](https://github.com/Schaeffler-Group/frontend-schaeffler/compare/header-v3.0.2...header-v3.1.0) (2022-01-11)


### 🎸 Features

* enable strictTemplate rule for all libs ([#3323](https://github.com/Schaeffler-Group/frontend-schaeffler/issues/3323)) ([55d8aef](https://github.com/Schaeffler-Group/frontend-schaeffler/commit/55d8aefd36823a5774979b7393cbe4dff41ba7de))
* reduce css bundle sizes ([#3348](https://github.com/Schaeffler-Group/frontend-schaeffler/issues/3348)) ([#3377](https://github.com/Schaeffler-Group/frontend-schaeffler/issues/3377)) ([1978d74](https://github.com/Schaeffler-Group/frontend-schaeffler/commit/1978d745d959d521f060f51e98ab85a2390612bf))
* **workspace:** individual project configurations instead of one global ([#3248](https://github.com/Schaeffler-Group/frontend-schaeffler/issues/3248)) ([ba451ef](https://github.com/Schaeffler-Group/frontend-schaeffler/commit/ba451ef87c9c9cff99440b9739c9ebf4069a16dc))
* **workspace:** update core dependencies ([#3381](https://github.com/Schaeffler-Group/frontend-schaeffler/issues/3381)) ([#3383](https://github.com/Schaeffler-Group/frontend-schaeffler/issues/3383)) ([3c7b0a3](https://github.com/Schaeffler-Group/frontend-schaeffler/commit/3c7b0a37be3104fc216c3ee6506d5f8ce2cadb21))
* **workspace:** use eslint for sorting of imports ([#3424](https://github.com/Schaeffler-Group/frontend-schaeffler/issues/3424)) ([546e884](https://github.com/Schaeffler-Group/frontend-schaeffler/commit/546e8845a9250580ccdc982e3f5c1d818f8678bd))

### [3.0.2](https://github.com/Schaeffler-Group/frontend-schaeffler/compare/header-v3.0.2...header-v3.0.0) (2021-09-09)

### [3.0.1](https://github.com/Schaeffler-Group/frontend-schaeffler/compare/header-v3.0.1...header-v3.0.0) (2021-09-07)

## [3.0.0](https://github.com/Schaeffler-Group/frontend-schaeffler/compare/header-v3.0.0...header-v2.5.0) (2021-09-07)


### ⚠ BREAKING CHANGES

* **header:** update peer dependencies

### 🎸 Features

* **header:** update peer dependencies ([8015c39](https://github.com/Schaeffler-Group/frontend-schaeffler/commit/8015c39241fa213e4e69a7e646da3b4131ee7b9a))
* **libs:** adjust rxjs and ngrx versions ([f6c92d8](https://github.com/Schaeffler-Group/frontend-schaeffler/commit/f6c92d81ace947127362bd322283a8ac925ab998))
* **libs:** use partial compilation (UFTABI-4907) ([#2835](https://github.com/Schaeffler-Group/frontend-schaeffler/issues/2835)) ([27829ff](https://github.com/Schaeffler-Group/frontend-schaeffler/commit/27829ff96da6ccc3a4ee0b98bc6f766a8c4a5057))

## [2.5.0](https://github.com/Schaeffler-Group/frontend-schaeffler/compare/header-v2.5.0...header-v2.4.1) (2021-08-24)


### 🎸 Features

* **header:** reimplement header with tailwindr ([#2712](https://github.com/Schaeffler-Group/frontend-schaeffler/issues/2712)) ([8b9b0bb](https://github.com/Schaeffler-Group/frontend-schaeffler/commit/8b9b0bb36137d5d2518754a74292afe269f12cc7))
* **workspace:** fix accessibility and numerical separator issues (UFTABI-4728) ([699fb97](https://github.com/Schaeffler-Group/frontend-schaeffler/commit/699fb97a63a9069d847dfa489386da561028e5ea))


### 🐛 Bug Fixes

* **cdba:** prevent layout break due to css class name overlapse (DSCDA-2460) ([bd7a99a](https://github.com/Schaeffler-Group/frontend-schaeffler/commit/bd7a99a739e4c0ca661c213207116bddcba57dc4))
* **header:** fix header padding ([#2797](https://github.com/Schaeffler-Group/frontend-schaeffler/issues/2797)) ([1c9f34b](https://github.com/Schaeffler-Group/frontend-schaeffler/commit/1c9f34b67d49c820d60872eafde55cb9d318b0a0))
* **workspace:** move from tailwind to actual inline styles ([#2731](https://github.com/Schaeffler-Group/frontend-schaeffler/issues/2731)) ([551c77f](https://github.com/Schaeffler-Group/frontend-schaeffler/commit/551c77fbcf76390117631bf669fd7456880d014e))

### [2.4.1](///compare/header-v2.4.1...header-v2.4.0) (2021-05-20)


### 🏭 Automation

* **workspace:** adjust lint rules (UFTABI-4456) ([bcd52ff](///commit/bcd52ffddcf2011986085d510bc54488903a90dc))

## [2.4.0](///compare/header-v2.4.0...header-v2.3.0) (2021-04-29)


### 🎸 Features

* **transloco:** update transloco testing module (UFTABI-4323) ([47630c6](///commit/47630c62ca451d70e613182684fc34506a34705a))

## [2.3.0](///compare/header-v2.3.0...header-v2.1.0) (2021-03-24)


### 📈 Improvements

* **header:** fix cursor behavior across browsers (UFTABI-3955) ([ccd20fa](///commit/ccd20fa064407f9615417762cb1bfa68a42ecde4))


### 🎸 Features

* **header:** allow links in header title  (UFTABI-3751) ([0193893](///commit/0193893576f6d63d89b5763d2e0414d58f32a467))
* **header:** fix logo sizing ([278316d](///commit/278316dce43d2b62c551239deb1c90a5cf424cd2))
* **helloworld-azure:** use new azure auth (UFTABI-4029) ([846deb3](///commit/846deb3eb15078fb3eaa9aba74dcee23af157244))
* **mm:** setup tailwind with schematic (UFTABI-3647) ([c7766c3](///commit/c7766c37d22de27da23c173dda495b8e008ce3c9))
* **workspace:** build libs with prod config (UFTABI-4112) ([6cd84a2](///commit/6cd84a2b3f3b5fe695d93c28e6cf5eb69bf6c205))


### 🐛 Bug Fixes

* **header:** fix header burger icon size (UFTABI-3747) ([11479ab](///commit/11479ab2286934283a504d6f7647064ab55a77cf))
* **workspace:** adjust libs version ([df88244](///commit/df88244a1a49ef9d4eef59a2e6b2e5cd5e2de976))

## [2.1.0](///compare/header-v2.1.0...header-v2.0.0) (2021-01-22)


### 📈 Improvements

* **workspace:** adjust header and tabbar shadows (DSCDA-2064) ([7c0a35f](///commit/7c0a35f0d93ba631cfe4c8dfa2515964b4f9f621))


### 🎸 Features

* **deps:** update to nx 11 and fix jest setup ([4df2df3](///commit/4df2df38f8a3fa29abae9b9f736e7d237344541b))

## 2.0.0 (2020-11-25)


### ⚠ BREAKING CHANGES

* **header:** Header, Responsive and Transloco are moved to new publishable libraries (@schaeffler/shared/ui-components --> `@schaeffler/header`; @schaeffler/shared/responsive --> `@schaeffler/responsive`; @schaeffler/shared/transloco--> `@schaeffler/transloco`)

### 🎸 Features

* **deps:** update to angular v10.1 and typescript 4.0.2 ([edc0bb1](///commit/edc0bb1d32af1b0b585de3f79bc96eaf393c240e))
* **file-drop:** create storybook (UFTABI-2512) ([4385504](///commit/4385504e3d79f4145b3d1831fe5d01297b19c4c1))
* **header:** add storybook stories (UFTABI-2510) ([5f4564e](///commit/5f4564e57b5a18d9bdde9a8a7e72949bfc100def))
* **header:** migrate lib to publishable lib (UFTABI-2670) ([68e711a](///commit/68e711afe8b69a2c216031c527b9e84b5c551c22))
* **header:** split header into seperate publishable lib (UFTABI-2309) ([721ead8](///commit/721ead8681c9ce017e6ff939911dc31d449831f7))
* **sidebar:** add storybook stories (UFTABI-2516) ([983ff75](///commit/983ff7543a52c564b3b60c5d02f2b438a3a19fa1))
* **sidebar:** split sidebar into separate publishable lib (UFTABI-2310) ([94f2ba5](///commit/94f2ba5421d4d12af18cb0efe25fe52fbd6893c0))
* **styles:** make styles lib publishable (UFTABI-2916) ([245e355](///commit/245e355c6de4dafff18bdf03301074adb41669c3))
* **workspace:** enable auto-populated publishable library dependencies (UFTABI-2390) ([471e246](///commit/471e246144837957500060590020b380a0940c39))
* release v1 (UFTABI-2483) ([79c1ba7](///commit/79c1ba7c6c1af8ccd909083d91fffbe0ae017ebb))


### ✏️ Documentation

* **shared-libs:** improve documentation ([18b709a](///commit/18b709a184a4ff7c2c342620bfec4a297831ae6e))


### 📈 Improvements

* **workspace:** adjust libs to ensure angular 11 compatibility ([08e417a](///commit/08e417a2e3a8c2404681863ff6466216e9ba80c6))

### [1.5.4](///compare/v1.9.0...v1.5.4) (2020-11-02)

### [1.5.3](https://gitlab.schaeffler.com/frontend-schaeffler/schaeffler-frontend/compare/v1.9.0...v1.5.3) (2020-10-27)

### [1.5.2](///compare/v1.7.0...v1.5.2) (2020-10-12)


### ✏️ Documentation

* **shared-libs:** improve documentation ([18b709a](///commit/18b709a184a4ff7c2c342620bfec4a297831ae6e))

### [1.5.1](///compare/v1.6.0...v1.5.1) (2020-09-28)

### [1.2.1](///compare/v1.2.0...v1.2.1) (2020-08-07)

## [1.2.0](///compare/v1.1.0...v1.2.0) (2020-07-21)


### 🎸 Features

* **workspace:** enable auto-populated publishable library dependencies (UFTABI-2390) ([471e246](///commit/471e246144837957500060590020b380a0940c39))

## [1.1.0](///compare/v0.5.0...v1.1.0) (2020-07-01)


### 🎸 Features

* **file-drop:** create storybook (UFTABI-2512) ([4385504](///commit/4385504e3d79f4145b3d1831fe5d01297b19c4c1))
* **header:** add storybook stories (UFTABI-2510) ([5f4564e](///commit/5f4564e57b5a18d9bdde9a8a7e72949bfc100def))
* **sidebar:** add storybook stories (UFTABI-2516) ([983ff75](///commit/983ff7543a52c564b3b60c5d02f2b438a3a19fa1))
* release v1 (UFTABI-2483) ([79c1ba7](///commit/79c1ba7c6c1af8ccd909083d91fffbe0ae017ebb))

## [1.0.0](///compare/v0.5.0...v1.0.0) (2020-06-02)

**⚠ First official release that contains all previous releases ⚠**